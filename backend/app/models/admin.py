from app import db

class Admin(db.Model):
    __bind_key__ = 'user_db'
    __tablename__ = 'admins'
    __table_args__ = {'schema': 'admins'}
    email = db.Column(db.String(120), nullable=False, primary_key=True)
    parkID = db.Column(db.Integer, nullable=False, primary_key=True)

    #used for debugging label to decrease ambiguity
    def __repr__(self):
        return '<Admin %r>' % self.userName