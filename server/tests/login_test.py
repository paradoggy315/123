import pytest
from flask import json
from server.app import app  # Adjust the import path as necessary
from unittest.mock import patch
from server.db import get_db_connection, execute_procedure
from server.services.register_service import add_user
import bcrypt
from itsdangerous import URLSafeTimedSerializer as Serializer
import server.services.user_services as user_services
import server.services.login_services as login_services



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
    
        
    