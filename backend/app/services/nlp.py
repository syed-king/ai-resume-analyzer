import re
from typing import List, Dict, Optional

try:
    import spacy
    nlp = spacy.load("en_core_web_sm")
    print("[OK] spaCy loaded")
except Exception:
    nlp = None
    print("[WARN] spaCy not loaded. Run: python -m spacy download en_core_web_sm")

SKILLS = [
    "python","javascript","typescript","java","c++","c#","go","rust","kotlin","swift","php","ruby","r",
    "bash","html","css","react","next.js","vue","angular","svelte","node.js","express","fastapi",
    "django","flask","spring","tailwind","bootstrap","webpack","vite","machine learning","deep learning",
    "nlp","tensorflow","pytorch","keras","scikit-learn","pandas","numpy","matplotlib","data analysis",
    "data science","computer vision","aws","azure","gcp","docker","kubernetes","terraform","ci/cd",
    "linux","nginx","sql","postgresql","mysql","mongodb","redis","elasticsearch","sqlite","firebase",
    "supabase","git","github","graphql","rest api","microservices","agile","scrum","leadership",
    "communication","teamwork","problem solving","project management","figma","postman","swagger",
]


def extract_email(text: str) -> Optional[str]:
    m = re.findall(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b', text)
    return m[0] if m else None


def extract_name(text: str, doc) -> Optional[str]:
    if doc:
        for ent in doc.ents:
            if ent.label_ == "PERSON":
                return ent.text
    lines = [l.strip() for l in text.split("\n") if l.strip()]
    if lines:
        first = lines[0]
        if len(first.split()) <= 5 and not any(c.isdigit() for c in first):
            return first
    return None


def extract_skills(text: str) -> List[str]:
    lower = text.lower()
    return list({s for s in SKILLS if s in lower})


def extract_section(text: str, keywords: List[str], limit: int = 5) -> List[str]:
    lines = text.split("\n")
    results = []
    for line in lines:
        ll = line.lower()
        if any(k in ll for k in keywords) and len(line.strip()) > 5:
            results.append(line.strip()[:200])
    return results[:limit]


def parse_resume(text: str) -> Dict:
    doc = nlp(text[:5000]) if nlp else None
    return {
        "name": extract_name(text, doc),
        "email": extract_email(text),
        "skills": extract_skills(text),
        "education": extract_section(text, ["bachelor","master","phd","university","college","degree","diploma","certification"]),
        "experience": extract_section(text, ["engineer","developer","manager","analyst","intern","led","built","developed","implemented","years"], limit=8),
    }
