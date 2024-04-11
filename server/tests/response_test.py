import pytest
from server.app import app as flask_app
from unittest.mock import patch
from server.services import response_service


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

mock_responses = [{'ResponseID': 1, 'RequestID': 1, 'UserID': 1, 'ResponseDescription': 'Test Description', 'ResponseDate': '2022-01-01'},
                    {'ResponseID': 2, 'RequestID': 2, 'UserID': 2, 'ResponseDescription': 'Test Description 2', 'ResponseDate': '2022-01-02'}]

mock_response = [{'ResponseID': 1, 'RequestID': 1, 'UserID': 1, 'ResponseDescription': 'Test Description', 'ResponseDate': '2022-01-01'}]

def test_get_all_responses(mocker):
            
    mocker.patch('server.services.response_service.execute_procedure', return_value=mock_responses)
    
    result = response_service.get_all_responses_service()
    
    assert result == mock_responses
    
def test_get_response_by_id(mocker):
        
    mocker.patch('server.services.response_service.execute_procedure', return_value=mock_response)
    
    result = response_service.get_response_by_id_service(1)
    
    assert result == mock_response
    
def test_add_new_response(mocker):
        
    mocker.patch('server.services.response_service.execute_procedure', return_value=None)
    
    response_service.add_response_service(1, 2, 'Test Description 3', '2022-01-03')
    
    response_service.execute_procedure.assert_called_once_with('CreateResponseAndUpdateRequest', (1, 2, 'Test Description 3', '2022-01-03'))
    
def test_update_response(mocker):
        
    mocker.patch('server.services.response_service.execute_procedure', return_value=mock_response)
    
    response_service.update_response_service(1, 2, 'Test Description 4', 'Pending',1)
    
    response_service.execute_procedure.assert_called_once_with('UpdateResponse', (1, 2, 'Test Description 4', 'Pending',1))
    
def test_delete_response(mocker):
    mocker.patch('server.services.response_service.execute_procedure', return_value=None)
    response_service.delete_response_service(1)
    response_service.execute_procedure.assert_called_once_with('DeleteResponse', (1,))  
    
    
def test_get_responses_by_request_id(mocker):
    
    mocker.patch('server.services.response_service.execute_procedure', return_value=mock_responses)
    
    result = response_service.get_responses_by_request_id_service(1)
    
    assert result == mock_responses      
    
    
# Test Routes
def test_get_all_responses_route(client, mocker):
        
    mocker.patch('server.services.response_service.execute_procedure', return_value=mock_responses)
    
    response = client.get('/responses')
    
    assert response.status_code == 200
    assert response.json == mock_responses
    
def test_get_response_by_id_route(client, mocker):
            
        mocker.patch('server.services.response_service.execute_procedure', return_value=mock_response)
        
        response = client.get('/responses/1')
        
        assert response.status_code == 200
        assert response.json == mock_response
        
def test_add_new_response_route(client, mocker):
            
    mocker.patch('server.services.response_service.execute_procedure', return_value=1)
    
    response = client.post('/add-response', json={'matched_request_id': 1, 'user_id': 2, 'quantity_provided': 'Test Description 3', 'status': '2022-01-03'})
    
    assert response.status_code == 200
    
    
def test_update_response_route(client, mocker):
                
    mocker.patch('server.services.response_service.execute_procedure', return_value=mock_response)
    
    response = client.put('/responses/1', json={'matched_request_id': 2, 'user_id': 2, 'quantity_provided': 'Test Description 4', 'status': 'Pending', 'response_id': 1})
    
    assert response.status_code == 200  
    
def test_delete_response_route(client, mocker):
                
    mocker.patch('server.services.response_service.execute_procedure', return_value=None)
    
    response = client.delete('/responses/1')
    
    assert response.status_code == 200
    
    
def test_get_responses_by_request_id_route(client, mocker):
        
        mocker.patch('server.services.response_service.execute_procedure', return_value=mock_responses)
        
        response = client.get('/responses/request/1')
        
        assert response.status_code == 200
        assert response.json == mock_responses      