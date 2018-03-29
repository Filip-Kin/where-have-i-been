#!/usr/bin/env python
import json
from pprint import pprint
import gspread
from oauth2client.service_account import ServiceAccountCredentials

json = json.load(open('argfile.json'))

#pprint(json)

scope = ['https://spreadsheets.google.com/feeds', 'https://www.googleapis.com/auth/drive']
creds = ServiceAccountCredentials.from_json_keyfile_name('client-id.json', scope)
gc = gspread.authorize(creds)

id = json['id']

sheets = gc.list_spreadsheet_files()

sheetfound = False
for i in sheets:
    if i['id'] == id:
        sheetfound = True
        gc.del_spreadsheet(id)
        print('{"status": "deleted"}')
        break
if sheetfound == False:
    print('{"status": "not found"}')
