from app.models import User, Opportunity, Volunteer, Park, Admin
from app import db

def get_total_hours():
    try:
        # get total number of hours volunteered across all opportunities
        total_hours = (
            db.session.query(db.func.sum(Opportunity.hours_req))
            .join(Volunteer, Volunteer.opportunity_id == Opportunity.opportunity_id)
            .scalar()
        )
        return {'total_hours': total_hours}
    except Exception as e:
        return {'error': f'Failed to get total hours: {str(e)}'}
    
def get_total_vols():
    try:
        # get total number of unique volunteers in the Volunteer table
        total_vols = db.session.query(db.func.count(db.func.distinct(Volunteer.email))).scalar()
        return {'total_vols': total_vols}
    except Exception as e:
        return {'error': f'Failed to get total volunteers: {str(e)}'}
    
def get_total_projects():
    try:
        # get total number of unique opportunities in the Opportunity table
        total_projects = db.session.query(db.func.count(db.func.distinct(Opportunity.opportunity_id))).scalar()
        return {'total_projects': total_projects}
    except Exception as e:
        return {'error': f'Failed to get total projects: {str(e)}'}
    
def get_top_parks():
    try:
        # join Volunteer, Opportunity, and Park on park_ID, sum hours volunteered, group by park name
        query = db.session.query(Park.name, db.func.sum(Opportunity.hours_req).label('total_hours'))\
            .join(Volunteer, Volunteer.opportunity_id == Opportunity.opportunity_id)\
            .join(Park, Opportunity.park_id == Park.park_id)\
            .group_by(Park.name)\
            .order_by(db.func.sum(Opportunity.hours_req).desc())\
            .limit(3)\
            .all()
        top_parks = [{'name': park[0], 'hours': park[1]} for park in query]
        return {'top_parks': top_parks}
    except Exception as e:
        return {'error': f'Failed to get top parks: {str(e)}'}
    
def get_100_hour_club():
    try:
        # get count of all volunteers who have volunteered more than 100 hours and not present in admin table
        admin_emails = db.session.query(Admin.email).subquery()

        query = db.session.query(db.func.count(Volunteer.email))\
            .join(Opportunity, Volunteer.opportunity_id == Opportunity.opportunity_id)\
            .group_by(Volunteer.email)\
            .having(db.func.sum(Opportunity.hours_req) > 100)\
            .filter(~Volunteer.email.in_(admin_emails))
        
        return {'100_hour_club': query.scalar()}
    except Exception as e:
        return {'error': f'Failed to get 100 hour club: {str(e)}'}
    
def get_most_common_opp():
    try:
        # get the most common opportunity name by volunteer count
        opp = db.session.query(Opportunity.name)\
            .join(Volunteer, Opportunity.opportunity_id == Volunteer.opportunity_id)\
            .group_by(Opportunity.name)\
            .order_by(db.func.count(Volunteer.email).desc())\
            .first()

        return {'most_common_opp': opp[0]}
    except Exception as e:
        return {'error': f'Failed to get most common opportunity: {str(e)}'}
    
def most_active_park():
    try:
        # get park with most opportunities with date in past 6 months
        park = db.session.query(Park.name)\
            .join(Opportunity, Park.park_id == Opportunity.park_id)\
            .filter(Opportunity.date >= db.func.current_date() - db.text("INTERVAL '6 months'"))\
            .group_by(Park.name)\
            .order_by(db.func.count(Opportunity.opportunity_id).desc())\
            .first()
        
        return {'most_active_park': park[0]}
    except Exception as e:
        return {'error': f'Failed to get most active park: {str(e)}'}

def get_milestones():
    try:
        hundred_hour_club = get_100_hour_club()
        m_active_park = most_active_park()
        m_common_opp = get_most_common_opp()
        return (hundred_hour_club, m_active_park, m_common_opp)
    except Exception as e:
        return {'error': {str(e)}}