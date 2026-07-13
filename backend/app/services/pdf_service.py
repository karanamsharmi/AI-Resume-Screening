import os
import fitz

UPLOAD_FOLDER = "uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

async def save_pdf(file):
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    with open(file_path, "wb") as f:
        f.write(await file.read())

    return file_path


def extract_text(file_path):
    pdf = fitz.open(file_path)

    text = ""

    for page in pdf:
        text += page.get_text()

    return text