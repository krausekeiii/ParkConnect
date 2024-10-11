# This file creates a Flask instance and sets up the configuration that will be used by the application. 
# It also creates the instance folder where the SQLite database file will be stored. This will be temporary once we establish an AWS RDS instance.

import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from config import Config

db = SQLAlchemy()

def create_app(config_class=Config):
    app = Flask(__name__)#, instance_relative_config=True)
    app.config.from_object(config_class)

    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass
    
    db.init_app(app)
    
    from app.api.routes import auth_bp
    app.register_blueprint(auth_bp, url_prefix='/auth')

    return app
