from app import db

class Admin(db.Model):
    __bind_key__ = 'user_db'
    __tablename__ = 'admin'
    __table_args__ = {'schema': 'admin'}
    email = db.Column(db.String(120), nullable=False, primary_key=True)
    park_id = db.Column(db.Integer, nullable=False, primary_key=True)

    #used for debugging label to decrease ambiguity
    def __repr__(self):
        return '<Admin %r>' % self.userName