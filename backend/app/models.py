from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255))
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    resumes = relationship("Resume", back_populates="owner")
    analyses = relationship("Analysis", back_populates="owner")


class Resume(Base):
    __tablename__ = "resumes"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    filename = Column(String(255))
    file_url = Column(String(500))
    raw_text = Column(Text)
    parsed_name = Column(String(255))
    parsed_email = Column(String(255))
    parsed_skills = Column(Text)
    parsed_education = Column(Text)
    parsed_experience = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    owner = relationship("User", back_populates="resumes")
    analyses = relationship("Analysis", back_populates="resume")


class Analysis(Base):
    __tablename__ = "analyses"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    resume_id = Column(Integer, ForeignKey("resumes.id"))
    job_description = Column(Text)
    match_score = Column(Float)
    skill_match_score = Column(Float)
    keyword_score = Column(Float)
    ats_score = Column(Float)
    missing_skills = Column(Text)
    matched_skills = Column(Text)
    suggestions = Column(Text)
    keyword_tips = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    owner = relationship("User", back_populates="analyses")
    resume = relationship("Resume", back_populates="analyses")
