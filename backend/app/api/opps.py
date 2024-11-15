from app.api import opp_bp
from flask import request, jsonify
from app.services import opp_service


@opp_bp.route('/create', methods=['POST'])
def create_opp():
    name = request.json.get('name')
    description = request.json.get('description')
    park = request.json.get('park_ID')
    date = request.json.get('date')
    time = request.json.get('time')
    duration = request.json.get('hours_req')
    volunteers_needed = request.json.get('num_volunteers_needed')
    num_volunteers = request.json.get('num_volunteers')

    if not name or not description or not park or not date or not time or not duration or not volunteers_needed:
        return jsonify({'error': 'Please provide all required fields'}), 400
    
    new_opp = opp_service.create_opp(park, name, date, time, description, duration, volunteers_needed, num_volunteers)
    if 'error' in new_opp:
        return jsonify(new_opp), 400
    
    return jsonify(new_opp), 200

@opp_bp.route('/get/<int:oppID>', methods=['GET'])
def get_opp(oppID):
    if not oppID:
        return jsonify({'error': 'Please provide an opportunity ID'}), 400
    
    opp = opp_service.get_opp(oppID)
    if 'error' in opp:
        return jsonify(opp), 400
    
    return jsonify(opp), 200

@opp_bp.route('/getall', methods=['GET'])
def get_all_opps():
    opps = opp_service.get_all_opps()
    if 'error' in opps:
        return jsonify(opps), 400
    
    return jsonify(opps), 200
