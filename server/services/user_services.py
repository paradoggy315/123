from ..db import execute_procedure


def get_all_users():
    """
    Retrieves all users from the database.
    """
    return execute_procedure('GetAllUsers')

def get_user_by_id(user_id):
    """
    Retrieves a single user by their ID.
    """
    return execute_procedure('GetUserByID', (user_id,))

def update_user_address(user_id, address, country, state, zip_code, region):
    """
    Updates the address of a user.
    """
    execute_procedure('UpdateUserAddress', (user_id, address, country, state, zip_code, region))
