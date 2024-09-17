from app.models.user import User
from app import db

def register_user(userName, email, password):
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return {'error': 'User with that email already exists'}

    new_user = User(username=userName, email=email, password=password)
    db.session.add(new_user)
    db.session.commit()
    return new_user

def login_user(userName, password):
    user = User.query.filter_by(userName=userName).first()
    if not user or user.password != password:
        return {'error': 'Invalid username or password'}
    return user