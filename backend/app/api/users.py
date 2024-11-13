from flask import request, jsonify
from app.services import user_service
from app.api import user_bp

@user_bp.route('/stats/<int:user>', methods=['GET'])
def get_user_stats(user):
    hours = user_service.get_hours_vold(user)
    if 'error' in hours:
        return jsonify(hours), 400
    opps = user_service.get_opps_vold(user)
    if 'error' in opps:
        return jsonify(opps), 400
    top_parks = user_service.get_top_parks(user)
    if 'error' in top_parks:
        return jsonify(top_parks), 400
    
    top_parks = [{'parkID': park[0], 'hours': park[1]} for park in top_parks]
    stats = {
        'hours': hours,
        'opps': opps,
        'topParks': top_parks
    }
    return stats

