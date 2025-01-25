import urllib.request
import json
import csv
import os
import re  

# Fetch data from both URLs
url1 = 'https://padax.github.io/taipei-day-trip-resources/taipei-attractions-assignment-1'
url2 = 'https://padax.github.io/taipei-day-trip-resources/taipei-attractions-assignment-2'

# 使用 urllib 發送 HTTP 請求並解析 JSON
response1 = urllib.request.urlopen(url1)
response2 = urllib.request.urlopen(url2)

data1 = json.load(response1)
data2 = json.load(response2)

# Process first dataset (results1)
data_map = {}
for item in data1['data']['results']:
  serial_no = item['SERIAL_NO']
  file_list = item.get('filelist', '')
  image_url = ''
  if file_list:
    match = re.match(r'https?:\/\/\S+?(?=https?:\/\/|\s|$)', file_list)
    if match:
      image_url = match.group(0)
  data_map[serial_no] = {
    'SpotTitle': item.get('stitle', ''),
    'District': [],
    'Longitude': item.get('longitude', ''),
    'Latitude': item.get('latitude', ''),
    'ImageURL': image_url,
  }

# Process second dataset (results2)
for item in data2['data']:
  serial_no = item['SERIAL_NO']
  match = re.search(r'[\u4e00-\u9fff]+區', item.get('address', ''))
  district = match.group(0) if match else ''
  if serial_no in data_map:
    data_map[serial_no]['District'] = district

# Create table for CSV output
table_rows = []
for record in data_map.values():
  table_rows.append([
    record['SpotTitle'],
    record['District'],
    record['Longitude'],
    record['Latitude'],
    record['ImageURL'],
  ])

# Save to spot.csv
csv_file_path = os.path.join(os.getcwd(), 'spot.csv')
with open(csv_file_path, 'w', newline='', encoding='utf-8') as file:
  writer = csv.writer(file)
  writer.writerows(table_rows)

print(f'CSV 已保存到: {csv_file_path}')

# Process MRT data and create mrt.csv
mrt_map = []
for item in data2['data']:
  serial_no = item['SERIAL_NO']
  mrt = item.get('MRT', '')
  mrt_entry = next((entry for entry in mrt_map if entry[0] == mrt), None)
  if not mrt_entry:
    mrt_entry = [mrt]
    mrt_map.append(mrt_entry)
    
  spot_title = next((data['stitle'] for data in data1['data']['results'] if data['SERIAL_NO'] == serial_no), None)
  if spot_title:
    mrt_entry.append(spot_title)

# Save to mrt.csv
csv_file_path2 = os.path.join(os.getcwd(), 'mrt.csv')
with open(csv_file_path2, 'w', newline='', encoding='utf-8') as file:
  writer = csv.writer(file)
  writer.writerows(mrt_map)

print(f'CSV 已保存到: {csv_file_path2}')

