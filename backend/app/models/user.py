from app import db

# defines the User model

class User(db.Model):
    __bind_key__ = 'user_db'
    __tablename__ = 'users'
    __table_args__ = {'schema': 'users'}
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(20), nullable=False)
    name = db.Column(db.String(80), nullable=False)
    description = db.Column(db.String(200))
    hours = db.Column(db.Float, nullable=False, default=0)
    vol_count = db.Column(db.Integer, nullable=False, default=0)
    role = db.Column(db.String(20), nullable=False, default='user')

    # may add more as needed

    #used for debugging label to decrease ambiguity
    def __repr__(self):
        return '<User %r>' % self.userName    
