from app.models.user import User
from app.models.vols import Volunteer
from app.models.opportunity import Opportunity
from app import db
from flask import jsonify

def register_user(userName, email, password, name, description):
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
    except Exception as e :
        db.session.rollback()
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
        return user
    except Exception as e:
        db.session.rollback()
        return {'error': f'Failed to add name: {str(e)}'}

def login_user(email, password):
    user = db.session.query(User).filter_by(email=email).first()
    if not user or user.password != password:
        return {'error': 'Invalid email or password'}
    return user

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
        # Commit all changes in one go
        db.session.commit()
        return new_vol
    except Exception as e:
        db.session.rollback()
        return {'error': f'Failed to register volunteer: {str(e)}'}
