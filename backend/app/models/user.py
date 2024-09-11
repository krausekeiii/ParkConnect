from app.api import db

# defines the User model

class User(db.Model):
    __bind_key__ = 'users_db'
    __tablename__ = 'users'
    email = db.Column(db.String(120), unique=True, nullable=False, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(20), nullable=False)
    # may add more as needed

    #used for debugging label to decrease ambiguity
    def __repr__(self):
        return '<User %r>' % self.userName    
