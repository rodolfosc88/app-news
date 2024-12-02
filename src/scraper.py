from requests import get
from bs4 import BeautifulSoup


url = 'https://g1.globo.com/rj/sul-do-rio-costa-verde/'
#url = 'https://globo.com/'
response = get(url)

# create soup
soup = BeautifulSoup(response.text, 'html.parser')

# creating individual containers, on each one there's information about one notice.
notice_containers = soup.findAll( class_ = "bastian-feed-item")
#notice_containers = soup.findAll( class_ = "franja-region")

# how many notices on the page
print(notice_containers[0])

