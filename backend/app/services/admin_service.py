from app.models import User, Opportunity, Volunteer, Admin, Park
from app import db
import dotenv
import os

def jsonadmin(admin):
    return {
        'email': admin.email,
        'parkID': admin.park_id
    }

def isAdmin(email, parkID):
    user = Admin.query.filter_by(email=email, park_id=parkID).first()
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
        admin = Admin(email=new, park_id=parkID)
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
        db.session.query(Admin).filter(Admin.email == old, Admin.park_id == parkID).delete()
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return {'error': f'Failed to remove admin from admin table: {str(e)}'}
    
    return jsonadmin(old_admin)

def get_top3_users(parkID):
    # Query to get top 3 users by total hours volunteered at a given park
    try:
        top3 = db.session.query(
            User.name, User.email, db.func.sum(Opportunity.hours_req)
        ).select_from(Volunteer).join(
            Opportunity, Volunteer.opportunity_id == Opportunity.opportunity_id
        ).join(
            User, User.email == Volunteer.email
        ).filter(
            Opportunity.park_id == parkID
        ).filter(
            ~Volunteer.email.in_(db.session.query(Admin.email))  # Exclude admins
        ).group_by(
            User.name, User.email  
        ).order_by(
            db.func.sum(Opportunity.hours_req).desc()
        ).limit(3).all()
        
        return top3
    except Exception as e:
        return {'error': f'Failed to get top 3 users: {str(e)}'}

def top_3_user_stats(parkID):
    users = get_top3_users(parkID)
    user_info = []
    for user in users:
        # Get total hours user has volunteered at park
        try:
            total_hours = (
                    db.session.query(db.func.sum(Opportunity.hours_req))
                    .select_from(Volunteer)
                    .join(Opportunity, Volunteer.opportunity_id == Opportunity.opportunity_id)
                    .filter(
                        Volunteer.email == user.email,
                        Opportunity.park_id == parkID
                    )
                    .scalar()
                ) or 0  # Default to 0 if no result
        except Exception as e:
            return {'error': f'Failed to get total_hours for {user.email}: {str(e)}'}

        # Get total number of opportunities user has volunteered at park
        try:
            total_opps = (
                    db.session.query(db.func.count(Opportunity.opportunity_id))
                    .select_from(Volunteer)
                    .join(Opportunity, Volunteer.opportunity_id == Opportunity.opportunity_id)
                    .filter(
                        Volunteer.email == user.email,
                        Opportunity.park_id == parkID
                    )
                    .scalar()
                ) or 0  # Default to 0 if no result
        except Exception as e:
            return {'error': f'Failed to get total_opps for {user.email}: {str(e)}'}

        # Calculate badges based on total hours and total opportunities
        badges = []
        if total_hours > 100:
            badges.append("Platinum Volunteer")
        elif total_hours > 50:
            badges.append("Gold Volunteer")
        elif total_hours > 25:
            badges.append("Silver Volunteer")
        elif total_hours > 10:
            badges.append("Bronze Volunteer")
        
        if total_opps > 10:
            badges.append("Opportunity Champion")
        if total_hours > 100 and total_opps > 10:
            badges.append("Smokey's Finest")

        # Append the user stats to the user_info list
        user_info.append({
            "name": user.name,
            "email": user.email,
            "total_hours": total_hours,
            "total_opps": total_opps,
            "badges": badges
        })
    
    return user_info

    
def get_top_opportunites(parkID):
    # get top 3 opportunities by number of volunteers
    try:
        top3 = db.session.query(Opportunity.name, Opportunity.num_volunteers).filter(Opportunity.park_id == parkID).order_by(Opportunity.num_volunteers.desc()).limit(3).all()
        opps = [{'name': opp[0], 'volunteers': opp[1]} for opp in top3]
        return opps
    except Exception as e:
        return {'error': f'Failed to get top 3 opportunities: {str(e)}'}

def get_total_hours_by_month(parkID):
    # get total hours volunteered by month for parkID for past 6 months
    try:
        hours = db.session.query(
            db.func.extract('month', Opportunity.date),
            db.func.sum(Opportunity.hours_req)
        ).join(
            Volunteer, Volunteer.opportunity_id == Opportunity.opportunity_id
        ).filter(
            Opportunity.park_id == parkID,
            Opportunity.date >= db.func.current_date() - db.text("INTERVAL '6 months'")
        ).group_by(
            db.func.extract('month', Opportunity.date)
        ).all()
        return {'hours': [{'month': hour[0], 'hours': hour[1]} for hour in hours]}
    except Exception as e:
        return {'error': f'Failed to get total hours by month: {str(e)}'}

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