import re

def calculate_score(job_description: str, resume_text: str):

    jd = job_description.lower()
    resume = resume_text.lower()

    # Extract skills from job description
    skills = [
        skill.strip()
        for skill in re.split(r"[,\n]", jd)
        if skill.strip()
    ]

    # Remove duplicates
    skills = list(dict.fromkeys(skills))

    matched = []
    missing = []

    for skill in skills:
        if skill in resume:
            matched.append(skill)
        else:
            missing.append(skill)

    total = len(skills)

    score = 0
    if total > 0:
        score = round((len(matched) / total) * 100)

    return {
        "score": score,
        "matched": matched,
        "missing": missing
    }