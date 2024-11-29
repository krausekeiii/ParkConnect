from app.models import User, Opportunity, Volunteer, Admin, Park
from app import db
import dotenv
import os

def jsonadmin(admin):
    return {
        'email': admin.email,
        'parkID': admin.parkID
    }

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
        admin = Admin(email=new, parkID=parkID)
        db.session.add(admin)
        new_admin.role = 'admin'
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return {'error': f'Failed to add admin to admin table: {str(e)}'}
    
    return jsonadmin(admin)

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
    
    return jsonadmin(old_admin)

def get_top3_users(parkID):
    # cross query vols to find opportunity id, getting only opportunities belonging to parkID
    # then group by user email and sum hours
    # finally order by sum of hours and limit to 3
    try:
        top3 = db.session.query(
            Volunteer.email, db.func.sum(Opportunity.hours_req)
        ).select_from(Volunteer).join(
            Opportunity, Volunteer.opportunity_id == Opportunity.opportunity_id
        ).filter(
            Opportunity.park_id == parkID
        ).group_by(
            Volunteer.email
        ).order_by(
            db.func.sum(Opportunity.hours_req).desc()
        ).limit(3).all()
        users = [{'email': user[0], 'hours': user[1]} for user in top3]
        return users
    except Exception as e:
        return {'error': f'Failed to get top 3 users: {str(e)}'}

def get_top_opportunites(parkID):
    # get top 3 opportunities by number of volunteers
    try:
        top3 = db.session.query(Opportunity.name, Opportunity.num_volunteers).filter(Opportunity.park_id == parkID).order_by(Opportunity.num_volunteers.desc()).limit(3).all()
        opps = [{'name': opp[0], 'volunteers': opp[1]} for opp in top3]
        return opps
    except Exception as e:
        return {'error': f'Failed to get top 3 opportunities: {str(e)}'}

def get_total_hours(parkID):
    # get total hours that users have volunteered at a parkID
    try:
        hours_vold = db.session.query(db.func.sum(Opportunity.hours_req * Opportunity.num_volunteers)).filter(Opportunity.park_id == parkID).scalar()
        return hours_vold
    except Exception as e:
        return {'error': f'Failed to get total hours: {str(e)}'}

def notify_users(parkID, message, subject):
    # get all users who have volunteered at parkID
    try:
        # gets email of anyone who's ever volunteerd at parkID
        emails = [user['email'] for user in get_top3_users(parkID)]
        park = db.session.query(Park.name).filter(Park.park_id == parkID).first()
        import smtplib
        from email.mime.text import MIMEText
        from email.mime.multipart import MIMEMultipart

        dotenv.load_dotenv()
        EMAIL_ID = os.getenv('EMAIL_ID')
        EMAIL_P = os.getenv('EMAIL_P')

        # Prepare the email
        msg = MIMEMultipart()
        msg['From'] = EMAIL_ID
        msg['Subject'] = subject
        
        for receiver_email in emails:
            msg['To'] = receiver_email
            msg.attach(MIMEText(message, 'plain'))
            # Send the email
            with smtplib.SMTP('smtp.gmail.com', 587) as server:
                server.starttls()  # Secure connection
                server.login(EMAIL_ID, EMAIL_P)
                server.sendmail(EMAIL_ID, receiver_email, msg.as_string())
            print(f"Email sent successfully to {receiver_email}!")
        return {'message': f'Email sent to all users who have volunteered at {park.name}'}
    except Exception as e:
        print(f"Error: {e}")
        return {'error': f'Failed to send email: {str(e)}'}