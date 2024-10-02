from flask import Blueprint

# Define the Blueprint for authentication
auth_bp = Blueprint('auth', __name__)

# Import routes to ensure they are registered with the Blueprint
from app.api import routes