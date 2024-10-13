from app.models.user import User
from app.models.vols import Volunteer
from app.models.opportunity import Opportunity
from app import db

session = db.session()

def register_user(userName, email, password):
    existing_user = session.query(User).filter_by(email=email).first()
    if existing_user:
        return {'error': 'User with that email already exists'}

    new_user = User(username=userName, email=email, password=password)
    session.add(new_user)
    try:
        session.commit()
        return new_user
    except Exception as e :
        session.rollback()
        return {'error': f'Failed to create user: {str(e)}'}

def login_user(userName, password):
    user = session.query(User).filter_by(userName=userName).first()
    if not user or user.password != password:
        return {'error': 'Invalid username or password'}
    return user

def register_volunteer(email, opp_ID):
    existing_user = session.query(User).filter_by(email=email).first()
    if not existing_user:
        return {'error': 'User with that email does not exist'}
    existing_vol = session.query(Volunteer).filter_by(email=email).first()
    if existing_vol:
        return {'error': 'Volunteer with that email already registered for this event'}
    
    #update opportunties db, num_volunteers_needed field
    opp = session.query(Opportunity).filter_by(opportunity_ID=opp_ID).first()
    new_count = opp.num_volunteers + 1
    if new_count > opp.num_volunteers_needed:
        return {'error': 'Too many volunteers for this event'}
    opp.num_volunteers = new_count
    opp.num_volunteers_needed -= 1

    # add user to volunteer table
    new_vol = Volunteer(email=email, opportunity_ID=opp_ID)
    session.add(new_vol)

    # update user opp count
    existing_user.vol_count += 1

    # get hours_req for opportunity, update user hours volunteered
    hours = opp.hours_req
    existing_user.hours += hours

    try:
        # Commit all changes in one go
        session.commit()
        return new_vol
    except Exception as e:
        session.rollback()
        return {'error': f'Failed to register volunteer: {str(e)}'}
