import json
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from app.auth import get_current_user
from app.services.parser import extract_text
from app.services.nlp import parse_resume

router = APIRouter()


@router.post("/upload", response_model=schemas.ResumeResponse)
async def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if not file.filename.lower().endswith((".pdf", ".docx")):
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported")
    content = await file.read()
    raw_text = extract_text(content, file.filename)
    if not raw_text.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from file")
    parsed = parse_resume(raw_text)
    resume = models.Resume(
        user_id=current_user.id,
        filename=file.filename,
        raw_text=raw_text,
        parsed_name=parsed.get("name"),
        parsed_email=parsed.get("email"),
        parsed_skills=json.dumps(parsed.get("skills", [])),
        parsed_education=json.dumps(parsed.get("education", [])),
        parsed_experience=json.dumps(parsed.get("experience", [])),
    )
    db.add(resume)
    db.commit()
    db.refresh(resume)
    return resume


@router.get("/", response_model=list[schemas.ResumeResponse])
def get_resumes(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return (
        db.query(models.Resume)
        .filter(models.Resume.user_id == current_user.id)
        .order_by(models.Resume.created_at.desc())
        .all()
    )


@router.get("/{resume_id}", response_model=schemas.ResumeResponse)
def get_resume(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    resume = (
        db.query(models.Resume)
        .filter(models.Resume.id == resume_id, models.Resume.user_id == current_user.id)
        .first()
    )
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    return resume
