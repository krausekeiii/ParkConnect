from app.models import User, Opportunity, Volunteer, Admin
from app import db

def isAdmin(email, parkID):
    user = Admin.query.filter_by(email=email, parkID=parkID).first()
    if user:
        return True
    return False

def add_admin(new, curr, parkID):
    new_admin = User.query.filter_by(email=new).first()
    if not new_admin:
        return {'error': 'User with that email does not exist, create user profile first.'}
    if not isAdmin(curr, parkID):
        return {'error': 'Permission denied- Current user is not an admin'}
    try:
        # add new admin to admin table
        new_admin = Admin(email=new, parkID=parkID)
        db.session.add(new_admin)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return {'error': f'Failed to add admin to admin table: {str(e)}'}
    
    return new_admin

def remove_admin(old, curr, parkID):
    old_admin = User.query.filter_by(email=old).first()
    if not isAdmin(old, parkID):
        return {'error': f'User with that email does not have admin permissions for park {str(parkID)}.'}
    if not isAdmin(curr, parkID):
        return {'error': 'Permission denied- Current user is not an admin'}
    try:
        # remove old admin from admin table
        db.session.query(Admin).filter(Admin.email == old, Admin.parkID == parkID).delete()
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return {'error': f'Failed to remove admin from admin table: {str(e)}'}
    
    return old_admin

def get_top3_users(parkID):
    # cross query vols to find opportunity id, getting only opportunities belonging to parkID
    # then group by user email and sum hours
    # finally order by sum of hours and limit to 3
    top3 = db.session.query(Volunteer.email, db.func.sum(Opportunity.hours_req)).join(Opportunity).filter(Opportunity.park_ID == parkID).group_by(Volunteer.email).order_by(db.func.sum(Opportunity.hours_req).desc()).limit(3).all()
    return top3

def get_top_opportunites(parkID):
    # get top 3 opportunities by number of volunteers
    top3 = db.session.query(Opportunity.name, Opportunity.num_volunteers).filter(Opportunity.park_ID == parkID).order_by(Opportunity.num_volunteers.desc()).limit(3).all()
    return top3

def get_total_hours(parkID):
    # get total hours that users have volunteered at a parkID
    hours_vold = db.session.query(db.func.sum(Opportunity.hours_req * Opportunity.num_volunteers)).filter(Opportunity.park_ID == parkID).scalar()
    return hours_vold

