import io
import pdfplumber
from docx import Document


def extract_text(content: bytes, filename: str) -> str:
    try:
        if filename.lower().endswith(".pdf"):
            return _from_pdf(content)
        elif filename.lower().endswith(".docx"):
            return _from_docx(content)
        return ""
    except Exception as e:
        print(f"[parser] Error: {e}")
        return ""


def _from_pdf(content: bytes) -> str:
    parts = []
    with pdfplumber.open(io.BytesIO(content)) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            if text:
                parts.append(text)
    return "\n".join(parts)


def _from_docx(content: bytes) -> str:
    doc = Document(io.BytesIO(content))
    return "\n".join(p.text for p in doc.paragraphs if p.text.strip())
