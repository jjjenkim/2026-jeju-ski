from bs4 import BeautifulSoup
import requests

url = "https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=FS&competitorid=235622&type=result"
headers = {"User-Agent": "Mozilla/5.0"}
resp = requests.get(url, headers=headers)
soup = BeautifulSoup(resp.text, 'html.parser')

print("Searching for '12-07-2005'...")
# Search text
found = soup.find_all(string=lambda t: t and "12-07-2005" in t)
for f in found:
    print(f"Found in tag: {f.parent.name}")
    print(f"Parent Class: {f.parent.get('class')}")
    print(f"Grandparent Class: {f.parent.parent.get('class')}")
    print(f.parent.prettify())

print("\nSearching for 'Active' (Status)...")
status = soup.find_all(string=lambda t: t and "Active" in t)
for s in status:
    print(f"Found in tag: {s.parent.name}")
    print(f"Parent Class: {s.parent.get('class')}")
    print(s.parent.prettify())
