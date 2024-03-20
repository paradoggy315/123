import os

class Config:
    # Database configuration
    DB_HOST = 'localhost'
    DB_USER = 'root'
    DB_PASSWORD = os.getenv("DATABASE_PASSWORD")
    DB_NAME = 'dams'
    DB_CHARSET = 'utf8mb4'