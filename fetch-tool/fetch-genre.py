import requests
from openpyxl import Workbook

# Define the API key and URL
api_key = 'a7c925c73a6cb8fbaca41e94ff265c4b'
url = f'https://api.themoviedb.org/3/genre/movie/list?api_key={api_key}&language=zh-CN'

# Fetch genres from the API
response = requests.get(url)
if response.status_code == 200:
    genres = response.json().get('genres', [])
else:
    print(f"Failed to fetch genres: {response.status_code}")
    genres = []

# Create a new Excel workbook and sheet
workbook = Workbook()
sheet = workbook.active
sheet.title = 'Genres'

# Write headers
sheet.append(['ID', 'Name'])

# Write genre data to the sheet
for genre in genres:
    sheet.append([genre['id'], genre['name']])

# Save the workbook to a file
workbook.save('assets/data/genres.xlsx')
print("Genres have been saved to 'assets/data/genres.xlsx'")
