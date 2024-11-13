from flask import request, jsonify
from app.services import admin_service
from app.api import admin_bp


# json request: POST, newAdmin = email of user to give admin permissions, admin = email of current user
@admin_bp.route('/add', methods=['POST'])
def add_admin():
    new_admin = request.json.get('newAdmin') # email of new admin
    admin = request.json.get('admin')     # email of current admin
    parkID = request.json.get('parkID')   # park id
    if not new_admin or not admin or not parkID:
        return jsonify({'error': 'Please provide a parkID and emails for admin and newAdmin'}), 400
    
    result = admin_service.add_admin(new_admin, admin, parkID)
    if 'error' in result:
        return jsonify(result), 500
    return jsonify('Success'), 200

# json request: POST, oldAdmin = email of user to remove admin permissions, admin = email of current user
@admin_bp.route('/remove', methods=['POST'])
def remove_admin():
    old_admin = request.json.get('oldAdmin') # email of old admin
    admin = request.json.get('admin')     # email of current admin
    parkID = request.json.get('parkID')   # park id
    if not old_admin or not admin:
        return jsonify({'error': 'Please provide parkID and emails for admin and oldAdmin'}), 400

    result = admin_service.remove_admin(old_admin, admin, parkID)
    if 'error' in result:
        return jsonify(result), 500
    return jsonify('Success'), 200

# json request: GET, parkID = park id
@admin_bp.route('/stats/<parkID>', methods=['GET'])
def get_stats(parkID):
    if not parkID:
        return jsonify({'error': 'Please provide a park ID'}), 400

    users = admin_service.get_top3_users(parkID)
    opps = admin_service.get_top_opportunites(parkID)
    hours = admin_service.get_total_hours(parkID)

    if 'error' in users:
        return jsonify(users), 500
    if 'error' in opps:
        return jsonify(opps), 500
    if 'error' in hours:
        return jsonify(hours), 500
    
    users = [{'email': user[0], 'hours': user[1]} for user in users]
    opps = [{'name': opp[0], 'volunteers': opp[1]} for opp in opps]
    result = {
        'top3Users': users,
        'top3Opportunities': opps,
        'totalHours': hours
    }
    return jsonify(result), 200