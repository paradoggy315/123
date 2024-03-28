import pymysql
import os
from .config import Config

def get_db_connection():
    if os.getenv('FLASK_ENV') == 'testing':
        host = Config.TEST_DB_HOST
        user = Config.TEST_DB_USER
        password = Config.TEST_DB_PASSWORD
        db = Config.TEST_DB_NAME
    else:
        host = Config.DB_HOST
        user = Config.DB_USER
        password = Config.DB_PASSWORD
        db = Config.DB_NAME

    return pymysql.connect(host=host,
                           user=user,
                           password=password,
                           db=db,
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
            results = cursor.fetchall()
            connection.commit()
            return results
    finally:
        connection.close()

        