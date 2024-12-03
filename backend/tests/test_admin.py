from unittest.mock import patch

@patch('app.services.admin_service.add_admin')
def test_add_admin_success(mock_add_admin, client):
    mock_add_admin.return_value = {'email': 'new_admin@example.com', 'parkID': 1}
    response = client.post('/admin/add', json={
        'newAdmin': 'new_admin@example.com',
        'admin': 'current_admin@example.com',
        'parkID': 1
    })
    assert response.status_code == 200
    assert response.json == {'email': 'new_admin@example.com', 'parkID': 1}

def test_add_admin_missing_fields(client):
    response = client.post('/admin/add', json={
        'newAdmin': 'new_admin@example.com'
    })
    assert response.status_code == 400
    assert 'error' in response.json

@patch('app.services.admin_service.remove_admin')
def test_remove_admin_success(mock_remove_admin, client):
    mock_remove_admin.return_value = {'email': 'old_admin@example.com', 'parkID': 1}
    response = client.post('/admin/remove', json={
        'oldAdmin': 'old_admin@example.com',
        'admin': 'current_admin@example.com',
        'parkID': 1
    })
    assert response.status_code == 200
    assert response.json == {'email': 'old_admin@example.com', 'parkID': 1}

def test_remove_admin_missing_fields(client):
    response = client.post('/admin/remove', json={})
    assert response.status_code == 400
    assert 'error' in response.json

@patch('app.services.admin_service.top_3_user_stats')
@patch('app.services.admin_service.get_total_hours_by_month')
def test_get_stats_success(mock_get_hours, mock_get_users, client):
    mock_get_users.return_value = [{'name': 'User A', 'email': 'a@example.com', 'total_hours': 120}]
    mock_get_hours.return_value = {'hours': [{'month': 10, 'hours': 300}]}
    response = client.get('/admin/stats/1')
    assert response.status_code == 200
    assert 'top3Users' in response.json
    assert 'totalHours' in response.json

def test_get_stats_invalid_parkID(client):
    response = client.get('/admin/stats/')
    assert response.status_code == 404

@patch('app.services.admin_service.notify_users')
def test_notify_users_success(mock_notify_users, client):
    mock_notify_users.return_value = {'message': 'Email sent to users@example.com'}
    response = client.post('/admin/notify', json={
        'parkID': 1,
        'subject': 'Test Subject',
        'message': 'Test Message',
        'to': 'users@example.com'
    })
    assert response.status_code == 200
    assert response.json == {'message': 'Email sent to users@example.com'}

def test_notify_users_missing_fields(client):
    response = client.post('/admin/notify', json={
        'parkID': 1,
        'subject': 'Test Subject'
    })
    assert response.status_code == 400
    assert 'error' in response.json

@patch('app.services.admin_service.get_opps')
def test_get_opps_success(mock_get_opps, client):
    mock_get_opps.return_value = [{'opportunity_id': 1, 'name': 'Clean-Up Day'}]
    response = client.get('/admin/opps/1')
    assert response.status_code == 200
    assert response.json == [{'opportunity_id': 1, 'name': 'Clean-Up Day'}]

def test_get_opps_invalid_parkID(client):
    response = client.get('/admin/opps/')
    assert response.status_code == 404
