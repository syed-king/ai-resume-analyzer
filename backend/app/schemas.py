from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    email: str
    full_name: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse


class ResumeResponse(BaseModel):
    id: int
    filename: str
    file_url: Optional[str] = None
    parsed_name: Optional[str] = None
    parsed_email: Optional[str] = None
    parsed_skills: Optional[str] = None
    parsed_education: Optional[str] = None
    parsed_experience: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class AnalysisRequest(BaseModel):
    resume_id: int
    job_description: str


class AnalysisResponse(BaseModel):
    id: int
    resume_id: int
    job_description: str
    match_score: float
    skill_match_score: float
    keyword_score: float
    ats_score: float
    missing_skills: str
    matched_skills: str
    suggestions: str
    keyword_tips: str
    created_at: datetime

    class Config:
        from_attributes = True


class AnalysisHistoryItem(BaseModel):
    id: int
    resume_id: int
    match_score: float
    ats_score: float
    created_at: datetime
    resume_filename: Optional[str] = None

    class Config:
        from_attributes = True
