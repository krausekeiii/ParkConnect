from app.models import Opportunity, Park
from app import db

def tojson(opp):
    return {
                'opportunity_id': opp.opportunity_id, 'park_id': opp.park_id, 'name': opp.name,\
                'date': opp.date.strftime("%Y-%m-%d") if opp.date else None,\
                'time': opp.time.strftime("%H:%M:%S") if opp.time else None,\
                'description': opp.description, 'hours_req': opp.hours_req, \
                'volunteers_signed_up': opp.num_volunteers, 'volunteers_needed': opp.num_volunteers_needed
            }

def create_opp(park_id, name, date, time, description, hours_req, num_volunteers_needed, num_volunteers=0):
    new_opp = Opportunity(park_id=park_id, name=name, date=date, time=time, hours_req=hours_req, num_volunteers_needed=num_volunteers_needed, num_volunteers=num_volunteers, description=description)
    db.session.add(new_opp)
    try:
        db.session.commit()
        return tojson(new_opp)
    except Exception as e:
        db.session.rollback()
        return {'error': f'Failed to create opportunity: {str(e)}'}
    
def get_opp(oppID):
    opp = db.session.query(Opportunity).filter(Opportunity.opportunity_id == oppID).first()
    if not opp:
        return {'error': 'Opportunity not found'}
    return tojson(opp)

# Service function to get all opportunities
def get_all_opps():
    try:
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
        ).order_by(Opportunity.opportunity_id).all()

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

        return opportunities
    except Exception as e:
        return {"error": f"Failed to fetch opportunities: {str(e)}"}
    
def delete_opp(opportunity_id):
    opp = db.session.query(Opportunity).filter_by(opportunity_id=opportunity_id).first()
    if not opp:
         return {"error": "Opportunity not found"}
    try:
        db.session.delete(opp)
        db.session.commit()
        return {"message": "Opportunity deleted successfully"}
    except Exception as e:
        db.session.rollback()
        return {"error": f"Failed to delete opportunity: {str(e)}"}
    
def edit_opp(opportunity_id, data):
    opportunity = Opportunity.query.get(opportunity_id)
    
    if not opportunity:
        return {'error': 'Opportunity not found'}, 404

    # Validate input (you can add additional validation as needed)
    name = data.get('name')
    date = data.get('date')
    time = data.get('time')
    description = data.get('description')
    hours_req = data.get('hours_req')
    num_volunteers = data.get('num_volunteers')
    num_volunteers_needed = data.get('num_volunteers_needed')

    # Update the opportunity with the new values
    if name:
        opportunity.name = name
    if date:
        opportunity.date = date
    if time:
        opportunity.time = time
    if description:
        opportunity.description = description
    if hours_req is not None:
        opportunity.hours_req = hours_req
    if num_volunteers is not None:
        opportunity.num_volunteers = num_volunteers
    if num_volunteers_needed is not None:
        opportunity.num_volunteers_needed = num_volunteers_needed

    # Commit the changes to the database
    try:
        db.session.commit()
        return {'message': f'Opportunity {opportunity_id} updated successfully'}, 200
    except Exception as e:
        db.session.rollback()
        return {'error': f'Failed to update opportunity: {str(e)}'}, 500

def get_parks():
    try:
        parks = db.session.query(Park).order_by(Park.park_id).all()

        park_list = [
            {
                "id": park.park_id,
                "name": park.name,
                "state": park.state,
                "address": park.address,
                "phone_number": park.phone_number,
                "hours": park.hours,
                "url": park.url,
                "latitude": park.latitude,
                "longitude": park.longitude
            }
            for park in parks
        ]
        return park_list
    except Exception as e:
        return {"error": f"Failed to fetch parks: {str(e)}"}
    
def create_park(name, state, address, phone_number, hours, url, latitude, longitude):
    found = db.session.query(Park).filter(Park.name == name).first()
    if found is not None:
        return {"error": "Park with that name already exists"}
    new_park = Park(name=name, state=state, address=address, phone_number=phone_number, hours=hours, url=url, latitude=latitude, longitude=longitude)
    db.session.add(new_park)
    try:
        db.session.commit()
        return{
                "id": new_park.park_id,
                "name": new_park.name,
                "state": new_park.state,
                "address": new_park.address,
                "phone_number": new_park.phone_number,
                "hours": new_park.hours,
                "url": new_park.url,
                "latitude": new_park.latitude,
                "longitude": new_park.longitude
                }
    except Exception as e:
        db.session.rollback()
        return {"error": f"Failed to create park: {str(e)}"}
