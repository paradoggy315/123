from ..db import execute_procedure

def get_user_by_username(username):
    print("Function ID in test:", id(execute_procedure))
    results = execute_procedure('GetUserByUsername', (username,))
    if results:
        return results[0]  # Assuming the procedure returns a list of users
    return None

