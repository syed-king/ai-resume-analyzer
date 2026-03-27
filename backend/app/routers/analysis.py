import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from app.auth import get_current_user
from app.services.analyzer import analyze_resume

router = APIRouter()


@router.post("/run", response_model=schemas.AnalysisResponse)
def run_analysis(
    request: schemas.AnalysisRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    resume = (
        db.query(models.Resume)
        .filter(models.Resume.id == request.resume_id, models.Resume.user_id == current_user.id)
        .first()
    )
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    resume_skills = json.loads(resume.parsed_skills or "[]")
    result = analyze_resume(
        resume_text=resume.raw_text or "",
        job_description=request.job_description,
        resume_skills=resume_skills,
    )

    analysis = models.Analysis(
        user_id=current_user.id,
        resume_id=resume.id,
        job_description=request.job_description,
        match_score=result["match_score"],
        skill_match_score=result["skill_match_score"],
        keyword_score=result["keyword_score"],
        ats_score=result["ats_score"],
        missing_skills=json.dumps(result["missing_skills"]),
        matched_skills=json.dumps(result["matched_skills"]),
        suggestions=json.dumps(result["suggestions"]),
        keyword_tips=json.dumps(result["keyword_tips"]),
    )
    db.add(analysis)
    db.commit()
    db.refresh(analysis)
    return analysis


@router.get("/history", response_model=list[schemas.AnalysisHistoryItem])
def get_history(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    analyses = (
        db.query(models.Analysis)
        .filter(models.Analysis.user_id == current_user.id)
        .order_by(models.Analysis.created_at.desc())
        .all()
    )
    result = []
    for a in analyses:
        r = db.query(models.Resume).filter(models.Resume.id == a.resume_id).first()
        result.append(
            schemas.AnalysisHistoryItem(
                id=a.id,
                resume_id=a.resume_id,
                match_score=a.match_score,
                ats_score=a.ats_score,
                created_at=a.created_at,
                resume_filename=r.filename if r else None,
            )
        )
    return result


@router.get("/{analysis_id}", response_model=schemas.AnalysisResponse)
def get_analysis(
    analysis_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    analysis = (
        db.query(models.Analysis)
        .filter(models.Analysis.id == analysis_id, models.Analysis.user_id == current_user.id)
        .first()
    )
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return analysis
