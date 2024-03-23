from ..db import execute_procedure

def get_all_users():
    return execute_procedure('GetAllUsers')

def delete_user(user_id):
    execute_procedure('DeleteUser', (user_id,))

def add_user(user_name, email, password, role):
    execute_procedure('AddUser', (user_name, email, password, role))

def username_exists(username):
    result = execute_procedure('CheckUsernameExists', (username,))
    return len(result) > 0

def email_exists(email):
    result = execute_procedure('CheckEmailExists', (email,))
    return len(result) > 0
