"""Coleta manchetes do G1 Sul do Rio e Costa Verde (protótipo, não usado pelo app).

Uso:
    pip install -r scripts/requirements.txt
    python scripts/scraper.py

Respeite os termos de uso e o robots.txt do site antes de usar em produção.
"""
import requests
from bs4 import BeautifulSoup

URL = "https://g1.globo.com/rj/sul-do-rio-costa-verde/"
HEADERS = {"User-Agent": "app-news-scraper/0.1"}


def fetch_headlines(url: str = URL) -> list[dict]:
    response = requests.get(url, headers=HEADERS, timeout=15)
    response.raise_for_status()

    soup = BeautifulSoup(response.text, "html.parser")
    headlines = []
    for item in soup.find_all(class_="bastian-feed-item"):
        link = item.find("a", href=True)
        if not link:
            continue
        title = link.get_text(strip=True)
        if title:
            headlines.append({"title": title, "url": link["href"]})
    return headlines


if __name__ == "__main__":
    for headline in fetch_headlines():
        print(f"- {headline['title']}\n  {headline['url']}")
