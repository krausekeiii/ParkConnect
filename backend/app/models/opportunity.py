from app import db

class Opportunity(db.Model):
    __bind_key__ = 'user_db'
    __tablename__ = 'opportunities'
    __table_args__ = {'schema': 'opps'}
    opportunity_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    park_id = db.Column(db.Integer, nullable=False)
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
    

'''
CREATE TABLE public.opportunities (
    opportunity_ID INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    park_ID INTEGER NOT NULL,
    name VARCHAR(80) NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    description VARCHAR(200),
    hours_req INTEGER NOT NULL,
    num_volunteers INTEGER NOT NULL,
    num_volunteers_needed INTEGER NOT NULL
);

trigger relates this table to volunteers, triggering deleting of all volunteers associated with the opportunity deleted
'''