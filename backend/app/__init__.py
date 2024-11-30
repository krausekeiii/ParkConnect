# This file creates a Flask instance and sets up the configuration that will be used by the application. 

import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from config import Config
from flask_cors import CORS

db = SQLAlchemy()

def create_app(config_class=Config):
    app = Flask(__name__)#, instance_relative_config=True)
    app.config.from_object(config_class)
    CORS(app)
    
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass
    
    db.init_app(app)
    
    from app.api.auth import auth_bp
    from app.api.volunteer import vol_bp
    from app.api.opps import opp_bp
    from app.api.admin import admin_bp
    from app.api.users import user_bp
    
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(vol_bp, url_prefix='/vol')
    app.register_blueprint(opp_bp, url_prefix='/opp')
    app.register_blueprint(admin_bp, url_prefix='/admin')
    app.register_blueprint(user_bp, url_prefix='/api/user')

    return app
