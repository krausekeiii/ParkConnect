from app import create_app

app = create_app()  # Use DevelopmentConfig or TestingConfig as needed

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)  # Set debug=True for development
