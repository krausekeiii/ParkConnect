# defines api endpoints for user sign-up and login

from flask import request, jsonify, Blueprint
from app.services import user_service

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    userName = request.json.get('userName')
    email = request.json.get('email')
    password = request.json.get('password')

    if not userName or not email or not password:
        return jsonify({'error': 'Please provide a username, email, and password'}), 400

    new_user = user_service.register_user(userName, email, password)
    if 'error' in new_user:
        return jsonify(new_user), 400

    return jsonify(new_user), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    username = request.json.get('username')
    email = request.json.get('email')   #  determine if we want to login w/ username or email or either
    password = request.json.get('password')

    if not username or not password:
        return jsonify({'error': 'Please provide an username and password'}), 400

    user = user_service.login_user(username, password)
    if 'error' in user:
        return jsonify(user), 400

    return jsonify(user), 200