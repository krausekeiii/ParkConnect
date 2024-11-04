from app import create_app
from flask_cors import CORS

app = create_app()  # Use DevelopmentConfig or TestingConfig as needed
CORS(app)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)  # Set debug=True for development
