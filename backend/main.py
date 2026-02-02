from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import asyncio
from datetime import datetime, time
from config import settings
from database import Base, engine
from routes import auth, templates, products
from routes.templates import perform_sync, get_metadata
# Import models to ensure tables are created
from models.otp import OTP  # noqa: F401

# Create database tables
Base.metadata.create_all(bind=engine)

# Background task for scheduled sync
async def scheduled_sync_task():
    """Background task that syncs from GitHub every day at 6:00 AM"""
    while True:
        now = datetime.now()
        # Calculate time until next 6:00 AM
        target_time = time(6, 0, 0)  # 6:00 AM
        
        if now.time() >= target_time:
            # If it's past 6 AM today, schedule for tomorrow
            tomorrow = now.date().toordinal() + 1
            next_run = datetime.fromordinal(tomorrow).replace(hour=6, minute=0, second=0)
        else:
            # Schedule for today at 6 AM
            next_run = now.replace(hour=6, minute=0, second=0, microsecond=0)
        
        wait_seconds = (next_run - now).total_seconds()
        print(f"[Scheduler] Next GitHub sync scheduled at {next_run} ({wait_seconds:.0f} seconds from now)")
        
        await asyncio.sleep(wait_seconds)
        
        # Perform sync
        print(f"[Scheduler] Starting scheduled GitHub sync at {datetime.now()}")
        try:
            await perform_sync()
            metadata = get_metadata()
            print(f"[Scheduler] Sync completed. {metadata.get('file_count', 0)} files cached.")
        except Exception as e:
            print(f"[Scheduler] Sync failed: {e}")

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan - runs on startup and shutdown"""
    # Startup: Start the scheduled sync task
    sync_task = asyncio.create_task(scheduled_sync_task())
    
    # Also perform initial sync if not synced yet
    metadata = get_metadata()
    if metadata.get("status") != "synced":
        print("[Startup] No cached data found. Performing initial sync...")
        try:
            await perform_sync()
            print("[Startup] Initial sync completed.")
        except Exception as e:
            print(f"[Startup] Initial sync failed: {e}")
    
    yield
    
    # Shutdown: Cancel the background task
    sync_task.cancel()
    try:
        await sync_task
    except asyncio.CancelledError:
        pass

app = FastAPI(
    title="SaaS சந்தை API",
    description="Backend API for SaaS சந்தை by Social Eagle AI",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(templates.router)
app.include_router(products.router)

@app.get("/")
async def root():
    return {
        "message": "SaaS சந்தை API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
