from app import db

class Park(db.Model):
    __bind_key__ = 'users_db'
    __tablename__ = 'parks'
    __table_args__ = {'schema': 'parks'}
    park_ID = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    state = db.Column(db.String(2), nullable=False)
    address = db.Column(db.String(80), nullable=False)
    phone_number = db.Column(db.String(10), nullable=False)
    hours = db.Column(db.String(80), nullable=False)
    url = db.Column(db.String(120))
    # may add more as needed

    #used for debugging label to decrease ambiguity
    def __repr__(self):
        return '<Park %r>' % self.name
    

'''
CREATE TABLE parks.parks (
    park_ID SERIAL PRIMARY KEY,
    name VARCHAR(80) NOT NULL,
    state CHAR(2) NOT NULL,
    address VARCHAR(80) NOT NULL,
    phone_number CHAR(10) NOT NULL,
    email VARCHAR(120) NOT NULL,
    hours VARCHAR(80),
    description VARCHAR(200),
    url VARCHAR(120)
);
'''