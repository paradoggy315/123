import os

class Config:
    # Database configuration
    DB_HOST = 'localhost'
    DB_USER = 'root'
    DB_PASSWORD = os.getenv("DATABASE_PASSWORD")
    DB_NAME = 'dams'
    DB_CHARSET = 'utf8mb4'
    # Test database configuration
    TEST_DB_HOST = 'localhost'
    TEST_DB_USER = 'root'
    TEST_DB_PASSWORD = os.getenv("DATABASE_PASSWORD")
    TEST_DB_NAME = 'testdatabase'
    TEST_DB_CHARSET = 'utf8mb4'