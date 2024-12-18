from flask import Blueprint

# Define the Blueprint for authentication
auth_bp = Blueprint('auth', __name__)
vol_bp = Blueprint('vol', __name__)
opp_bp = Blueprint('opp', __name__)
user_bp = Blueprint('user', __name__)
admin_bp = Blueprint('admin', __name__)

# Import routes to ensure they are registered with the Blueprint
#from app.api import auth, vol, opp