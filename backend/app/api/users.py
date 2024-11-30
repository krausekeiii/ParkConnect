from flask import request, jsonify
from app.services import user_service
from app.api import user_bp

@user_bp.route('/stats/<string:user>', methods=['GET'])
def get_user_stats(user):
    if not user:
        return jsonify({'error': 'Please provide a user email'}), 400
    hours = user_service.get_hours_vold(user)
    if 'error' in hours:
        return jsonify(hours), 400
    opps = user_service.get_opps_vold(user)
    if 'error' in opps:
        return jsonify(opps), 400
    top_parks = user_service.get_top_parks(user)
    if 'error' in top_parks:
        return jsonify(top_parks), 400
    
    top_parks = [{'parkName': park[0], 'hours': park[1]} for park in top_parks]
    stats = {
        'hours': hours,
        'opps': opps,
        'topParks': top_parks
    }
    return stats

@user_bp.route('/list', methods=['GET'])
def list_users():
    from app.models.user import User  # Import the User model
    from app import db

    # Fetch all users from the database
    users = db.session.query(User).all()
    
    # Serialize the users for JSON response
    serialized_users = [
        {
            'id': user.id,
            'name': user.name or "N/A",  # Handle empty names
            'email': user.email,
            'role': user.role
        }
        for user in users
    ]
    
    return jsonify(serialized_users), 200

@user_bp.route('/<int:user_id>', methods=['PUT'])
def edit_user(user_id):
    from app.models.user import User  # Import the User model
    from app import db

    data = request.json
    user = db.session.query(User).filter_by(id=user_id).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    # Update fields
    user.name = data.get('name', user.name)
    user.email = data.get('email', user.email)
    user.role = data.get('role', user.role)

    try:
        db.session.commit()
        return jsonify({'message': f'User with ID {user_id} updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to update user: {str(e)}'}), 500

@user_bp.route('/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    from app.models.user import User  # Import the User model
    from app import db

    user = db.session.query(User).filter_by(id=user_id).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    try:
        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': f'User with ID {user_id} deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to delete user: {str(e)}'}), 500
