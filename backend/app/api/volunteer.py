from flask import request, jsonify
from app.services import user_service
from app.api import vol_bp

@vol_bp.route('/signup', methods=['POST'])
def volunteer_signup():
    email = request.json.get('email')
    opp_ID = request.json.get('opp_ID')

    if not email or not opp_ID:
        return jsonify({'error': 'Please provide an email and opportunity ID'}), 400

    new_vol = user_service.register_volunteer(email, opp_ID)
    if 'error' in new_vol:
        return jsonify(new_vol), 400

    return new_vol

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