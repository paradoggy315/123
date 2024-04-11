import pytest
from server.app import app as flask_app
from unittest.mock import patch, MagicMock
from server.services import disaster_event_service

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

mock_disaster_events = [{'DisasterEventID': 1, 'EventName': 'Test Event', 'Location': 'Test Location', 'Date': '2022-01-01'},
                        {'DisasterEventID': 2, 'EventName': 'Test Event 2', 'Location': 'Test Location 2', 'Date': '2022-01-02'}]
mock_disaster_event = [{'DisasterEventID': 1, 'EventName': 'Test Event', 'Location': 'Test Location', 'Date': '2022-01-01'}]

def test_get_all_disaster_events(mocker):
    
    
    mocker.patch('server.services.disaster_event_service.execute_procedure', return_value=mock_disaster_events)
    
    result = disaster_event_service.get_all_disaster_events()
    
    assert result == mock_disaster_events  
    
def test_get_disaster_event_by_id(mocker):
    
    mocker.patch('server.services.disaster_event_service.execute_procedure', return_value=mock_disaster_event)
    
    result = disaster_event_service.get_disaster_event_by_id(1)
    
    assert result == mock_disaster_event  
    
def test_get_all_disaster_events_route(client, mocker):
    
    mocker.patch('server.services.disaster_event_service.execute_procedure', return_value=mock_disaster_events)
    
    response = client.get('/disaster_events')
    
    assert response.status_code == 200
    assert response.json == mock_disaster_events                
    
def test_get_disaster_event_by_id_route(client, mocker):
    
    mocker.patch('server.services.disaster_event_service.execute_procedure', return_value=mock_disaster_event)
    
    response = client.get('/disaster_event/1')
    
    assert response.status_code == 200
    assert response.json == mock_disaster_event    