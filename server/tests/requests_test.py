import pytest
from server.app import app as flask_app
from unittest.mock import patch
from server.services import request_service

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

mock_requests = [{'RequestID': 1, 'UserID': 1, 'RequestType': 'Test Request', 'RequestDescription': 'Test Description', 'RequestDate': '2022-01-01'},
                    {'RequestID': 2, 'UserID': 2, 'RequestType': 'Test Request 2', 'RequestDescription': 'Test Description 2', 'RequestDate': '2022-01-02'}]
mock_request = [{'RequestID': 1, 'UserID': 1, 'RequestType': 'Test Request', 'RequestDescription': 'Test Description', 'RequestDate': '2022-01-01'}]    

def test_get_all_requests(mocker):
        
    mocker.patch('server.services.request_service.execute_procedure', return_value=mock_requests)
    
    result = request_service.get_all_requests()
    
    assert result == mock_requests
    
def test_get_request_by_id(mocker):
        
    mocker.patch('server.services.request_service.execute_procedure', return_value=mock_request)
    
    result = request_service.get_request_by_id(1)
    
    assert result == mock_request
    
def test_add_new_request(mocker):
        
    mocker.patch('server.services.request_service.execute_procedure', return_value=None)
    
    request_service.add_request(1, 2, 3, 43, 'Test Description 3', '2022-01-03')
    
    request_service.execute_procedure.assert_called_once_with('AddRequest', (1, 2, 3, 43, 'Test Description 3', '2022-01-03'))   
    
    
def test_update_request(mocker):
        
    mocker.patch('server.services.request_service.execute_procedure', return_value=mock_request)
    
    request_service.update_request(1,2, 'Test Request 4', 'Test Description 4',"Pending", '2022-01-04')
    
    request_service.execute_procedure.assert_called_once_with('UpdateRequest', (1,2, 'Test Request 4', 'Test Description 4',"Pending", '2022-01-04'))
    
def test_delete_request(mocker):
    mocker.patch('server.services.request_service.execute_procedure', return_value=None)
    request_service.delete_request(1)
    request_service.execute_procedure.assert_called_once_with('DeleteRequest', (1,))
    
def test_get_requests_and_events_info(mocker):
    mocker.patch('server.services.request_service.execute_procedure', return_value=mock_requests)
    result = request_service.get_requests_and_events_info()
    assert result == mock_requests

def test_get_all_requests_route(client, mocker):
        
    mocker.patch('server.services.request_service.execute_procedure', return_value=mock_requests)
    
    response = client.get('/requests')
    
    assert response.status_code == 200
    assert response.json == mock_requests

def test_failed_get_all_requests_route(client, mocker):
        
    mocker.patch('server.services.request_service.execute_procedure', sideEffect=Exception('Test Exception'))
    
    response = client.get('/requests')
    
    assert response.status_code == 500
    
def test_get_request_by_id_route(client, mocker):
        
    mocker.patch('server.services.request_service.execute_procedure', return_value=mock_request)
    
    response = client.get('/requests/1')
    
    assert response.status_code == 200
    assert response.json == mock_request

def test_failed_get_request_by_id_route(client, mocker):
        
    mocker.patch('server.services.request_service.execute_procedure', sideEffect=Exception('Test Exception'))
    
    response = client.get('/requests/1')
    
    assert response.status_code == 500
    
    
def no_request_found_by_id(client, mocker):
        
    mocker.patch('server.services.request_service.execute_procedure', return_value=None)
    
    response = client.get('/requests/1')
    
    assert response.status_code == 404
    assert response.json == {'error': 'Request not found'}
    
def test_add_new_request_route(client, mocker):
        
    mocker.patch('server.services.request_service.execute_procedure', return_value=None)
    
    response = client.post('/add-request', json={'event_id': 1, 'user_id': 2, 'item_id': 3, 'quantity_needed': 43, 'status': 'Test Description 3', 'create_date': '2022-01-03'})
    
    assert response.status_code == 201
    assert response.json == {'message': 'Request added successfully'}
                 
    
def test_no_itemID_add_new_request_route(client, mocker):
        
    mocker.patch('server.services.request_service.execute_procedure', return_value=None)
    
    response = client.post('/add-request', json={'event_id': 4, 'user_id': 2, 'quantity_needed': 43, 'status': 'Test Description 3', 'create_date': '2022-01-03'})
    
    assert response.status_code == 400
    assert response.json == {'error': 'Missing item_id'}        
    
def test_update_request_route(client, mocker):
        
    mocker.patch('server.services.request_service.execute_procedure', return_value=mock_request)
    
    response = client.put('/requests/1', json={'event_id': 2, 'user_id': 3, 'item_id': 4, 'quantity_needed': 44, 'status': 'Test Description 4'})
    
    assert response.status_code == 200
    assert response.json == {'message': 'Request updated successfully'}
    
    
def test_delete_request_route(client, mocker):
            
    mocker.patch('server.services.request_service.execute_procedure', return_value=None)
    
    response = client.delete('/requests/1')
    
    assert response.status_code == 200
    assert response.json == {'message': 'Request deleted successfully'} 
    
    
def test_get_requests_and_events_info_route(client, mocker):
        
    mocker.patch('server.services.request_service.execute_procedure', return_value=mock_requests)
    
    response = client.get('/requests/events_info')
    
    assert response.status_code == 200
    assert response.json == mock_requests      
    
                  