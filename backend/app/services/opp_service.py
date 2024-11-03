from app.models import Opportunity, Volunteer, User
from app import db



def create_opp(park_ID, name, date, time, description, hours_req, num_volunteers_needed, num_volunteers=0):
    new_opp = Opportunity(park_ID=park_ID, name=name, date=date, time=time, hours_req=hours_req, num_volunteers_needed=num_volunteers_needed, num_volunteers=num_volunteers, description=description)
    db.session.add(new_opp)
    try:
        db.session.commit()
        return new_opp
    except Exception as e:
        db.session.rollback()
        return {'error': f'Failed to create opportunity: {str(e)}'}
    
def get_all_opps():
    opps = db.session.query(Opportunity).all()
    return opps