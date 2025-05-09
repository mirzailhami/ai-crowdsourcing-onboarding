from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.api.challenge import router as challenge_router
from app.api.help_request import router as help_request_router
from app.api.copilot import router as copilot_router
from app.services.db_service import init_db
import logging
import time

# Configure logging
logging.basicConfig(
    filename="/app/debug.log",
    level=logging.DEBUG,
    format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

app = FastAPI(
    openapi_url="/api/openapi.json",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logging middleware
# @app.middleware("http")
# async def log_requests(request: Request, call_next):
#     start_time = time.time()
#     logger.debug(f"Request: {request.method} {request.url} Headers: {request.headers}")
#     try:
#         # Use request.json() for JSON requests, avoiding body consumption
#         if request.headers.get("content-type") == "application/json":
#             body = await request.json()
#             logger.debug(f"Request body: {body}")
#         else:
#             body = await request.body()
#             if body:
#                 logger.debug(f"Request body: {body.decode('utf-8')}")
#     except Exception as e:
#         logger.error(f"Error reading request body: {e}")
    
#     logger.debug(f"Processing request: {request.method} {request.url}")
#     try:
#         response = await call_next(request)
#     except Exception as e:
#         logger.error(f"Error processing request: {str(e)}", exc_info=True)
#         raise
    
#     duration = time.time() - start_time
#     logger.info(f"Response: {response.status_code} Duration: {duration:.2f}s")
#     return response

app.include_router(challenge_router, prefix="/api")
app.include_router(help_request_router, prefix="/api")
app.include_router(copilot_router, prefix="/api")

@app.on_event("startup")
def startup_event():
    try:
        logger.debug("Initializing database")
        init_db()
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize database: {str(e)}", exc_info=True)
        raise

@app.get("/api")
async def root():
    return {"message": "CrowdLaunch API"}