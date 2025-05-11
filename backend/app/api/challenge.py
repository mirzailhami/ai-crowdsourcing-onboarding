# app/api/challenge.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.challenge import Challenge, ChallengeCreate, ChallengeUpdate
from app.models.challenge import Challenge as ChallengeModel
from app.services.db_service import get_db
import logging
from datetime import datetime
from dateutil.parser import isoparse  # For validating ISO strings

router = APIRouter()

# Configure logging
logging.basicConfig(
    filename="/app/debug.log",
    level=logging.DEBUG,
    format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

def serialize_datetime(obj):
    """Convert datetime objects to ISO format strings, or validate ISO strings."""
    if isinstance(obj, datetime):
        return obj.isoformat()
    elif isinstance(obj, str):
        try:
            # Validate that the string is a valid ISO date
            isoparse(obj)
            return obj  # If it's already a valid ISO string, return it unchanged
        except ValueError:
            raise ValueError(f"Invalid ISO date string: {obj}")
    raise TypeError(f"Object of type {type(obj).__name__} is not JSON serializable")

@router.post("/challenges", response_model=Challenge)
async def create_challenge(challenge: ChallengeCreate, db: Session = Depends(get_db)):
    logger.info(f"Request: POST /api/challenges, payload={challenge.dict()}")
    
    # Convert challenge data to a dictionary and handle datetime objects
    challenge_data = challenge.dict()
    
    # Convert start_date and end_date to ISO strings if they are datetime objects
    if challenge_data.get("start_date"):
        if isinstance(challenge_data["start_date"], datetime):
            challenge_data["start_date"] = challenge_data["start_date"].isoformat()
        elif isinstance(challenge_data["start_date"], str):
            try:
                isoparse(challenge_data["start_date"])
            except ValueError:
                raise ValueError(f"Invalid ISO date string for start_date: {challenge_data['start_date']}")
    
    if challenge_data.get("end_date"):
        if isinstance(challenge_data["end_date"], datetime):
            challenge_data["end_date"] = challenge_data["end_date"].isoformat()
        elif isinstance(challenge_data["end_date"], str):
            try:
                isoparse(challenge_data["end_date"])
            except ValueError:
                raise ValueError(f"Invalid ISO date string for end_date: {challenge_data['end_date']}")
    
    # Process milestones
    if challenge_data.get("milestones"):
        challenge_data["milestones"] = [
            {
                "enabled": m["enabled"],
                "name": m["name"],
                "date": serialize_datetime(m["date"]) if m.get("date") else None
            }
            for m in challenge_data["milestones"]
        ]

    # Create and save the challenge
    db_challenge = ChallengeModel(**challenge_data)
    db.add(db_challenge)
    db.commit()
    db.refresh(db_challenge)

    # Convert datetime fields to ISO strings for the response
    db_challenge.start_date = db_challenge.start_date.isoformat() if db_challenge.start_date else None
    db_challenge.end_date = db_challenge.end_date.isoformat() if db_challenge.end_date else None
    db_challenge.created_at = db_challenge.created_at.isoformat()
    db_challenge.updated_at = db_challenge.updated_at.isoformat()

    logger.info(f"Response: {db_challenge.__dict__}")
    return db_challenge

@router.get("/challenges", response_model=list[Challenge])
async def get_challenges(db: Session = Depends(get_db)):
    logger.info(f"Request: GET /api/challenges")
    challenges = db.query(ChallengeModel).all()
    # Convert datetime fields for each challenge in the response
    for challenge in challenges:
        challenge.start_date = challenge.start_date.isoformat() if challenge.start_date else None
        challenge.end_date = challenge.end_date.isoformat() if challenge.end_date else None
        challenge.created_at = challenge.created_at.isoformat()
        challenge.updated_at = challenge.updated_at.isoformat()
    logger.info(f"Response: {[{k: v for k, v in c.__dict__.items() if not k.startswith('_')} for c in challenges]}")
    return challenges

@router.get("/challenges/{id}", response_model=Challenge)
async def get_challenge(id: int, db: Session = Depends(get_db)):
    logger.info(f"Request: GET /api/challenges/{id}")
    challenge = db.query(ChallengeModel).filter(ChallengeModel.id == id).first()
    if not challenge:
        logger.error(f"Challenge not found: id={id}")
        raise HTTPException(status_code=404, detail="Challenge not found")
    # Convert datetime fields for the response
    challenge.start_date = challenge.start_date.isoformat() if challenge.start_date else None
    challenge.end_date = challenge.end_date.isoformat() if challenge.end_date else None
    challenge.created_at = challenge.created_at.isoformat()
    challenge.updated_at = challenge.updated_at.isoformat()
    logger.info(f"Response: {challenge.__dict__}")
    return challenge

@router.put("/challenges/{id}", response_model=Challenge)
async def update_challenge(id: int, challenge: ChallengeUpdate, db: Session = Depends(get_db)):
    logger.info(f"Request: PUT /api/challenges/{id}, payload={challenge.dict(exclude_unset=True)}")
    db_challenge = db.query(ChallengeModel).filter(ChallengeModel.id == id).first()
    if not db_challenge:
        logger.error(f"Challenge not found: id={id}")
        raise HTTPException(status_code=404, detail="Challenge not found")
    for key, value in challenge.dict(exclude_unset=True).items():
        setattr(db_challenge, key, value)
    db.commit()
    db.refresh(db_challenge)
    # Convert datetime fields for the response
    db_challenge.start_date = db_challenge.start_date.isoformat() if db_challenge.start_date else None
    db_challenge.end_date = db_challenge.end_date.isoformat() if db_challenge.end_date else None
    db_challenge.created_at = db_challenge.created_at.isoformat()
    db_challenge.updated_at = db_challenge.updated_at.isoformat()
    logger.info(f"Response: {db_challenge.__dict__}")
    return db_challenge