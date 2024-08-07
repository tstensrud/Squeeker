import firebase_admin
import os
from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from firebase_admin import credentials
from dotenv import load_dotenv

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    CORS(app)
    load_dotenv()

    # Firebase authentication
    firebase_credentials = os.getenv("FIREBASE_CREDENTIALS")
    if not firebase_credentials:
        raise ValueError("Firebase credentials not set in env-file")
    
    try:
        if not firebase_admin._apps:
            cred = credentials.Certificate(firebase_credentials)
            firebase_admin.initialize_app(cred)
    except Exception as e:
        print(f"Error initializing firebase: {e}")
        raise
    
    # Configurations
    secret_key = os.getenv("SECRET_KEY")
    if not secret_key:
        raise ValueError("Secret key not found")
    app.config['SECRET_KEY'] = secret_key

    database_uri = os.getenv("DATABASE_URI")
    if not database_uri:
        raise ValueError("Database URI not found")
    app.config['SQLALCHEMY_DATABASE_URI'] = database_uri

    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
    db.init_app(app)

    # Blueprints
    from .api import api
    app.register_blueprint(api, url_prefix="/api")

    with app.app_context():
        from . import models
        db.create_all()
    
    return app