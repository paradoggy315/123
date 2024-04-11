import pytest
from server.app import app as flask_app
from unittest.mock import patch
from server.services import pledge_service
from flask import jsonify


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

mock_pledges = [{'PledgeID': 1, 'UserID': 1, 'DisasterEventID': 1, 'Amount': 100},
                {'PledgeID': 2, 'UserID': 2, 'DisasterEventID': 2, 'Amount': 200}]
mock_pledge = [{'PledgeID': 1, 'UserID': 1, 'DisasterEventID': 1, 'Amount': 100}]


def test_get_all_pledges(mocker):
    mocker.patch('server.services.pledge_service.execute_procedure', return_value=mock_pledges)
    
    result = pledge_service.get_all_pledges()
    
    assert result == mock_pledges
    
def test_get_pledge_by_id(mocker):
    mocker.patch('server.services.pledge_service.execute_procedure', return_value=mock_pledge)
    
    result = pledge_service.get_pledge_by_id(1)
    
    assert result == mock_pledge
        
def test_add_new_pledge(mocker):
    mocker.patch('server.services.pledge_service.execute_procedure', return_value=None)
    
    pledge_service.add_new_pledge(1, 1, 100, 'Pending')
    
    pledge_service.execute_procedure.assert_called_once_with('AddPledge', (1, 1, 100, 'Pending'))   
        
def test_update_pledge(mocker):   
    mocker.patch('server.services.pledge_service.execute_procedure', return_value=mock_pledge)
    
    pledge_service.update_pledge_details(1, 1, 1, 100, 'Pending')
    
    pledge_service.execute_procedure.assert_called_once_with('UpdatePledge', (1, 1, 1, 100, 'Pending'))
            
def test_delete_pledge(mocker):
    mocker.patch('server.services.pledge_service.execute_procedure', return_value=None)
    
    pledge_service.delete_pledge_by_id(1)
    
    pledge_service.execute_procedure.assert_called_once_with('DeletePledge', (1,))
    
# Test Routes

def test_get_all_pledges_route(client, mocker):
        
    mocker.patch('server.services.pledge_service.execute_procedure', return_value=mock_pledges)
    
    response = client.get('/pledges')
    
    assert response.status_code == 200
    assert response.json == mock_pledges
    
def test_get_pledge_by_id_route(client, mocker):
        
    mocker.patch('server.services.pledge_service.execute_procedure', return_value=mock_pledge)
    
    response = client.get('/pledge/1')
    
    assert response.status_code == 200
    assert response.json == mock_pledge
    
def test_add_new_pledge_route(client, mocker):
        
    mocker.patch('server.services.pledge_service.execute_procedure', return_value=1)
    
    response = client.post('/pledge', json={
        'UserID': 1,
        'ItemID': 1,
        'QuantityPledged': 100,
        'Status': 'Pending'
    })
    
    assert response.status_code == 200
    assert response.json == {'message': 'Pledge added successfully', 'pledgeID': 1}
    
def test_update_pledge_route(client, mocker):
        
    mocker.patch('server.services.pledge_service.execute_procedure', return_value=mock_pledge)
    
    response = client.put('/pledge/1', json={
        'UserID': 1,
        'ItemID': 1,
        'QuantityPledged': 100,
        'Status': 'Pending'
    })
    
    assert response.status_code == 200
    assert response.json == {'message': 'Pledge updated successfully', 'result': mock_pledge}
    
def test_delete_pledge_route(client, mocker):
        
    mocker.patch('server.services.pledge_service.execute_procedure', return_value=None)
    
    response = client.delete('/pledge/1')
    
    assert response.status_code == 200
    assert response.json == {'message': 'Pledge deleted successfully', 'result': None}
    
def test_get_pledges_by_user_route(client, mocker):
            
    mocker.patch('server.services.pledge_service.execute_procedure', return_value=mock_pledges)
    
    response = client.get('/user/1/pledges')
    
    assert response.status_code == 200
    assert response.json == mock_pledges
    
                
    
    