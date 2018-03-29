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

user = json['email']
device = json['device']

sheets = gc.list_spreadsheet_files()

sheetfound = False
for i in sheets:
    if i['name'] == user:
        print('{"status": "exists", "url": "https://docs.google.com/spreadsheets/d/'+i['id']+'"}')
        sheetfound = True
        #gc.del_spreadsheet(i['id'])
        break
if sheetfound == False:
    sh = gc.create(user)
    sh.share(user, perm_type='user', role='writer')
    ws = sh.get_worksheet(0)
    ws.update_acell('A1', 'Device')
    ws.update_acell('B1', 'Visit')
    ws.update_acell('C1', 'Site')
    ws.update_acell('D1', 'URL')
    ws.update_acell('E1', 'Direct')
    ws.update_acell('F1', 'Visits')
    ws.update_acell('G1', 'ID')
    z = 1
    for x in json['history']:
        z = z + 1
        title = x['title']
        if title == "":
            title = x['url'].replace("https://", "").replace("http://", "")
        ws.update_acell('A'+str(z), str(device))
        ws.update_acell('B'+str(z), str(x['time']))
        ws.update_acell('C'+str(z), '=HYPERLINK("'+str(x['url'])+'", "'+str(title)+'")')
        ws.update_acell('D'+str(z), '=HYPERLINK("'+str(x['url'])+'", "'+str(x['url'])+'")')
        ws.update_acell('E'+str(z), str(x['direct']))
        ws.update_acell('F'+str(z), str(x['visits']))
        ws.update_acell('G'+str(z), str(x['id']))
    sheets = gc.list_spreadsheet_files()
    for i in sheets:
        if i['name'] == user:
            print('{"status": "created", "url": "https://docs.google.com/spreadsheets/d/'+i['id']+'"}')
            break
