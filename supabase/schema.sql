-- Database Schema for RepoRoast

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table (GitHub OAuth profiles)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    github_id VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Repositories Cache Table
CREATE TABLE IF NOT EXISTS public.repo_caches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    repo_url TEXT UNIQUE NOT NULL,
    owner VARCHAR(255) NOT NULL,
    repo_name VARCHAR(255) NOT NULL,
    file_tree JSONB,
    readme_content TEXT,
    last_fetched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Interview Sessions Table
CREATE TABLE IF NOT EXISTS public.interviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    repo_url TEXT NOT NULL,
    persona VARCHAR(100) NOT NULL,
    custom_persona TEXT,
    current_level INT DEFAULT 1 CHECK (current_level >= 1 AND current_level <= 10),
    question_count INT DEFAULT 1 CHECK (question_count >= 1 AND question_count <= 5),
    status VARCHAR(50) DEFAULT 'in_progress', -- 'in_progress', 'completed'
    scorecard_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Interview Messages Log Table
CREATE TABLE IF NOT EXISTS public.interview_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    interview_id UUID REFERENCES public.interviews(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL, -- 'interviewer', 'candidate'
    content TEXT NOT NULL,
    question_number INT NOT NULL,
    level INT NOT NULL,
    is_hint BOOLEAN DEFAULT FALSE,
    is_panic BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexing for performance
CREATE INDEX IF NOT EXISTS idx_interviews_user ON public.interviews(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_interview ON public.interview_messages(interview_id);
