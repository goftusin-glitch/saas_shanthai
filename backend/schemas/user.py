from pydantic import BaseModel, EmailStr, field_validator
from datetime import datetime
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str
    
    @field_validator('password')
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 6:
            raise ValueError('Password must be at least 6 characters long')
        if len(v) > 72:
            raise ValueError('Password must not exceed 72 characters')
        return v

class UserLogin(BaseModel):
    username: EmailStr
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime
    auth_provider: Optional[str] = "email"
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

# New schemas for updated auth flow

class SignupResponse(BaseModel):
    message: str
    email: str

class LoginResponse(BaseModel):
    message: str
    email: str
    requires_otp: bool = True

class OTPVerifyRequest(BaseModel):
    email: EmailStr
    otp_code: str

class OTPResendRequest(BaseModel):
    email: EmailStr

class GoogleAuthRequest(BaseModel):
    credential: str  # Google ID token

