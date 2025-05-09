from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.base import Base
import os
from dotenv import load_dotenv
import time
from sqlalchemy.exc import OperationalError
from psycopg2 import connect, Error as Psycopg2Error
import logging

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@db:5432/challenge_db")
engine = create_engine(DATABASE_URL, connect_args={"connect_timeout": 5})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Configure logging
logging.basicConfig(
    filename="/app/debug.log",
    level=logging.DEBUG,
    format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

def init_db():
    retries = 5
    while retries > 0:
        try:
            logger.debug("Attempting to initialize database")
            Base.metadata.drop_all(bind=engine)
            Base.metadata.create_all(bind=engine)
            logger.debug("Database tables created successfully")

            conn = connect(DATABASE_URL)
            conn.autocommit = True
            cursor = conn.cursor()

            sql_files = [
                ("data/init_db.sql", "Initializing database schema"),
                ("data/mock_data.sql", "Loading mock data")
            ]
            for file_path, action in sql_files:
                if os.path.exists(file_path):
                    with open(file_path, "r") as f:
                        sql = f.read()
                    logger.debug(f"{action} from {file_path}")
                    cursor.execute(sql)
                else:
                    logger.warning(f"SQL file not found: {file_path}")

            cursor.close()
            conn.close()
            logger.info("Database initialization completed")
            break
        except (OperationalError, Psycopg2Error) as e:
            logger.error(f"Database operation failed: {str(e)}", exc_info=True)
            retries -= 1
            if retries > 0:
                logger.debug(f"Retrying database initialization ({retries} attempts left)...")
                time.sleep(5)
            else:
                logger.error("Failed to initialize database after multiple attempts")
                raise
        except Exception as e:
            logger.error(f"Unexpected error during database initialization: {str(e)}", exc_info=True)
            raise

def get_db():
    logger.debug("Attempting to create database session")
    db = None
    try:
        db = SessionLocal()
        logger.debug("Database session created successfully")
        return db
    except Exception as e:
        logger.error(f"Error in database session: {str(e)}", exc_info=True)
        raise
    finally:
        if db:
            logger.debug("Closing database session")
            db.close()