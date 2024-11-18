from flask import Blueprint, request, jsonify
from app.services.opp_service import create_opp, get_all_opps, delete_opp
from app.models import Opportunity, Park  # Import the Park model

@opp_bp.route('/create', methods=['POST'])
def create_opp_endpoint():
    data = request.json
    try:
        # Ensure all required fields are provided
        required_fields = ["park_id", "name", "date", "time", "hours_req", "num_volunteers_needed"]
        if not all(k in data for k in required_fields):
            return jsonify({"error": "Please provide all required fields"}), 400

        # Call service function to create a new opportunity
        new_opp = create_opp(
            park_id=data["park_id"],
            name=data["name"],
            date=data["date"],
            time=data["time"],
            description=data.get("description", ""),
            hours_req=data["hours_req"],
            num_volunteers_needed=data["num_volunteers_needed"],
            num_volunteers=data.get("num_volunteers", 0),  # Default to 0
        )

        return jsonify({
            "message": "Opportunity created successfully!",
            "id": new_opp.opportunity_id,
        }), 201

    except Exception as e:
        print("Error creating opportunity:", e)
        return jsonify({"error": f"Failed to create opportunity: {str(e)}"}), 500

# API endpoint to fetch all opportunities
@opp_bp.route('/opportunities', methods=['GET'])
def get_opportunities():
    from app.models import Opportunity, Park
    from app import db

    # Perform a join between opportunities and parks
    opps = db.session.query(
        Opportunity,
        Park.name.label("park_name"),
        Park.state,
        Park.address,
        Park.phone_number,
        Park.hours,
        Park.url,
        Park.latitude,
        Park.longitude
    ).join(
        Park, Opportunity.park_id == Park.park_id
    ).all()

    opportunities = [
        {
            "id": opp.opportunity_id,
            "name": opp.name,
            "park_id": opp.park_id,
            "date": str(opp.date),
            "time": str(opp.time),
            "description": opp.description,
            "hours_req": opp.hours_req,
            "volunteers_needed": opp.num_volunteers_needed,
            "volunteers_signed_up": opp.num_volunteers,
            "latitude": latitude,
            "longitude": longitude,
            "park_name": park_name,
            "state": state,
            "address": address,
            "phone_number": phone_number,
            "hours": hours,
            "url": url
        }
        for opp, park_name, state, address, phone_number, hours, url, latitude, longitude in opps
    ]
    return jsonify(opportunities), 200





# API endpoint to delete an opportunity
@opp_bp.route('/<int:opportunity_id>', methods=['DELETE'])
def delete_opportunity_endpoint(opportunity_id):
    result = delete_opp(opportunity_id)
    if "error" in result:
        return jsonify(result), 404
    return jsonify(result), 200
