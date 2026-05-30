-- =========================================================================
-- 🏛️ SUPABASE DATABASE INITIAL SCHEMASTORE & MIGRATION SCRIPT
-- =========================================================================
-- Purpose: Complete, production-ready schema configuration for profiles,
-- daily solve metrics, global leaderboard aggregates, and automation triggers.
-- =========================================================================

-- -------------------------------------------------------------------------
-- 👤 1. PROFILES SCHEMA (public.profiles)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nickname TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    level INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -------------------------------------------------------------------------
-- 🧩 2. DAILY SOLVES SCHEMA (public.daily_solves)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.daily_solves (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    solve_date DATE NOT NULL DEFAULT CURRENT_DATE,
    time_taken INTEGER NOT NULL, -- Tracks time in seconds
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_user_daily_solve UNIQUE (user_id, solve_date),
    CONSTRAINT time_taken_positive CHECK (time_taken > 0)
);

-- -------------------------------------------------------------------------
-- 🏆 3. LEADERBOARD VIEWS (public.fastest_solves_leaderboard & public.global_player_leaderboard)
-- -------------------------------------------------------------------------

-- View A: Fastest Solves Leaderboard (Individual solves sorted by time taken)
CREATE OR REPLACE VIEW public.fastest_solves_leaderboard AS
SELECT 
    ds.id AS solve_id,
    ds.user_id,
    p.nickname,
    p.avatar_url,
    p.level,
    ds.solve_date,
    ds.time_taken,
    ds.completed_at
FROM public.daily_solves ds
JOIN public.profiles p ON ds.user_id = p.id
ORDER BY ds.time_taken ASC;

-- View B: Global Player Leaderboard (Aggregated user statistics)
CREATE OR REPLACE VIEW public.global_player_leaderboard AS
SELECT 
    p.id AS user_id,
    p.nickname,
    p.avatar_url,
    p.level,
    COUNT(ds.id) AS total_solves,
    SUM(ds.time_taken) AS total_time_taken,
    MIN(ds.time_taken) AS best_solve_time,
    ROUND(AVG(ds.time_taken))::INTEGER AS average_solve_time
FROM public.profiles p
LEFT JOIN public.daily_solves ds ON p.id = ds.user_id
GROUP BY p.id, p.nickname, p.avatar_url, p.level
ORDER BY total_solves DESC, average_solve_time ASC;

-- -------------------------------------------------------------------------
-- 🔒 4. ROW LEVEL SECURITY (RLS) ACTIVATION
-- -------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_solves ENABLE ROW LEVEL SECURITY;

-- -------------------------------------------------------------------------
-- 🔑 5. ROW LEVEL SECURITY POLICIES
-- -------------------------------------------------------------------------

-- Profiles Policies
CREATE POLICY "Allow public read access for profiles" 
ON public.profiles FOR SELECT 
USING (true);

CREATE POLICY "Allow users to update their own profile" 
ON public.profiles FOR UPDATE 
TO authenticated 
USING (auth.uid() = id) 
WITH CHECK (auth.uid() = id);

-- Daily Solves Policies
CREATE POLICY "Allow public read access for solves" 
ON public.daily_solves FOR SELECT 
USING (true);

CREATE POLICY "Allow authenticated users to insert their own solves" 
ON public.daily_solves FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- -------------------------------------------------------------------------
-- 🤖 6. AUTOMATED USER REGISTRATION TRIGGER (auth.users -> public.profiles)
-- -------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    temp_nickname TEXT;
    email_prefix TEXT;
    base_nickname TEXT;
    counter INTEGER := 0;
BEGIN
    -- Extract prefix of email address (e.g. "player_name" from "player_name@gmail.com")
    email_prefix := SPLIT_PART(NEW.email, '@', 1);
    
    -- Pick a starting base nickname, prioritizing custom metadata if supplied
    base_nickname := COALESCE(
        NEW.raw_user_meta_data->>'nickname',
        NEW.raw_user_meta_data->>'full_name',
        email_prefix,
        'player'
    );
    
    -- Strip non-alphanumeric characters except underscores for system hygiene
    base_nickname := REGEXP_REPLACE(base_nickname, '[^a-zA-Z0-9_]', '', 'g');
    
    -- Enforce minimum username length of 3 characters
    IF LENGTH(base_nickname) < 3 THEN
        base_nickname := base_nickname || '123';
    END IF;

    temp_nickname := base_nickname;

    -- Avoid collisions: loop and append numerical increments until a unique nickname is found
    WHILE EXISTS (SELECT 1 FROM public.profiles WHERE nickname = temp_nickname) LOOP
        counter := counter + 1;
        temp_nickname := base_nickname || counter::TEXT;
    END LOOP;

    -- Insert into public profiles table
    INSERT INTO public.profiles (id, nickname, avatar_url, level)
    VALUES (
        NEW.id,
        temp_nickname,
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', NULL),
        0
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger function to auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
