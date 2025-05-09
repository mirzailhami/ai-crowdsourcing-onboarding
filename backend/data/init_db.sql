DROP TABLE IF EXISTS help_requests CASCADE;
DROP TABLE IF EXISTS challenges CASCADE;

-- This table stores information about challenges
CREATE TABLE IF NOT EXISTS challenges (
    id SERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    problem_statement TEXT,
    goals TEXT,
    challenge_type VARCHAR,
    participant_type VARCHAR,
    geographic_filter VARCHAR,
    language VARCHAR,
    team_participation BOOLEAN,
    enable_forums BOOLEAN,
    submission_formats JSONB,
    submission_documentation JSONB,
    submission_instructions TEXT,
    prize_model VARCHAR,
    first_prize FLOAT,
    second_prize FLOAT,
    third_prize FLOAT,
    honorable_mentions INTEGER,
    budget FLOAT,
    non_monetary_rewards TEXT,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    milestones JSONB,
    timeline_notes TEXT,
    evaluation_model VARCHAR,
    reviewers JSONB,
    evaluation_criteria JSONB,
    anonymized_review BOOLEAN,
    notification_preferences JSONB,
    notification_methods JSONB,
    announcement_template TEXT,
    access_level JSONB,
    success_metrics TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- This table stores help requests from users
CREATE TABLE help_requests (
    id SERIAL PRIMARY KEY,
    message TEXT NOT NULL,
    support_type VARCHAR(255) NOT NULL,
    urgency VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL
);