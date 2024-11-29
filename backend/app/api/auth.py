from flask import request, jsonify
from app.services import user_service
from app.api import auth_bp

@auth_bp.route('/signup', methods=['POST'])
def signup():
    print("Received payload:", request.json)  # Log the payload for debugging

    # Extract fields from the payload
    userName = request.json.get('userName')
    email = request.json.get('email')
    password = request.json.get('password')
    name = request.json.get('name')
    description = request.json.get('description', '')  # Default to an empty string if not provided

    # Debug log for validation
    print(f"Validating fields: userName={userName}, email={email}, password={password}, name={name}, description={description}")

    # Validation logic
    if not userName or not email or not password or not name:
        missing_fields = []
        if not userName:
            missing_fields.append("username")
        if not email:
            missing_fields.append("email")
        if not password:
            missing_fields.append("password")
        if not name:
            missing_fields.append("name")
        
        print(f"Validation failed. Missing fields: {', '.join(missing_fields)}")
        return jsonify({'error': 'Please provide a username, email, password, and name'}), 400

    # Attempt to register the user
    registration_result = user_service.register_user(userName, email, password, name, description)

    # Handle errors in the result
    if isinstance(registration_result, tuple) and registration_result[1] == 201:
        print("User registered successfully.")
        return registration_result  # Return the tuple (JSON response, HTTP status code)
    elif isinstance(registration_result, dict) and 'error' in registration_result:
        print(f"Error during user registration: {registration_result['error']}")
        return jsonify(registration_result), 400

    print("Unexpected error during user registration.")
    return jsonify({'error': 'Unexpected error occurred during signup'}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    # Extract fields from the payload
    email = request.json.get('email')  # Determine if we want to login with username or email
    password = request.json.get('password')

    # Debug log for validation
    print(f"Validating login fields: email={email}, password={'***' if password else 'None'}")

    if not email or not password:
        missing_fields = []
        if not email:
            missing_fields.append("email")
        if not password:
            missing_fields.append("password")
        
        print(f"Validation failed. Missing fields: {', '.join(missing_fields)}")
        return jsonify({'error': 'Please provide an email and password'}), 400

    # Fetch the user object
    user = user_service.login_user(email, password)

    # Check if the user exists and credentials are valid
    if not user:
        print("Login failed. Invalid email or password.")
        return jsonify({'error': 'Invalid email or password'}), 401

    print(f"User {user.email} logged in successfully.")
    # Return user info
    return jsonify({'name': user.name, 'role': user.role}), 200
