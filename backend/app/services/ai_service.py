import re


# Known Skills
SKILLS = [
    "python",
    "java",
    "c",
    "c++",
    "sql",
    "mysql",
    "mongodb",
    "html",
    "css",
    "javascript",
    "react",
    "node",
    "express",
    "fastapi",
    "django",
    "flask",
    "docker",
    "kubernetes",
    "jenkins",
    "git",
    "github",
    "linux",
    "aws",
    "azure",
    "gcp",
    "terraform",
    "ansible",
    "devops",
    "machine learning",
    "deep learning",
    "tensorflow",
    "pytorch",
    "pandas",
    "numpy",
    "opencv",
    "power bi",
    "excel"
]


def extract_resume_details(text: str):

    lines = [line.strip() for line in text.split("\n") if line.strip()]

    name = lines[0] if lines else "Unknown"

    email = ""

    phone = ""

    education = []

    experience = []

    email_match = re.search(
        r'[\w\.-]+@[\w\.-]+\.\w+',
        text
    )

    if email_match:
        email = email_match.group()

    phone_match = re.search(
        r'(\+91[\-\s]?)?[6-9]\d{9}',
        text
    )

    if phone_match:
        phone = phone_match.group()

    education_keywords = [
        "b.tech",
        "btech",
        "m.tech",
        "mtech",
        "b.e",
        "be",
        "mca",
        "bca",
        "diploma",
        "ssc",
        "intermediate",
        "12th",
        "10th"
    ]

    for keyword in education_keywords:

        if keyword.lower() in text.lower():

            education.append(keyword.upper())

    experience_pattern = re.findall(
        r'(\d+)\+?\s*(?:years|year|yrs)',
        text.lower()
    )

    experience.extend(experience_pattern)

    return {
        "name": name,
        "email": email,
        "phone": phone,
        "education": list(set(education)),
        "experience": experience
    }


def calculate_score(
    job_description: str,
    resume_text: str
):

    jd = job_description.lower()

    resume = resume_text.lower()

    jd_skills = []

    for skill in SKILLS:

        if skill in jd:

            jd_skills.append(skill)

    jd_skills = list(set(jd_skills))

    matched = []

    missing = []

    for skill in jd_skills:

        if skill in resume:

            matched.append(skill)

        else:

            missing.append(skill)

    total = len(jd_skills)

    score = 0

    if total > 0:

        score = round((len(matched) / total) * 100, 2)

    if score >= 80:
        rating = "Excellent"

    elif score >= 60:
        rating = "Good"

    elif score >= 40:
        rating = "Average"

    else:
        rating = "Needs Improvement"

    from app.services.parser_service import parse_resume
    resume_details = parse_resume(resume_text)

    return {

        "resume": resume_details,

        "score": score,

        "rating": rating,

        "matched": matched,

        "missing": missing

    }