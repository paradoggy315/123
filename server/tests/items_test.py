import pytest
from server.app import app as flask_app
from unittest.mock import patch, MagicMock
from server.services import items_service

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

mock_items = [{'ItemID': 1, 'ItemName': 'Test Item', 'ItemDescription': 'Test Description', 'ItemCategory': 'Test Category', 'ItemQuantity': 10},
              {'ItemID': 2, 'ItemName': 'Test Item 2', 'ItemDescription': 'Test Description 2', 'ItemCategory': 'Test Category 2', 'ItemQuantity': 20}]

mock_item = mock_items[0]


def test_get_all_items(mocker):
        
    mocker.patch('server.services.items_service.execute_procedure', return_value=mock_items)

    result = items_service.get_all_items()

    assert result == mock_items
        
def test_get_item_by_id(mocker):
            
    mocker.patch('server.services.items_service.execute_procedure', return_value=mock_item)
    
    result = items_service.get_item_by_id(1)
    
    assert result == mock_item
    
def add_new_item(mocker):
    
    mocker.patch('server.services.items_service.execute_procedure', return_value=None)
    
    items_service.add_new_item('Test Item 3', 'Test Category 3', 'Test Description 3', 30, 1, 'Test Location 3')
    
    items_service.execute_procedure.assert_called_once_with('AddItem', ('Test Item 3', 'Test Category 3', 'Test Description 3', 30, 1, 'Test Location 3'))   
    
def update_item(mocker):
    
    mocker.patch('server.services.items_service.execute_procedure', return_value=mock_item)
    
    items_service.update_item_details(1, 'Test Item 4', 'Test Category 4', 'Test Description 4', 40, 1, 'Test Location 4')
    
    items_service.execute_procedure.assert_called_once_with('UpdateItem', (1, 'Test Item 4', 'Test Category 4', 'Test Description 4', 40, 1, 'Test Location 4'))
    
def delete_item(mocker):
    
    mocker.patch('server.services.items_service.execute_procedure', return_value=None)
    
    items_service.delete_item_by_id(1)
    
    items_service.execute_procedure.assert_called_once_with('DeleteItem', (1,))
    
    
# Test Item Routes
def test_get_all_items_route(client, mocker):
    
    mocker.patch('server.services.items_service.execute_procedure', return_value=mock_items)
    
    response = client.get('/items')
    
    assert response.status_code == 200
    assert response.json == mock_items   
    
def test_get_item_by_id_route(client, mocker):
    
    mocker.patch('server.services.items_service.execute_procedure', return_value=mock_item)
    
    response = client.get('/item/1')
    
    assert response.status_code == 200
    assert response.json == mock_item 
    
def test_add_item_route(client, mocker):
    
    mocker.patch('server.services.items_service.execute_procedure', return_value="Worked")
    
    response = client.post('/item', json={
        'name': 'Test Item 3',
        'category': 'Test Category 3',
        'description': 'Test Description 3',
        'quantity': 30,
        'donorId': 1,
        'location': 'Test Location 3'
    })
    
    assert response.status_code == 200
    assert response.json is not None        
    
def test_update_item_route(client, mocker):
    
    mocker.patch('server.services.items_service.execute_procedure', return_value="Worked")
    
    response = client.put('/item/1', json={
        'name': 'Test Item 4',
        'category': 'Test Category 4',
        'description': 'Test Description 4',
        'quantity': 40,
        'donorId': 1,
        'location': 'Test Location 4'
    })
    
    assert response.status_code == 200
    assert response.json is not None    
    
    
def test_delete_item_route(client, mocker):
    
    mocker.patch('server.services.items_service.execute_procedure', return_value="Worked")
    
    response = client.delete('/item/1')
    
    assert response.status_code == 200
    assert response.json is not None
    
   