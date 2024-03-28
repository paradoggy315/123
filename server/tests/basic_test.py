import pytest
from unittest.mock import patch, MagicMock
from server.db import execute_procedure

# Fixture for mocking pymysql connection
@pytest.fixture
def mock_db_connection(mocker):
    connection = MagicMock()
    cursor = MagicMock()
    connection.cursor.return_value.__enter__.return_value = cursor
    cursor.fetchall.return_value = [{"UserID": 1, "Username": "testuser"}]
    mocker.patch('server.db.get_db_connection', return_value=connection)
    return connection

def test_execute_procedure(mock_db_connection):
    # The test calls the execute_procedure function which should use the mocked connection.
    results = execute_procedure('GetUserByID', [1])
    
    assert results == [{"UserID": 1, "Username": "testuser"}]
    # Assert that the procedure was called with the correct name and parameters.
    mock_db_connection.cursor.return_value.__enter__.return_value.callproc.assert_called_once_with('GetUserByID', [1])
    # Assert that the connection commit was called.
    mock_db_connection.commit.assert_called_once()
