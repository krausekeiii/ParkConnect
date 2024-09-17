# This file creates a Flask instance and sets up the configuration that will be used by the application. 
# It also creates the instance folder where the SQLite database file will be stored. This will be temporary once we establish an AWS RDS instance.

import os
from flask import Flask
from dotenv import load_dotenv
from app.models.db import db

load_dotenv()

def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev',   # used by Flask and extensions to keep data safe. It’s set to 'dev' to provide a convenient value during development, but it should be overridden with a random value when deploying
        SQLALCHEMY_BINDS={
            'users_db': os.getenv('USER_DATABASE_URL')  # User database
        }
    )

    if test_config is None:
        app.config.from_pyfile('config.py', silent=True)    #overrides the default configuration with values taken from the config.py file in the instance folder if it exists. For example, when deploying, this can be used to set a real SECRET_KEY
    else:
        app.config.from_mapping(test_config)

    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass
    
    db.init_app(app)
    
    '''# a simple page that says hello
    @app.route('/hello')
    def hello():
        return 'Hello, World!'
    '''
    
    from app.api.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix='/auth')

    return app

from flask import Blueprint

api_bp = Blueprint('api', __name__)

from app.api import routes  # Import routes to register them with the blueprint