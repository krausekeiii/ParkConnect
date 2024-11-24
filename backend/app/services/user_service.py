from app.models.user import User
from app.models.vols import Volunteer
from app.models.opportunity import Opportunity
from app.models.parks import Park
from app import db
from flask import jsonify

def register_user(userName, email, password, name, description=''):
    print(f"Registering user: {userName}, {email}, {name}, Description: '{description}'")
    existing_user = db.session.query(User).filter_by(email=email).first()
    if existing_user:
        return {'error': 'User with that email already exists'}

    new_user = User(username=userName, email=email, password=password, name=name, description=description, hours=0, vol_count=0)
    db.session.add(new_user)
    try:
        db.session.commit()
        # Convert the User object to a JSON-serializable dictionary
        user_data = {
            'username': new_user.username,
            'email': new_user.email,
            'name': new_user.name,
            'description': new_user.description,
            'hours': new_user.hours,
            'vol_count': new_user.vol_count
        }
        return jsonify(user_data), 201
    except Exception as e:
        db.session.rollback()
        print(f"Failed to create user: {str(e)}")  # Log the exception
        return {'error': f'Failed to create user: {str(e)}'}

def edit_description(email, description):
    user = db.session.query(User).filter_by(email=email).first()
    if not user:
        return {'error': 'User with that email does not exist'}
    user.description = description
    try:
        db.session.commit()
        return user
    except Exception as e:
        db.session.rollback()
        return {'error': f'Failed to add description: {str(e)}'}

def edit_name(email, name):
    user = db.session.query(User).filter_by(email=email).first()
    if not user:
        return {'error': 'User with that email does not exist'}
    user.name = name
    try:
        db.session.commit()
        user_data = {
            'username': user.username,
            'email': user.email,
            'name': user.name,
        }
        return jsonify(user_data), 201
    except Exception as e:
        db.session.rollback()
        return {'error': f'Failed to add name: {str(e)}'}

def login_user(email, password):
    # Query the database for the user by email
    user = db.session.query(User).filter_by(email=email).first()

    # Check if user exists
    if not user:
        return None  # Return None if the user does not exist

    # Compare the plaintext passwords (avoid this in production)
    if user.password != password:
        return None  # Return None if the password does not match

    return user  # Return the user object if the credentials are valid

def register_volunteer(email, opp_ID):
    existing_user = db.session.query(User).filter_by(email=email).first()
    if not existing_user:
        return {'error': 'User with that email does not exist'}
    existing_vol = db.session.query(Volunteer).filter_by(email=email).first()
    if existing_vol:
        return {'error': 'Volunteer with that email already registered for this event'}
    
    #update opportunties db, num_volunteers_needed field
    opp = db.session.query(Opportunity).filter_by(opportunity_ID=opp_ID).first()
    new_count = opp.num_volunteers + 1
    if new_count > opp.num_volunteers_needed:
        return {'error': 'Too many volunteers for this event'}
    opp.num_volunteers = new_count
    opp.num_volunteers_needed -= 1

    # add user to volunteer table
    new_vol = Volunteer(email=email, opportunity_ID=opp_ID)
    db.session.add(new_vol)

    # update user opp count
    existing_user.vol_count += 1

    # get hours_req for opportunity, update user hours volunteered
    hours = opp.hours_req
    existing_user.hours += hours

    try:
        db.session.commit()
        user_data = {
            'email': new_vol.email,
            'opportunity_ID': new_vol.opportunity_ID
        }
        return jsonify(user_data), 201
    except Exception as e:
        db.session.rollback()
        return {'error': f'Failed to register volunteer: {str(e)}'}
    
def unregister_vol(email, opp_ID):
    # Check if user exists
    existing_user = db.session.query(User).filter_by(email=email).first()
    if not existing_user:
        return {'error': 'User with that email does not exist'}

    # Check if volunteer is registered for this opportunity
    existing_vol = db.session.query(Volunteer).filter_by(email=email, opportunity_ID=opp_ID).first()
    if not existing_vol:
        return {'error': 'User is not registered as a volunteer for this event'}

    # Update opportunity volunteer count
    opp = db.session.query(Opportunity).filter_by(opportunity_ID=opp_ID).first()
    if opp.num_volunteers > 0:
        opp.num_volunteers -= 1
        opp.num_volunteers_needed += 1

    # Remove volunteer entry
    db.session.delete(existing_vol)

    # Update user volunteer count and hours
    if existing_user.vol_count > 0:
        existing_user.vol_count -= 1
    
    # Subtract the hours for this opportunity from the user's total hours
    hours = opp.hours_req
    existing_user.hours = max(existing_user.hours - hours, 0)  # Ensures hours don’t go below zero

    try:
        db.session.commit()
        return {'message': 'Volunteer unregistered successfully'}, 200
    except Exception as e:
        db.session.rollback()
        return {'error': f'Failed to unregister volunteer: {str(e)}'}    
    
def get_hours_vold(userEmail):
    user = db.session.query(User).filter_by(email=userEmail).first()
    if not user:
        return {'error': 'User with that email does not exist'}
    return user.hours

def get_vol_count(userEmail):
    user = db.session.query(User).filter_by(email=userEmail).first()
    if not user:
        return {'error': 'User with that email does not exist'}
    return user.vol_count

def get_top_parks(userEmail):
    # Join Volunteer, Opportunity, and Park on park_ID, sum hours volunteered, group by park name
    query = db.session.query(Park.name, db.func.sum(Opportunity.hours_req).label('total_hours'))\
        .join(Volunteer, Volunteer.opportunity_ID == Opportunity.opportunity_ID)\
        .join(Park, Park.park_ID == Opportunity.park_ID)\
        .filter(Volunteer.email == userEmail)\
        .group_by(Park.name)\
        .order_by(db.func.sum(Opportunity.hours_req).desc())\
        .limit(3)
    
    return query.all()