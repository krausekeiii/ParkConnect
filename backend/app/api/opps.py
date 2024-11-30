from flask import Blueprint, request, jsonify
from app.services.opp_service import create_opp, get_all_opps, delete_opp
from app.models import Opportunity, Park
from app import db

# Define Blueprint
opp_bp = Blueprint('opp', __name__)

# API endpoint to create a new opportunity
@opp_bp.route('/opportunities/create', methods=['POST'])
def create_opp_endpoint():
    data = request.json
    print("Received payload:", data)  # Log received payload
    try:
        required_fields = ["park_id", "name", "date", "time", "description", "hours_req", "num_volunteers_needed"]
        missing_fields = [k for k in required_fields if k not in data]
        if missing_fields:
            print("Missing fields:", missing_fields)  # Log missing fields
            return jsonify({"error": f"Missing required fields: {', '.join(missing_fields)}"}), 400

        new_opp = Opportunity(
            park_id=data["park_id"],
            name=data["name"],
            date=data["date"],
            time=data["time"],
            description=data["description"],
            hours_req=data["hours_req"],
            num_volunteers_needed=data["num_volunteers_needed"],
            num_volunteers=0
        )
        db.session.add(new_opp)
        db.session.commit()
        return jsonify({"message": "Opportunity created successfully!", "id": new_opp.opportunity_id}), 201
    except Exception as e:
        db.session.rollback()
        print("Error creating opportunity:", e)  # Log detailed error
        return jsonify({"error": str(e)}), 500


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

# API endpoint to update an opportunity
@opp_bp.route('/opportunities/<int:opportunity_id>', methods=['PUT'])
def update_opportunity(opportunity_id):
    data = request.json
    try:
        opportunity = Opportunity.query.get(opportunity_id)
        if not opportunity:
            return jsonify({"error": "Opportunity not found"}), 404

        # Update fields
        opportunity.name = data.get("name", opportunity.name)
        opportunity.date = data.get("date", opportunity.date)
        opportunity.time = data.get("time", opportunity.time)
        opportunity.description = data.get("description", opportunity.description)
        opportunity.hours_req = data.get("hours_req", opportunity.hours_req)
        opportunity.num_volunteers_needed = data.get("num_volunteers_needed", opportunity.num_volunteers_needed)

        db.session.commit()
        return jsonify({"message": "Opportunity updated successfully!"}), 200
    except Exception as e:
        db.session.rollback()
        print("Error updating opportunity:", e)
        return jsonify({"error": str(e)}), 500

# API endpoint to delete an opportunity
@opp_bp.route('/opportunities/<int:opportunity_id>', methods=['DELETE'])
def delete_opportunity(opportunity_id):
    try:
        opp = Opportunity.query.get(opportunity_id)
        if not opp:
            return jsonify({"error": "Opportunity not found"}), 404
        db.session.delete(opp)
        db.session.commit()
        return jsonify({"message": "Opportunity deleted successfully!"}), 200
    except Exception as e:
        db.session.rollback()
        print("Error deleting opportunity:", e)
        return jsonify({"error": str(e)}), 500

# API to fetch all parks
@opp_bp.route('/parks', methods=['GET'])
def get_parks():
    try:
        parks = Park.query.all()
        parks_data = [{"id": park.park_id, "name": park.name, "latitude": park.latitude, "longitude": park.longitude} for park in parks]
        return jsonify(parks_data), 200
    except Exception as e:
        print("Error fetching parks:", e)
        return jsonify({"error": str(e)}), 500

# API to add a new park
@opp_bp.route('/parks', methods=['POST'])
def add_park():
    data = request.json
    try:
        required_fields = ["name", "latitude", "longitude"]
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400

        new_park = Park(
            name=data["name"],
            latitude=data["latitude"],
            longitude=data["longitude"],
            state=data.get("state", ""),
            address=data.get("address", ""),
            phone_number=data.get("phone_number", ""),
            hours=data.get("hours", ""),
            url=data.get("url", "")
        )
        db.session.add(new_park)
        db.session.commit()
        return jsonify({"message": "Park added successfully!", "id": new_park.park_id}), 201
    except Exception as e:
        db.session.rollback()
        print("Error adding park:", e)
        return jsonify({"error": str(e)}), 500
