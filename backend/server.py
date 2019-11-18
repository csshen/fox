import gspread
from oauth2client.service_account import ServiceAccountCredentials
import random
from flask import Flask, escape, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

scope = ['https://spreadsheets.google.com/feeds', 'https://www.googleapis.com/auth/drive']
creds = ServiceAccountCredentials.from_json_keyfile_name('client_secret.json', scope)
client = gspread.authorize(creds)
sheet = client.open('Food_Database')


def get_database():
    food_db = sheet.sheet1
    records = food_db.get_all_records()
    database = {}
    for record in records:
        user = record.pop('email')
        database[user] = record

    return database


@app.route('/login', methods=['POST'])
def login():
    user, password = request.json.get('email'), request.json.get('password')

    database = get_database()
    if user in database:
        metadata = database[user]
        if password == metadata['password']:
            return jsonify({'message': 'success', 'metadata': metadata})
        else:
            return jsonify({'message': 'Incorrect password, please try again.'})
    else:
        return jsonify({'message': 'User not found.'})





@app.route('/get_code', methods=['POST'])
def get_code():
    user = request.json.get('email')
    database = get_database()

    if user not in database:
        return 'error'

    user_type = database[user]['type']

    locker_db = sheet.get_worksheet(1)

    if user_type == 'order':
        code = random.randint(100000, 999999)
        locker_num = database[user]['locker']
        row = int(locker_num) + 1
        locker_db.update_cell(row, 3, code)

    elif user_type == 'delivery':

        database = get_database()
        locker_num = database[user]['locker']

        locker_db = sheet.get_worksheet(1)
        lockers = locker_db.get_all_records()

        code = random.randint(100000, 999999)
        for locker in lockers:
            if locker.get('status') == 'empty':
                row = int(locker_num) + 1
                locker_db.update_cell(row, 2, 'occupied')
                locker_db.update_cell(row, 3, code)
                break

    
    resp = {
        'message': 'success',
        'code': code
    }
    return jsonify(resp)


@app.route('/get_locker', methods=['POST'])
def get_locker():
    code = request.json.get('code')
    locker_db = sheet.get_worksheet(1).get_all_records()


    for locker in locker_db:
        if locker.get('code') == code:
            return jsonify({'locker': locker.get('locker #')})

    return jsonify({'locker': -1})





if __name__ == '__main__': 
    app.run(port=3000)

