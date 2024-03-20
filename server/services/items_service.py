from ..db import execute_procedure

def get_all_items():
    return execute_procedure('GetAllItems')

def get_item_by_id(item_id):
    return execute_procedure('GetItem', (item_id,))

def add_new_item(name, category, description, quantity, donor_id, location):
    return execute_procedure('AddItem', (name, category, description, quantity, donor_id, location))

def update_item_details(item_id, name, category, description, quantity, donor_id, location):
    try:
        # The procedure expects 7 parameters according to the error message and your provided SQL procedure
        result = execute_procedure('UpdateItem', (item_id, name, category, description, quantity, donor_id, location))
        return {'message': 'Item updated successfully', 'result': result}
    except Exception as e:
        raise e

def delete_item_by_id(item_id):
    try:
        # Attempt to execute the stored procedure
        success = execute_procedure('DeleteItem', (item_id,))
        return {'success': success, 'message': 'Item deleted.' if success else 'Failed to delete item.'}
    except Exception as e:
        # Handle any exceptions that arise
        return {'success': False, 'message': f'An error occurred: {str(e)}'}

