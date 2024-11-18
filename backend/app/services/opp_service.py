from app.models import Opportunity
from app import db

# Service function to get all opportunities
def get_all_opps():
    opps = db.session.query(Opportunity).all()
    return opps

# Service function to create a new opportunity
def create_opp(park_id, name, date, time, description, hours_req, num_volunteers_needed, num_volunteers=0):
    new_opp = Opportunity(
        park_id=park_id,
        name=name,
        date=date,
        time=time,
        description=description,
        hours_req=hours_req,
        num_volunteers=num_volunteers,
        num_volunteers_needed=num_volunteers_needed,
    )
    db.session.add(new_opp)
    db.session.commit()
    return new_opp

# Service function to delete an opportunity
def delete_opp(opportunity_id):
    opp = db.session.query(Opportunity).filter_by(opportunity_id=opportunity_id).first()
    if opp:
        db.session.delete(opp)
        db.session.commit()
        return {"message": "Opportunity deleted successfully"}
    else:
        return {"error": "Opportunity not found"}
