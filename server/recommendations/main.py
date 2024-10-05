from encode import encode_features
from flask_cors import CORS
from recommend import recommend, insert_user_features
from flask import Flask, request, jsonify


app = Flask(__name__)

CORS(app)
# CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/api/recommend', methods=['POST'])
def recommend_users():
    data = request.json
    
    print(data) 
    features = encode_features(data['story'], data['major'], data['hobbies'], data['country'], data['unique_quality'])
    print(features.shape)
    userids = recommend(features)
    return jsonify({"status": "success", "message": "Data received", "recommendations": userids }), 200

@app.route('/api/insert', methods = ['POST'])
def insert():
    data = request.json()
    userid = data['userid']
    story = data['story']
    major = data['major']
    hobbies = data['hobbies']
    country = data['country']
    unique_quality = data['unique_quality']
    features = encode_features(story, major, hobbies, country, unique_quality)
    insert_user_features(userid,features)
    

if __name__ == '__main__':
    app.run(debug=True)