#!/usr/bin/env python
import json
from pprint import pprint
import os
import gspread
from oauth2client.service_account import ServiceAccountCredentials

json = json.load(open('argfile.json'))

#pprint(json)

scope = ['https://spreadsheets.google.com/feeds', 'https://www.googleapis.com/auth/drive']
creds = ServiceAccountCredentials.from_json_keyfile_name('client-id.json', scope)
gc = gspread.authorize(creds)

user = json['email']

sheets = gc.list_spreadsheet_files()

sheetfound = False
for i in sheets:
    if i['name'] == user:
        print('{"status": "exists", "url": "'+i['id']+'"}')
        sheetfound = True
        break
if sheetfound == False:
    print('{"status": "non-existant"}')