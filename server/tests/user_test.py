import pytest
from server.app import app as flask_app
from unittest.mock import patch
from server.services import user_services


@pytest.fixture
def app():
    flask_app.config.update({
        "TESTING": True,
    })
    with flask_app.app_context():
        yield flask_app
        
@pytest.fixture
def client(app):
    return app.test_client()


mock_users = [{'UserID': 1, 'Username': 'Test User', 'Password': 'Test Password'},
                {'UserID': 2, 'Username': 'Test User', 'Password': 'Test Password'}]
mock_user = {'UserID': 1, 'Username': 'Test User', 'Password': 'Test Password'}


def test_get_all_users(mocker):
    mocker.patch('server.services.user_services.execute_procedure', return_value=mock_users)
    
    result = user_services.get_all_users()
    
    assert result == mock_users
    
def test_get_user_by_id(mocker):
    mocker.patch('server.services.user_services.execute_procedure', return_value=mock_user)
    
    result = user_services.get_user_by_id(1)
    
    assert result == mock_user
    
def test_update_user(mocker):
    mocker.patch('server.services.user_services.execute_procedure', return_value=mock_user)
    # user_id, address, country, state, zip_code, region
    user_services.update_user_address(1, 'Test User 2 Adress', 'Test Country', 'Test State', 'Test Zip Code', 'Test Region')
    
    user_services.execute_procedure.assert_called_once_with('UpdateUserAddress', (1, 'Test User 2 Adress', 'Test Country', 'Test State', 'Test Zip Code', 'Test Region'))    
    
    
def test_get_all_users_route(client, mocker):
    mocker.patch('server.services.user_services.execute_procedure', return_value=mock_users)
    
    response = client.get('/users')
    
    assert response.status_code == 200
    assert response.json == mock_users
    
    
def test_get_user_by_id_route(client, mocker):
    mocker.patch('server.services.user_services.execute_procedure', return_value=mock_user)
    
    response = client.get('/users/1')
    
    assert response.status_code == 200
    assert response.json == mock_user
    
def test_update_user_address_route(client, mocker):
    mocker.patch('server.services.user_services.execute_procedure', return_value=mock_user)
    
    response = client.post('/users/update-address/1', json={'address': 'Test User 2 Adress', 'country': 'Test Country', 'state': 'Test State', 'zip_code': 'Test Zip Code', 'region': 'Test Region'})
    
    assert response.status_code == 200
    
    
    
    
    
             
             
    
    