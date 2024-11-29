from flask import request, jsonify
from app.services import user_service, opp_service
from app.api import vol_bp

# Fetch available opportunities
@vol_bp.route('/opportunities', methods=['GET'])
def get_opportunities():
    opportunities = opp_service.get_all_opps()  # Use the service function
    # Return a serialized version of the opportunities
    serialized_opportunities = [
        {
            'id': opp.opportunity_ID,
            'name': opp.name,
            'description': opp.description,
            'date': opp.date,
            'time': opp.time,
        }
        for opp in opportunities
    ]
    return jsonify(serialized_opportunities), 200

# Volunteer signup
@vol_bp.route('/signup', methods=['POST'])
def volunteer_signup():
    email = request.json.get('email')
    opp_ID = request.json.get('opp_ID')
    info = request.json.get('info', '')  # Optional info field

    if not email or not opp_ID:
        return jsonify({'error': 'Please provide an email and opportunity ID'}), 400

    # Use the user service to register the volunteer
    new_vol = user_service.register_volunteer(email, opp_ID)
    if 'error' in new_vol:
        return jsonify(new_vol), 400

    return jsonify({'message': f'Successfully signed up for opportunity ID {opp_ID}!'}), 201

@vol_bp.route('/unregister', methods=['POST'])
def unreg_vol():
    email = request.json.get('email')
    opp_ID = request.json.get('opp_ID')

    if not email or not opp_ID:
        return jsonify({'error': 'Please provide an email and opportunity ID'}), 400

    unreg_vol = user_service.unregister_vol(email, opp_ID)
    if 'error' in unreg_vol:
        return jsonify(unreg_vol), 400

    return unreg_vol
