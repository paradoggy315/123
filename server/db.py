import pymysql
from .config import Config

def get_db_connection():
    return pymysql.connect(host=Config.DB_HOST,
                           user=Config.DB_USER,
                           password=Config.DB_PASSWORD,
                           db=Config.DB_NAME,
                           charset='utf8mb4',
                           cursorclass=pymysql.cursors.DictCursor)

def query_db(query, args=None, one=False):
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute(query, args)
            result = cursor.fetchone() if one else cursor.fetchall()
            return result
    finally:
        connection.close()
        
def execute_procedure(proc_name, args=()):
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            cursor.callproc(proc_name, args)
            # Fetch all the results and return them
            results = cursor.fetchall()
            # Make sure to commit any changes if the procedure modifies the database
            connection.commit()
            return results
    finally:
        connection.close()        
        
        