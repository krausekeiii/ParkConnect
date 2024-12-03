from unittest.mock import patch

# Test for `/stats/<string:user>` endpoint
@patch('app.services.user_service.get_hours_vold')
@patch('app.services.user_service.get_opps_vold')
@patch('app.services.user_service.get_top_parks')
def test_get_user_stats_success(mock_get_hours, mock_get_opps, mock_get_top_parks, client):
    mock_get_hours.return_value = 10
    mock_get_opps.return_value = [{'name': 'Cleanup', 'park': 'Yellowstone', 'date': '2024-12-03', 'hours_req': 5}]
    mock_get_top_parks.return_value = [('Yellowstone', 15)]

    response = client.get('/stats/test_user@example.com')
    assert response.status_code == 200
    assert response.json == {
        'hours': 10,
        'opps': [{'name': 'Cleanup', 'park': 'Yellowstone', 'date': '2024-12-03', 'hours_req': 5}],
        'topParks': [{'parkName': 'Yellowstone', 'hours': 15}]
    }

def test_get_user_stats_missing_user(client):
    response = client.get('/stats/')
    assert response.status_code == 404  # Flask interprets this as a route mismatch

# Test for `/list` endpoint
@patch('app.db.session.query')
def test_list_users(mock_query, client):
    mock_query.return_value.all.return_value = [
        {'id': 1, 'name': 'John Doe', 'email': 'john@example.com', 'role': 'user'},
        {'id': 2, 'name': 'Jane Smith', 'email': 'jane@example.com', 'role': 'admin'}
    ]
    response = client.get('/list')
    assert response.status_code == 200
    assert response.json == [
        {'id': 1, 'name': 'John Doe', 'email': 'john@example.com', 'role': 'user'},
        {'id': 2, 'name': 'Jane Smith', 'email': 'jane@example.com', 'role': 'admin'}
    ]

# Test for `/<int:user_id>` PUT endpoint
@patch('app.db.session.query')
def test_edit_user_success(mock_query, client):
    mock_user = mock_query.return_value.filter_by.return_value.first.return_value
    mock_user.name = "Old Name"
    mock_user.email = "old@example.com"
    mock_user.role = "user"

    response = client.put('/1', json={
        'name': 'New Name',
        'email': 'new@example.com',
        'role': 'admin'
    })
    assert response.status_code == 200
    assert response.json == {'message': 'User with ID 1 updated successfully'}

def test_edit_user_not_found(client):
    response = client.put('/999', json={
        'name': 'Name',
        'email': 'email@example.com',
        'role': 'admin'
    })
    assert response.status_code == 404
    assert response.json == {'error': 'User not found'}

# Test for `/<int:user_id>` DELETE endpoint
@patch('app.db.session.query')
def test_delete_user_success(mock_query, client):
    mock_user = mock_query.return_value.filter_by.return_value.first.return_value
    response = client.delete('/1')
    assert response.status_code == 200
    assert response.json == {'message': 'User with ID 1 deleted successfully'}

def test_delete_user_not_found(client):
    response = client.delete('/999')
    assert response.status_code == 404
    assert response.json == {'error': 'User not found'}

# Test for `/opps` endpoint
@patch('app.services.user_service.get_opps_vold')
def test_get_opps_success(mock_get_opps, client):
    mock_get_opps.return_value = [{'name': 'Event 1', 'park': 'Park 1', 'date': '2024-12-03', 'hours_req': 5}]
    response = client.get('/opps?email=test_user@example.com')
    assert response.status_code == 200
    assert response.json == [{'name': 'Event 1', 'park': 'Park 1', 'date': '2024-12-03', 'hours_req': 5}]

def test_get_opps_missing_email(client):
    response = client.get('/opps')
    assert response.status_code == 400
    assert response.json == {'error': 'Please provide a user email'}

# Test for `/adminpark` endpoint
@patch('app.services.user_service.get_admin_park')
def test_get_admin_park_success(mock_get_admin_park, client):
    mock_get_admin_park.return_value = {'park_id': 1}
    response = client.get('/adminpark?email=test_admin@example.com')
    assert response.status_code == 200
    assert response.json == {'park_id': 1}

def test_get_admin_park_missing_email(client):
    response = client.get('/adminpark')
    assert response.status_code == 400
    assert response.json == {'error': 'Please provide a user email'}
