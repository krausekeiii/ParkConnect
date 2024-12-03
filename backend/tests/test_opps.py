from unittest.mock import patch

# Create opp
@patch('app.services.opp_service.create_opp')
def test_create_opportunity(mock_create_opp, client):
    mock_create_opp.return_value = {"opportunity_id": 1, "name": "Cleanup Drive"}
    data = {
        "park_id": 1,
        "name": "Cleanup Drive",
        "date": "2024-12-05",
        "time": "10:00:00",
        "description": "Park cleanup",
        "hours_req": 4,
        "num_volunteers_needed": 10
    }

    response = client.post('/opp/create', json=data)
    assert response.status_code == 201
    assert response.json["message"] == "Opportunity created successfully!"
    assert response.json["id"] == 1

# Get all opps
@patch('app.services.opp_service.get_all_opps')
def test_get_all_opportunities(mock_get_all_opps, client):
    mock_get_all_opps.return_value = [
        {
            "id": 1,
            "name": "Cleanup Drive",
            "description": "Park cleanup",
            "date": "2024-12-05",
            "time": "10:00:00",
            "hours_req": 4,
            "volunteers_needed": 10,
            "volunteers_signed_up": 2
        }
    ]

    response = client.get('/opp/opportunities')
    assert response.status_code == 200
    assert len(response.json) == 1
    assert response.json[0]["name"] == "Cleanup Drive"

# Edit opp
@patch('app.services.opp_service.edit_opp')
def test_edit_opportunity(mock_edit_opp, client):
    mock_edit_opp.return_value = {"message": "Opportunity 1 updated successfully"}

    data = {"name": "Updated Cleanup Drive"}
    response = client.put('/opp/edit/1', json=data)
    assert response.status_code == 200
    assert response.json["message"] == "Opportunity 1 updated successfully"

# Get all parks
@patch('app.services.opp_service.get_parks')
def test_get_all_parks(mock_get_parks, client):
    mock_get_parks.return_value = [
        {
            "id": 1,
            "name": "Yellowstone National Park",
            "latitude": 44.6,
            "longitude": -110.5
        }
    ]

    response = client.get('/opp/parks')
    assert response.status_code == 200
    assert len(response.json) == 1
    assert response.json[0]["name"] == "Yellowstone National Park"

# Create park
@patch('app.services.opp_service.create_park')
def test_add_park(mock_create_park, client):
    mock_create_park.return_value = {
        "id": 1,
        "name": "Yellowstone National Park",
        "latitude": 44.6,
        "longitude": -110.5
    }

    data = {
        "name": "Yellowstone National Park",
        "latitude": 44.6,
        "longitude": -110.5
    }

    response = client.post('/opp/parks/add', json=data)
    assert response.status_code == 201
    assert response.json["message"] == "Park added successfully!"
    assert response.json["id"] == 1
