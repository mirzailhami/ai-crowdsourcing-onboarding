from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.help_request import HelpRequest, HelpRequestCreate
from app.models.help_request import HelpRequest as HelpRequestModel
from app.services.db_service import get_db
import logging
import time

router = APIRouter(prefix="/help")

# Configure logging
logging.basicConfig(
    filename="/app/debug.log",
    level=logging.DEBUG,
    format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

@router.post("", response_model=HelpRequest)
def create_help_request(help_request: HelpRequestCreate, db: Session = Depends(get_db)):
    logger.debug(f"Starting POST /api/help with payload: {help_request.dict()}")
    session = db
    try:
        logger.debug("Creating help request in database")
        start_time = time.time()
        db_help_request = HelpRequestModel(**help_request.dict())
        session.add(db_help_request)
        logger.debug("Added help request to session, committing")
        session.commit()
        logger.debug("Committed transaction, refreshing help request")
        session.refresh(db_help_request)
        duration = time.time() - start_time
        logger.info(f"Successfully created help request: {db_help_request.__dict__}, Duration: {duration:.2f}s")
        return db_help_request
    except HTTPException as e:
        logger.error(f"HTTP error in create_help_request: {str(e)}")
        raise
    except Exception as e:
        logger.error(f"Unexpected error in create_help_request: {str(e)}", exc_info=True)
        session.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create help request: {str(e)}")