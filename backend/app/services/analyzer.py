import os
import re
import json
import requests
from typing import List, Dict, Tuple
from app.services.nlp import extract_skills

HF_API_URL = "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2"
HF_API_TOKEN = os.getenv("HF_API_TOKEN", "")
USE_LOCAL_MODEL = os.getenv("USE_LOCAL_MODEL", "false").lower() == "true"

_model = None

if USE_LOCAL_MODEL:
    try:
        from sentence_transformers import SentenceTransformer
        _model = SentenceTransformer("all-MiniLM-L6-v2")
        print("✅ Local sentence-transformer loaded")
    except Exception as e:
        print(f"⚠️  Could not load local model: {e}. Using HF API.")


def _similarity_local(t1: str, t2: str) -> float:
    import numpy as np
    embs = _model.encode([t1, t2])
    a, b = embs[0], embs[1]
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))


def _similarity_hf_api(t1: str, t2: str) -> float:
    headers = {"Authorization": f"Bearer {HF_API_TOKEN}"} if HF_API_TOKEN else {}
    try:
        r = requests.post(HF_API_URL, headers=headers,
                          json={"inputs": {"source_sentence": t1, "sentences": [t2]}},
                          timeout=30)
        if r.status_code == 200:
            data = r.json()
            if isinstance(data, list):
                return float(data[0])
    except Exception as e:
        print(f"[analyzer] HF API error: {e}")
    return 0.45  # neutral fallback


def compute_similarity(resume: str, jd: str) -> float:
    t1, t2 = resume[:2000], jd[:2000]
    if USE_LOCAL_MODEL and _model:
        return _similarity_local(t1, t2)
    return _similarity_hf_api(t1, t2)


def compute_keyword_score(resume: str, jd: str) -> Tuple[float, List[str]]:
    stop = {"with","have","will","that","this","from","your","they","been","about","which","there"}
    jd_words = set(re.findall(r'\b[a-z][a-z+#.]{3,}\b', jd.lower())) - stop
    resume_lower = resume.lower()
    matched = [w for w in jd_words if w in resume_lower]
    missing = sorted([w for w in jd_words if w not in resume_lower], key=len, reverse=True)[:8]
    score = len(matched) / max(len(jd_words), 1) * 100
    tips = []
    if missing:
        tips.append(f"Add these JD keywords: {', '.join(missing)}")
    if score < 50:
        tips.append("Mirror the job description language more closely in your resume.")
    else:
        tips.append("Good keyword coverage! Keep aligning your language with the JD.")
    return min(score, 100), tips


def compute_skill_match(resume_skills: List[str], jd: str) -> Tuple[float, List[str], List[str]]:
    jd_skills = extract_skills(jd)
    if not jd_skills:
        return 70.0, resume_skills[:10], []
    rs_lower = {s.lower() for s in resume_skills}
    matched = [s for s in jd_skills if s.lower() in rs_lower]
    missing = [s for s in jd_skills if s.lower() not in rs_lower]
    score = len(matched) / len(jd_skills) * 100
    return min(score, 100), matched, missing


def compute_ats_score(resume: str, skill_score: float, keyword_score: float) -> Tuple[float, List[str]]:
    score = 0.0
    tips = []
    wc = len(resume.split())
    if 300 <= wc <= 800:
        score += 20
    elif wc < 300:
        score += 10
        tips.append("Resume is too short. Add more detail about your experience.")
    else:
        score += 15
        tips.append("Consider condensing to 1-2 pages for better ATS performance.")
    if re.search(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b', resume):
        score += 10
    else:
        tips.append("Add a professional email address.")
    sections = ["experience","education","skills","summary","objective"]
    found = sum(1 for s in sections if s in resume.lower())
    score += found * 5
    if found < 3:
        tips.append("Add clear section headers: Summary, Experience, Education, Skills.")
    score += skill_score * 0.25
    score += keyword_score * 0.25
    if resume.count("•") < 3 and resume.count("-") < 5:
        tips.append("Use bullet points to list achievements and responsibilities.")
    if "linkedin" not in resume.lower():
        tips.append("Add your LinkedIn profile URL.")
    return min(score, 100), tips[:5]


def build_suggestions(match: float, missing: List[str], skill_score: float) -> List[Dict]:
    out = []
    if match < 40:
        out.append({"type":"critical","title":"Low Match Score","description":"Significant tailoring needed. Match the job requirements closely.","icon":"🚨"})
    elif match < 70:
        out.append({"type":"warning","title":"Moderate Match","description":"Highlight relevant experience and mirror the job description language.","icon":"⚠️"})
    else:
        out.append({"type":"success","title":"Strong Match!","description":"Your resume aligns well. Focus on polish and minor improvements.","icon":"✅"})
    if missing:
        out.append({"type":"skill","title":"Add Missing Skills","description":f"Consider highlighting: {', '.join(missing[:5])}","icon":"🎯"})
    out.append({"type":"tip","title":"Quantify Achievements","description":"Add numbers: 'Increased efficiency by 30%', 'Led a team of 5'.","icon":"📊"})
    out.append({"type":"tip","title":"Tailor Per Application","description":"Customize your summary and highlights for each specific job.","icon":"✏️"})
    return out[:6]


def analyze_resume(resume_text: str, job_description: str, resume_skills: List[str]) -> Dict:
    sem_score = compute_similarity(resume_text, job_description) * 100
    skill_score, matched, missing = compute_skill_match(resume_skills, job_description)
    kw_score, kw_tips = compute_keyword_score(resume_text, job_description)
    match_score = sem_score * 0.40 + skill_score * 0.35 + kw_score * 0.25
    ats_score, ats_tips = compute_ats_score(resume_text, skill_score, kw_score)
    suggestions = build_suggestions(match_score, missing, skill_score)
    for tip in ats_tips[:2]:
        suggestions.append({"type":"ats","title":"ATS Tip","description":tip,"icon":"🤖"})
    return {
        "match_score": round(match_score, 1),
        "skill_match_score": round(skill_score, 1),
        "keyword_score": round(kw_score, 1),
        "ats_score": round(ats_score, 1),
        "missing_skills": missing[:10],
        "matched_skills": matched[:10],
        "suggestions": suggestions,
        "keyword_tips": kw_tips,
    }
