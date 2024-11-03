from app import db

class Volunteer(db.Model):
    __bind_key__ = 'user_db'
    __tablename__ = 'volunteers'
    __table_args__ = {'schema': 'vols'}
    email = db.Column(db.String(120), nullable=False, primary_key=True)
    opportunity_ID = db.Column(db.Integer, nullable=False)
    # may add more as needed

    #used for debugging label to decrease ambiguity
    def __repr__(self):
        return '<Volunteer %r>' % self.email
    

'''
CREATE table vols.volunteers(
	email VARCHAR(120) NOT NULL PRIMARY KEY,
    opportunity_ID INTEGER NOT NULL
);
'''