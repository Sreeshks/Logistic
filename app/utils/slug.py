import re
import unicodedata

def generate_slug(text: str) -> str:
    """
    Generate a URL-safe slug from input string.
    Converts to lowercase, normalizes unicode, replaces spaces and non-alphanumeric chars with hyphens.
    """
    if not text:
        return ""
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("ascii")
    text = text.lower()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[-\s]+", "-", text).strip("-")
    return text
