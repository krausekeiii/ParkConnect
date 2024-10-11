import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    """Base configuration."""
    SECRET_KEY = os.getenv('SECRET_KEY')
    SQLALCHEMY_BINDS={
            'user_db': os.getenv('USER_DATABASE_URL')  # User database
    }
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # Add other common configurations
