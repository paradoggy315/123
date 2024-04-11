import pytest
from server.services import register_service  # Adjust import path as needed

# Mock data for testing
mock_users = [
    {'UserID': 1, 'Username': 'user1', 'Email': 'user1@example.com', 'Role': 'Admin'},
    {'UserID': 2, 'Username': 'user2', 'Email': 'user2@example.com', 'Role': 'User'}
]

@pytest.mark.parametrize("mock_return,expected_result", [
    (mock_users, mock_users),
    ([], [])
])


def test_get_all_users(mocker, mock_return, expected_result):
    mocker.patch('server.services.register_service.execute_procedure', return_value=mock_return)
    result = register_service.get_all_users()
    assert result == expected_result
    
def test_delete_user(mocker):
    mocker.patch('server.services.register_service.execute_procedure', return_value=None)
    register_service.delete_user(1)
    register_service.execute_procedure.assert_called_once_with('DeleteUser', (1,))    
    
def test_add_user(mocker):
    mocker.patch('server.services.register_service.execute_procedure', return_value=None)
    register_service.add_user('newuser', 'newuser@example.com', 'password', 'User')
    register_service.execute_procedure.assert_called_once_with('AddUser', ('newuser', 'newuser@example.com', 'password', 'User')) 
    
@pytest.mark.parametrize("username,mock_return,expected_result", [
    ('existinguser', [{'UserID': 1}], True),
    ('newuser', [], False)
])

def test_username_exists(mocker, username, mock_return, expected_result):
    mocker.patch('server.services.register_service.execute_procedure', return_value=mock_return)
    result = register_service.username_exists(username)
    assert result == expected_result       
    
@pytest.mark.parametrize("email,mock_return,expected_result", [
    ('existing@example.com', [{'UserID': 1}], True),
    ('new@example.com', [], False)
])
def test_email_exists(mocker, email, mock_return, expected_result):
    mocker.patch('server.services.register_service.execute_procedure', return_value=mock_return)
    result = register_service.email_exists(email)
    assert result == expected_result 
    
    
    
# Testing Register Routes
from server.app import app as flask_app
from unittest.mock import patch, MagicMock
from server.db import get_db_connection, execute_procedure


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


def test_handle_get_all_users(client, mocker):
    mock_users = [
        {'UserID': 1, 'Username': 'user1', 'Email': 'testemail@gmail.com', 'Role': 'Admin'},
        {'UserID': 2, 'Username': 'user2', 'Email': 'testemail2@gmail.com', 'Role': 'User'}
    ]
    
    mocker.patch('server.routes.register_routes.get_all_users', return_value=mock_users)
    
    response = client.get('/register')
    
    assert response.status_code == 200
    assert response.json == mock_users
    
    
def test_exception_in_handle_get_all_users(client, mocker):
    mocker.patch('server.routes.register_routes.get_all_users', side_effect=Exception('Test Exception'))
    
    response = client.get('/register')
    
    assert response.status_code == 500
    assert response.json == {"error": "Test Exception"}    
    
    
def test_handle_add_user(client, mocker):
    user_data = {
        'username': 'newuser',
        'email': 'testgmail23@gmail.com',
        'password': 'password',
        'role': 'User'
    }
    
    #mocker.patch('server.routes.register_routes.request.json', return_value=user_data)  
    mocker.patch('server.routes.register_routes.username_exists', return_value=False)
    mocker.patch('server.routes.register_routes.email_exists', return_value=False)
    mocker.patch('server.routes.register_routes.encrypt_password', return_value='encryptedpassword')
    mocker.patch('server.routes.register_routes.add_user')
    
    response = client.post('/register', json=user_data)
    
    assert response.status_code == 200
    assert response.json == {"message": "User added successfully"}  
                           
                           
def test_handle_add_user_username_exists(client, mocker):
    user_data = {
        'username': 'newuser',
        'email': 'testgmail23@gmail.com',
        'password': 'password',
        'role': 'User'
    }
    
    #mocker.patch('server.routes.register_routes.request.json', return_value=user_data)  
    mocker.patch('server.routes.register_routes.username_exists', return_value=True)
    mocker.patch('server.routes.register_routes.email_exists', return_value=False)
    mocker.patch('server.routes.register_routes.encrypt_password', return_value='encryptedpassword')
    mocker.patch('server.routes.register_routes.add_user')
    
    response = client.post('/register', json=user_data)
    
    assert response.status_code == 400
    assert response.json == {"error": "Username already exists"}                             

def test_handle_add_user_email_exists(client, mocker):
    user_data = {
        'username': 'newuser',
        'email': 'testgmail23@gmail.com',
        'password': 'password',
        'role': 'User'
    }
    
    #mocker.patch('server.routes.register_routes.request.json', return_value=user_data)  
    mocker.patch('server.routes.register_routes.username_exists', return_value=False)
    mocker.patch('server.routes.register_routes.email_exists', return_value=True)
    mocker.patch('server.routes.register_routes.encrypt_password', return_value='encryptedpassword')
    mocker.patch('server.routes.register_routes.add_user')
    
    response = client.post('/register', json=user_data)
    
    assert response.status_code == 400
    assert response.json == {"error": "Email already registered"}      
    
def test_exception_in_handle_add_user(client, mocker):
    user_data = {
        'username': 'newuser',
        'email': 'test', 
        'password': 'password',
        'role': 'User'
    }
    
    #mocker.patch('server.routes.register_routes.request.json', return_value=user_data)
    mocker.patch('server.routes.register_routes.username_exists', return_value=False)
    mocker.patch('server.routes.register_routes.email_exists', return_value=False)
    mocker.patch('server.routes.register_routes.encrypt_password', return_value='encryptedpassword')
    mocker.patch('server.routes.register_routes.add_user', side_effect=Exception('Test Exception'))
    
    response = client.post('/register', json=user_data)
    
    assert response.status_code == 500
    assert response.json == {"error": "Test Exception"}    