from app.models import Opportunity, Volunteer, User
from app import db

session = db.session()

def create_opp(opportunity_ID, park_ID, name, date, time, description, hours_req, num_volunteers_needed, num_volunteers=0):
    existing_opp = session.query(Opportunity).filter_by(opportunity_ID=opportunity_ID).first()
    if existing_opp:
        return {'error': 'Opportunity with that ID already exists'}
    
    new_opp = Opportunity(opportunity_ID=opportunity_ID, park_ID=park_ID, name=name, date=date, time=time, hours_req=hours_req, num_volunteers_needed=num_volunteers_needed, num_volunteers=num_volunteers, description=description)
    session.add(new_opp)
    try:
        session.commit()
        return new_opp
    except Exception as e:
        session.rollback()
        return {'error': f'Failed to create opportunity: {str(e)}'}
    
def get_all_opps():
    opps = session.query(Opportunity).all()
    return opps