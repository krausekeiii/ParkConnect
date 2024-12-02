from app import db

class Volunteer(db.Model):
    __bind_key__ = 'user_db'
    __tablename__ = 'volunteers'
    __table_args__ = (
        db.PrimaryKeyConstraint('email', 'opportunity_id'),
        {'schema': 'vols'}
    )
    email = db.Column(db.String(120), nullable=False)
    opportunity_id = db.Column(db.Integer, nullable=False)
    # may add more as needed

    #used for debugging label to decrease ambiguity
    def __repr__(self):
        return f'<Volunteer {self.email}, Opportunity {self.opportunity_id}>'
    

'''
CREATE table vols.volunteers(
	email VARCHAR(120) NOT NULL PRIMARY KEY,
    opportunity_ID INTEGER NOT NULL
    PRIMARY KEY (email, park_id)
);

trigger relates this table to opportunities, triggering deleting of all volunteers associated with the opportunity
'''