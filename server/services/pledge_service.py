from ..db import execute_procedure

def get_all_pledges():
    return execute_procedure('GetAllPledges')

def get_pledge_by_id(pledge_id):
    return execute_procedure('GetPledge', (pledge_id,))

def add_new_pledge(user_id, item_id, quantity_pledged, status):
    return execute_procedure('AddPledge', (user_id, item_id, quantity_pledged, status))

def update_pledge_details(pledge_id, user_id, item_id, quantity_pledged, status):
    return execute_procedure('UpdatePledge', (pledge_id, user_id, item_id, quantity_pledged, status))

def delete_pledge_by_id(pledge_id):
    return execute_procedure('DeletePledge', (pledge_id,))

def get_user_pledges(user_id):
    return execute_procedure('GetUserPledges', (user_id,))
