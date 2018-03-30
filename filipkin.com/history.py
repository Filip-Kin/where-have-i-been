#!/usr/bin/env python
import json
from pprint import pprint
import sys
import gspread
from oauth2client.service_account import ServiceAccountCredentials

json = json.load(open('history.json'))

scope = [
 'https://spreadsheets.google.com/feeds',
 'https://www.googleapis.com/auth/drive'
]
creds = ServiceAccountCredentials.from_json_keyfile_name(
 'client-id.json', scope)
gc = gspread.authorize(creds)

sid = sys.argv[1]
device = sys.argv[2]

sheets = gc.list_spreadsheet_files()

sheetfound = False
for i in sheets:
	if i['id'] == sid:
		sheetfound = True
		break
if sheetfound == True:
	ws = gc.open_by_key(sid).sheet1
	ws.resize(10001, 7)
	cells = ws.range("A2:G"+str(len(json)+1))
	print(str(cells[0]))
	i = 0
	for x in json:
		print('Row: '+str(i/7))
		cells[i].value = (str(device))[:49999]
		i = i + 1
		cells[i].value = (str(x['time']))[:49999]
		i = i + 1
		cells[i].value = (str(x['title']))[:49999]
		i = i + 1
		cells[i].value = (str(x['url']))[:49999]
		i = i + 1
		cells[i].value = (str(x['direct']))[:49999]
		i = i + 1
		cells[i].value = (str(x['visits']))[:49999]
		i = i + 1
		cells[i].value = (str(x['id']))[:49999]
		i = i + 1
	ws.update_cells(cells)
