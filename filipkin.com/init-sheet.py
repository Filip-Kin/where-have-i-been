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
device = json['device']

sheets = gc.list_spreadsheet_files()

sheetfound = False
for i in sheets:
    if i['name'] == user:
        print('{"status": "exists", "url": "'+i['id']+'"}')
        sheetfound = True
        break
if sheetfound == False:
    sh = gc.create(user)
    sh.share(user, perm_type='user', role='writer')
    ws = sh.get_worksheet(0)
    row = []
    row.append('Device')
    row.append('Visit')
    row.append('Site')
    row.append('URL')
    row.append('Direct')
    row.append('Visits')
    row.append('ID')
    ws.append_row(row)
    os.system("python3 history.py "+sh.id)
    print('{"status": "created", "url": "'+sh.id+'"}')
