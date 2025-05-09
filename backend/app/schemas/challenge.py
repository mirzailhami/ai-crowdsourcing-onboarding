from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class Milestone(BaseModel):
    enabled: bool
    name: str
    date: Optional[datetime] = None

class EvaluationCriterion(BaseModel):
    name: str
    weight: str
    description: str

class ChallengeBase(BaseModel):
    title: str
    problem_statement: Optional[str] = None
    goals: Optional[str] = None
    challenge_type: Optional[str] = None
    participant_type: Optional[str] = None
    geographic_filter: Optional[str] = None
    language: Optional[str] = None
    team_participation: Optional[bool] = None
    enable_forums: Optional[bool] = None
    submission_formats: Optional[List[str]] = None
    submission_documentation: Optional[List[str]] = None
    submission_instructions: Optional[str] = None
    prize_model: Optional[str] = None
    first_prize: Optional[float] = None
    second_prize: Optional[float] = None
    third_prize: Optional[float] = None
    honorable_mentions: Optional[int] = None
    budget: Optional[float] = None
    non_monetary_rewards: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    milestones: Optional[List[Milestone]] = None
    timeline_notes: Optional[str] = None
    evaluation_model: Optional[str] = None
    reviewers: Optional[List[str]] = None
    evaluation_criteria: Optional[List[EvaluationCriterion]] = None
    anonymized_review: Optional[bool] = None
    notification_preferences: Optional[List[str]] = None
    notification_methods: Optional[List[str]] = None
    announcement_template: Optional[str] = None
    access_level: Optional[List[str]] = None
    success_metrics: Optional[str] = None

class ChallengeCreate(ChallengeBase):
    title: str  # Required for creation

class ChallengeUpdate(ChallengeBase):
    pass

class Challenge(ChallengeBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True