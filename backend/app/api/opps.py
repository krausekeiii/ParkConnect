from app.api import opp_bp
from flask import request, jsonify
from app.services import opp_service

@opp_bp.route('/create', methods=['POST'])
def create_opp():
    opp_ID = request.json.get('opportunity_ID')
    name = request.json.get('name')
    description = request.json.get('description')
    park = request.json.get('park_ID')
    date = request.json.get('date')
    time = request.json.get('time')
    duration = request.json.get('hours_req')
    volunteers_needed = request.json.get('num_volunteers_needed')
    num_volunteers = request.json.get('num_volunteers')

    if not opp_ID or not name or not description or not park or not date or not time or not duration or not volunteers_needed:
        return jsonify({'error': 'Please provide all required fields'}), 500
    
    new_opp = opp_service.create_opp(opp_ID, park, name, date, time, description, duration, volunteers_needed, num_volunteers)
    if 'error' in new_opp:
        return jsonify(new_opp), 400
    
    return jsonify(new_opp), 201
