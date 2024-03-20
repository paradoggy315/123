# from ..db import execute_procedure

# def get_all_users():
#     return execute_procedure('GetAllUsers')

# def get_user_by_username(username):
#     return execute_procedure("GetLoginByID", (user_id,))

# def get_user_password(user_password):
#     return execute_procedure("GetPassword)", (user_password))

from ..db import execute_procedure

def get_user_by_username(username):
    results = execute_procedure('GetUserByUsername', (username,))
    if results:
        return results[0]  # Assuming the procedure returns a list of users
    return None