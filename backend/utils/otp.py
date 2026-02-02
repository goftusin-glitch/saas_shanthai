import random
import string
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from config import settings
from models.otp import OTP


def generate_otp_code() -> str:
    """Generate a 6-digit OTP code"""
    return ''.join(random.choices(string.digits, k=6))


def create_otp(db: Session, user_id: int) -> str:
    """Create a new OTP for the user, invalidating any previous ones"""
    
    # Invalidate all previous unused OTPs for this user
    db.query(OTP).filter(
        OTP.user_id == user_id,
        OTP.used == False
    ).update({"used": True})
    
    # Generate new OTP
    otp_code = generate_otp_code()
    expires_at = datetime.utcnow() + timedelta(minutes=settings.OTP_EXPIRE_MINUTES)
    
    # Create OTP record
    new_otp = OTP(
        user_id=user_id,
        code=otp_code,
        expires_at=expires_at,
        used=False
    )
    db.add(new_otp)
    db.commit()
    
    return otp_code


def verify_otp(db: Session, user_id: int, code: str) -> bool:
    """Verify the OTP code for the user"""
    
    otp = db.query(OTP).filter(
        OTP.user_id == user_id,
        OTP.code == code,
        OTP.used == False,
        OTP.expires_at > datetime.utcnow()
    ).first()
    
    if not otp:
        return False
    
    # Mark OTP as used
    otp.used = True
    db.commit()
    
    return True
