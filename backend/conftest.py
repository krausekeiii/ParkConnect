import pytest
from app import create_app, db
from config import TestConfig

@pytest.fixture
def app():
    app = create_app(TestConfig)
    with app.app_context():
        db.create_all()  # Create the test database schema
    yield app
    with app.app_context():
        db.session.remove()
        db.drop_all()  # Drop the test database

@pytest.fixture
def client():
    return app.test_client()

@pytest.fixture
def runner():
    return app.test_cli_runner()