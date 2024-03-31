from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import pymysql
import requests
import os
from dotenv import load_dotenv
load_dotenv()
app = Flask(__name__, static_folder='../build', static_url_path='/')
CORS(app, supports_credentials=True)

db_host = os.environ.get('DATABASE_ADDRESS')
db_user = os.environ.get('DATABASE_USER')
db_password = os.environ.get('DATABASE_PASSWORD')
db_name = os.environ.get('DATABASE_NAME')


# Define a route to serve the React frontend
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    # If the path matches any API route, pass the request to the API
    if path.startswith('addCard') or path.startswith('removeCard') or path.startswith('retrieveImages'):
        return jsonify({'message': 'Invalid route for frontend'})
    # Otherwise, serve the React frontend
    return send_from_directory(app.static_folder, 'index.html')


def create_tables(): 
    try:
        conn = pymysql.connect(
            host=db_host,
            port=3306,
            user=db_user,
            password=db_password,
            db=db_name
        )
        cursor = conn.cursor()
        cardCollectionTableQuery = """
                        CREATE TABLE IF NOT EXISTS cards.myCards (
                            collection_id INT PRIMARY KEY,
                            card_name VARCHAR(50),
                            set_code VARCHAR(50),
                            qnt INT,
                            price FLOAT,
                            image VARCHAR(512)
                        )
                        """
        # Create the table
        cursor.execute(cardCollectionTableQuery)

        # Commit the transaction and close the connection
        conn.commit()
        cursor.close()
        conn.close()
        
        return 'Table created successfully'
    except Exception as e:
        return f'Error: {str(e)}'



 
@app.route('/')
def index():
    return create_tables()

@app.route('/addCard', methods=['POST'])
def add_card():
    conn = pymysql.connect(
            host=db_host,
            port=3306,
            user=db_user,
            password=db_password,
            db=db_name
        )
    cursor = conn.cursor()

    try:
        data = request.json        
        cursor.execute("SELECT collection_id FROM myCards ORDER BY collection_id DESC LIMIT 1")
        last_card = cursor.fetchone()
        if last_card:
            card_id = last_card[0]+1
        else:
           card_id = 1

  
        name = data['name']        
        set_code = data['setCode']
        new_qnt = data['qnt']
        link = ''
        price = 0
        try:
                    api_url = f'https://db.ygoprodeck.com/api/v7/cardinfo.php?name={name}'
                    
                    response = requests.get(api_url)
                    response = response.json()
                    imageLink = response['data'][0]['card_images'][0]['image_url_small']
                    link = imageLink
        except:
                    print('No Image Found')
        try:
                    api_url = f'https://db.ygoprodeck.com/api/v7/cardinfo.php?name={name}'
                    response = requests.get(api_url)
                    response = response.json()                   
                    for card_set in response["data"][0]["card_sets"]:
                        if card_set["set_code"] == set_code:
                            price = card_set['set_price']
        except:
                print('No price found')

        cursor.execute("SELECT 1 FROM myCards WHERE card_name = %s AND set_code = %s", (name, set_code))
        
        if cursor.fetchone():
            print('error')
            cursor.execute("UPDATE myCards SET qnt = qnt + %s WHERE card_name = %s AND set_code = %s", (new_qnt, name, set_code)) 

        else:
            insert_query = f"""
            INSERT INTO myCards (collection_id, card_name, set_code, `qnt`, `price`, `image`)
            VALUES ({card_id}, '{name}', '{set_code}','{new_qnt}','{price}', '{link}')
            """
            cursor.execute(insert_query)
        conn.commit()
        return jsonify({'message': 'Card Added!'})
    except Exception as e:
        return jsonify({'error': str(e)})


@app.route('/removeCard', methods=['POST'])
def remove_card():
    conn = pymysql.connect(
            host=db_host,
            port=3306,
            user=db_user,
            password=db_password,
            db=db_name
        )
    cursor = conn.cursor()

    try:
        data = request.json  
        name = data['name']
        set_code = data['setCode']
        new_qnt = data['qnt']
        cursor.execute("SELECT qnt FROM myCards WHERE card_name = %s AND set_code = %s", (name, set_code))
        current_qnt_row = cursor.fetchone()

        if current_qnt_row:
            current_qnt = current_qnt_row[0]
            if new_qnt == current_qnt:
                cursor.execute("DELETE FROM myCards WHERE card_name = %s AND set_code = %s", (name, set_code))
            else:
                cursor.execute("UPDATE myCards SET qnt = qnt - %s WHERE card_name = %s AND set_code = %s AND card_condition = %s", (new_qnt,name, set_code))
            conn.commit()

        return jsonify({'message': 'Card Removed!'})
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/retrieveImages', methods=['POST'])
def retrieveImages():
    conn = pymysql.connect(
            host=db_host,
            port=3306,
            user=db_user,
            password=db_password,
            db=db_name
        )
    cursor = conn.cursor()

    try:
       
        data = request.json
        window = data['pageNum']
        offset = (window - 1) * 10

    # Execute the query
        cursor.execute("SELECT * FROM myCards ORDER BY collection_id LIMIT 10 OFFSET %s", (offset))
        # Fetch the results
        results = cursor.fetchall()
        images = {}
        for result in results:
            link = result[5]
            name = result[1]

            images[name] = {'link':link,
                            'set':result[2],
                            'qnt':result[3],
                            'price':result[4]}
        cursor.close()
        conn.close()
    
        # Returning a JSON response with the fetched results
        return jsonify(images), 200
    except Exception as e:
        # Returning a JSON response in case of an error
        return jsonify({'error': str(e)}), 500
    

if __name__ == '__main__':
    app.run(debug=True)
