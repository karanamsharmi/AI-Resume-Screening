import re


def extract_name(text: str):

    lines = [line.strip() for line in text.split("\n") if line.strip()]

    if lines:
        return lines[0]

    return "Unknown"


def extract_email(text: str):

    match = re.search(
        r'[\w\.-]+@[\w\.-]+\.\w+',
        text
    )

    if match:
        return match.group()

    return ""


def extract_phone(text: str):

    match = re.search(
        r'(\+91[\-\s]?)?[6-9]\d{9}',
        text
    )

    if match:
        return match.group()

    return ""


def extract_education(text: str):

    education = []

    keywords = [
        "b.tech",
        "btech",
        "b.e",
        "be",
        "m.tech",
        "mtech",
        "mca",
        "bca",
        "diploma",
        "intermediate",
        "ssc",
        "10th",
        "12th"
    ]

    lower = text.lower()

    for keyword in keywords:

        if keyword in lower:
            education.append(keyword.upper())

    return list(dict.fromkeys(education))


def extract_experience(text: str):

    experience = re.findall(
        r'(\d+)\+?\s*(?:years|year|yrs)',
        text.lower()
    )

    return experience


def parse_resume(text: str):

    return {

        "name": extract_name(text),

        "email": extract_email(text),

        "phone": extract_phone(text),

        "education": extract_education(text),

        "experience": extract_experience(text)

    }