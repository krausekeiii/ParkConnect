from flask import request, jsonify
import app.services.opp_service as opp_service
from app.api import opp_bp

@opp_bp.route('/create', methods=['POST'])
def create_opp_endpoint():
    data = request.json
    print("Received payload:", data)  # Log received payload
    try:
        required_fields = ["park_id", "name", "date", "time", "description", "hours_req", "num_volunteers_needed"]
        missing_fields = [k for k in required_fields if k not in data]
        if missing_fields:
            print("Missing fields:", missing_fields)  # Log missing fields
            return jsonify({"error": f"Missing required fields: {', '.join(missing_fields)}"}), 400

        # Call service function to create a new opportunity
        new_opp = opp_service.create_opp(
            park_id=data["park_id"],
            name=data["name"],
            date=data["date"],
            time=data["time"],
            description=data["description"],
            hours_req=data["hours_req"],
            num_volunteers_needed=data["num_volunteers_needed"],
            num_volunteers=0
        )
        if "error" in new_opp:
            return jsonify(new_opp), 500
        return jsonify({"message": "Opportunity created successfully!", "id": new_opp['opportunity_id']}), 201
    except Exception as e:
        print("Error creating opportunity:", e)  # Log detailed error
        return jsonify({"error": str(e)}), 500


# API endpoint to fetch all opportunities
@opp_bp.route('/opportunities', methods=['GET'])
def get_opportunities():
    opps = opp_service.get_all_opps()
    if "error" in opps:
        return jsonify(opps), 404
    return jsonify(opps), 200

# API endpoint to delete an opportunity
@opp_bp.route('/delete/<int:opportunity_id>', methods=['DELETE'])
def delete_opportunity_endpoint(opportunity_id):
    result = opp_service.delete_opp(opportunity_id)
    if "error" in result:
        return jsonify(result), 404
    return jsonify(result), 200

@opp_bp.route('/edit/<int:opportunity_id>', methods=['PUT'])
def edit_opportunity(opportunity_id):
    # Retrieve the opportunity from the database
    data = request.get_json()

    result = opp_service.edit_opp(opportunity_id, data)

    if "error" in result:
        return jsonify(result), 500
    
    return jsonify(result), 200

# API to fetch all parks
@opp_bp.route('/parks', methods=['GET'])
def get_parks():
    parks = opp_service.get_parks()
    if "error" in parks:
        return jsonify(parks), 500
    return jsonify(parks), 200

# API to add a new park
@opp_bp.route('/parks/add', methods=['POST'])
def add_park():
    data = request.json
    
    required_fields = ["name", "latitude", "longitude"]
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    new_park = opp_service.create_park(
        name=data["name"],
        latitude=data["latitude"],
        longitude=data["longitude"],
        state=data.get("state", ""),
        address=data.get("address", ""),
        phone_number=data.get("phone_number", ""),
        hours=data.get("hours", ""),
        url=data.get("url", "")
    )

    if "error" in new_park:
        return jsonify(new_park), 500
    return jsonify({"message": "Park added successfully!", "id": new_park['id']}), 201
    