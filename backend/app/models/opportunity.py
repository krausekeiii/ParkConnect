from app import db

class Opportunity(db.Model):
    __bind_key__ = 'user_db'
    __tablename__ = 'opportunities'
    __table_args__ = {'schema': 'opps'}
    opportunity_ID = db.Column(db.Integer, primary_key=True)
    park_ID = db.Column(db.Integer, nullable=False)
    name = db.Column(db.String(80), nullable=False)
    date = db.Column(db.Date, nullable=False)
    time = db.Column(db.Time, nullable=False)
    description = db.Column(db.String(200))
    hours_req = db.Column(db.Integer, nullable=False)
    num_volunteers = db.Column(db.Integer, nullable=False)
    num_volunteers_needed = db.Column(db.Integer, nullable=False)
    # may add more as needed

    #used for debugging label to decrease ambiguity
    def __repr__(self):
        return '<Opportunity %r>' % self.name