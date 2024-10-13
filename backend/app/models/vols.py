from app import db

class Volunteer(db.Model):
    __bind_key__ = 'user_db'
    __tablename__ = 'volunteers'
    __table_args__ = {'schema': 'volunteers'}
    email = db.Column(db.String(120), nullable=False, primary_key=True)
    opportunity_ID = db.Column(db.Integer, nullable=False)
    # may add more as needed

    #used for debugging label to decrease ambiguity
    def __repr__(self):
        return '<Volunteer %r>' % self.email