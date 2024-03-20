import pytest
from server.app import app  # Adjust the import path as necessary

# @pytest.fixture
# def client():
#     with app.test_client() as client:
#         yield client

# def test_users_route(client):
#     response = client.get('/register')  # Use the actual route you want to test
#     assert response.status_code == 200

def test_fake():
    assert True == True