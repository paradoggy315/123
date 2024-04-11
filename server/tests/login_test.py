import pytest
from flask import json
from server.app import app as flask_app  # Adjust the import path as necessary
from unittest.mock import patch, MagicMock
from server.db import get_db_connection, execute_procedure
from server.services.register_service import add_user
import bcrypt
from itsdangerous import URLSafeTimedSerializer as Serializer
import server.services.user_services as user_services
import server.services.login_services as login_services
import os


@pytest.fixture
def app():
    # Now flask_app is the imported Flask app instance
    flask_app.config.update({
        "TESTING": True,
        # Any other configuration that's specifically for testing
    })
    # Provide the app context for the duration of the test
    with flask_app.app_context():
        yield flask_app
    
@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def mock_env_vars(mocker):
    mocker.patch.dict(os.environ, {"TOKEN_SECRET": "secret_key"})
    
# Example test for get_user_by_username using mocking
def test_get_user_by_username(mocker):
    # Mock data to be returned by the mock of execute_procedure
    mock_user_data = [{'UserID': 1, 'Username': 'testuser', 'PasswordHash': 'hashedpassword', 'Role': 'Admin'}]
    
    mock_execute_proc = mocker.patch('server.services.login_services.execute_procedure', return_value=mock_user_data)


    # Call the function under test
    user = login_services.get_user_by_username('testuser')
    
    print("Mock ID in test:", id(mock_execute_proc))

    # Assertions to validate the behavior of get_user_by_username
    assert user is not None, "Expected a user object, got None"

    # Now, assert the mock was called
    mock_execute_proc.assert_called_once_with('GetUserByUsername', ('testuser',))
    
# test for invalid username in get_user_by_username
def test_get_user_by_username_invalid(mocker):
    # Mock data to be returned by the mock of execute_procedure
    mock_user_data = []
    
    mock_execute_proc = mocker.patch('server.services.login_services.execute_procedure', return_value=mock_user_data)

    # Call the function under test
    user = login_services.get_user_by_username('testuser')
    
    # Assertions to validate the behavior of get_user_by_username
    assert user is None, "Expected None, got a user object"

    # Now, assert the mock was called
    mock_execute_proc.assert_called_once_with('GetUserByUsername', ('testuser',))
    
# Testing Login Routes With Mocking 
def test_login_success(client, mocker, mock_env_vars):
    mock_user = {
        'UserID': 1,
        'Username': 'testuser',
        'PasswordHash': bcrypt.hashpw(b"testpassword", bcrypt.gensalt()),
        'Role': 'TestRole'
    }

    # Mock `get_user_by_username` to return the mock_user
    mocker.patch('server.routes.login_routes.get_user_by_username', return_value=mock_user)
    
    # Mock `bcrypt.checkpw` to return True
    mocker.patch('bcrypt.checkpw', return_value=True)
    
    

    # Perform a POST request to the login endpoint
    response = client.post('/login', json={
        'username': 'testuser',
        'password': 'testpassword'
    })

    # Deserialize the response data
    data = response.get_json()

    # Assertions
    assert response.status_code == 200
    assert data['username'] == 'testuser'
    assert 'token' in data
    
    

    
    
        
    