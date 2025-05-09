from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.challenge import Challenge, ChallengeCreate, ChallengeUpdate
from app.models.challenge import Challenge as ChallengeModel
from app.services.db_service import get_db
import logging

router = APIRouter()

# Configure logging
logging.basicConfig(
    filename="/app/debug.log",
    level=logging.DEBUG,
    format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

@router.post("/challenges", response_model=Challenge)
async def create_challenge(challenge: ChallengeCreate, db: Session = Depends(get_db)):
    logger.info(f"Request: POST /api/challenges, payload={challenge.dict()}")
    db_challenge = ChallengeModel(**challenge.dict())
    db.add(db_challenge)
    db.commit()
    db.refresh(db_challenge)
    logger.info(f"Response: {db_challenge.__dict__}")
    return db_challenge

@router.get("/challenges", response_model=list[Challenge])
async def get_challenges(db: Session = Depends(get_db)):
    logger.info(f"Request: GET /api/challenges")
    challenges = db.query(ChallengeModel).all()
    logger.info(f"Response: {[{k: v for k, v in c.__dict__.items() if not k.startswith('_')} for c in challenges]}")
    return challenges

@router.get("/challenges/{id}", response_model=Challenge)
async def get_challenge(id: int, db: Session = Depends(get_db)):
    logger.info(f"Request: GET /api/challenges/{id}")
    challenge = db.query(ChallengeModel).filter(ChallengeModel.id == id).first()
    if not challenge:
        logger.error(f"Challenge not found: id={id}")
        raise HTTPException(status_code=404, detail="Challenge not found")
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
    logger.info(f"Response: {db_challenge.__dict__}")
    return db_challenge