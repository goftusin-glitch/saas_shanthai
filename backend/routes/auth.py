from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from database import get_db
from models.user import User
from models.otp import OTP
from schemas.user import (
    UserCreate, UserResponse, Token, SignupResponse, 
    LoginResponse, OTPVerifyRequest, OTPResendRequest, GoogleAuthRequest
)
from utils.auth import get_password_hash, verify_password, create_access_token, get_current_user
from utils.otp import create_otp, verify_otp
from utils.email import send_otp_email
from config import settings

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/signup", response_model=SignupResponse, status_code=status.HTTP_201_CREATED)
async def signup(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    Create a new user account.
    After signup, user must login and verify OTP to access the platform.
    """
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        email=user_data.email,
        hashed_password=hashed_password,
        auth_provider="email"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Return success message - no token, user must login
    return SignupResponse(
        message="Account created successfully. Please login to continue.",
        email=new_user.email
    )

@router.post("/login", response_model=LoginResponse)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(), 
    db: Session = Depends(get_db)
):
    """
    Verify user credentials and send OTP to email.
    User must verify OTP to get access token.
    """
    # Find user
    user = db.query(User).filter(User.email == form_data.username).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check if user signed up with Google
    if user.auth_provider == "google" and not user.hashed_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This account uses Google Sign-In. Please login with Google."
        )
    
    # Verify password
    if not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Generate and send OTP
    otp_code = create_otp(db, user.id)
    await send_otp_email(user.email, otp_code)
    
    return LoginResponse(
        message="Verification code sent to your email",
        email=user.email,
        requires_otp=True
    )

@router.post("/verify-otp", response_model=Token)
async def verify_otp_endpoint(
    otp_data: OTPVerifyRequest,
    db: Session = Depends(get_db)
):
    """
    Verify OTP and return access token.
    This completes the login process.
    """
    # Find user
    user = db.query(User).filter(User.email == otp_data.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Verify OTP
    if not verify_otp(db, user.id, otp_data.otp_code):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification code"
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": user.email})
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )

@router.post("/resend-otp", response_model=LoginResponse)
async def resend_otp(
    otp_data: OTPResendRequest,
    db: Session = Depends(get_db)
):
    """
    Resend OTP to user's email.
    """
    # Find user
    user = db.query(User).filter(User.email == otp_data.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Generate and send new OTP
    otp_code = create_otp(db, user.id)
    await send_otp_email(user.email, otp_code)
    
    return LoginResponse(
        message="Verification code resent to your email",
        email=user.email,
        requires_otp=True
    )

@router.post("/google", response_model=Token)
async def google_auth(
    google_data: GoogleAuthRequest,
    db: Session = Depends(get_db)
):
    """
    Authenticate with Google.
    Creates a new user if not exists, or logs in existing user.
    """
    try:
        # Verify the Google ID token
        idinfo = id_token.verify_oauth2_token(
            google_data.credential,
            google_requests.Request(),
            settings.GOOGLE_CLIENT_ID
        )
        
        # Get user info from token
        google_id = idinfo.get("sub")
        email = idinfo.get("email")
        
        if not email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Could not get email from Google account"
            )
        
        # Check if user exists by google_id or email
        user = db.query(User).filter(
            (User.google_id == google_id) | (User.email == email)
        ).first()
        
        if user:
            # Update google_id if user exists but signed up with email
            if not user.google_id:
                user.google_id = google_id
                user.auth_provider = "google"
                db.commit()
                db.refresh(user)
        else:
            # Create new user
            user = User(
                email=email,
                google_id=google_id,
                auth_provider="google",
                hashed_password=None
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        
        # Create access token - no OTP needed for Google Sign-In
        access_token = create_access_token(data={"sub": user.email})
        
        return Token(
            access_token=access_token,
            token_type="bearer",
            user=UserResponse.model_validate(user)
        )
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid Google token: {str(e)}"
        )

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return UserResponse.model_validate(current_user)
