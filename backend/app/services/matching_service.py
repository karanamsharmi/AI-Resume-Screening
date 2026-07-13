import re


def extract_keywords(text: str):

    # Convert to lowercase
    text = text.lower()

    # Remove special characters
    text = re.sub(r'[^a-zA-Z0-9 ]', ' ', text)

    # Split words
    words = text.split()

    # Remove duplicates
    return list(set(words))


def calculate_match(resume_text: str, jd_text: str):

    resume_keywords = extract_keywords(resume_text)
    jd_keywords = extract_keywords(jd_text)

    matched = list(set(resume_keywords) & set(jd_keywords))

    missing = list(set(jd_keywords) - set(resume_keywords))

    if len(jd_keywords) == 0:
        score = 0
    else:
        score = round((len(matched) / len(jd_keywords)) * 100, 2)

    return {
        "match_score": score,
        "matched_keywords": sorted(matched),
        "missing_keywords": sorted(missing)
    }