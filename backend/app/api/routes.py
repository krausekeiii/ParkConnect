from flask import jsonify, request
from app.api import api_bp
from app.models import User
from app.services.user_service import get_user_by_id, create_user

@api_bp.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = get_user_by_id(user_id)
    if user:
        return jsonify(user.to_dict()), 200
    else:
        return jsonify({'error': 'User not found'}), 404

@api_bp.route('/users', methods=['POST'])
def add_user():
    data = request.get_json()
    user = create_user(data)
    return jsonify(user.to_dict()), 201
