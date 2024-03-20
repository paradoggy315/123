from dotenv import load_dotenv
load_dotenv()  # This loads the environment variables from a .env file

from flask import Flask
from .routes.register_routes import user_blueprint  # Import the Blueprint
from .routes.disaster_event_routes import disaster_event_blueprint  # Import the Blueprint
from .routes.requests_routes import requests_blueprint  # Import the Blueprint
from .routes.login_routes import login_blueprint  # Import the Blueprint
from .routes.items_routes import item_blueprint  # Import the Blueprint
from flask_cors import CORS  # Import CORS

app = Flask(__name__)
CORS(app)

# Register the Blueprint with the app
app.register_blueprint(user_blueprint)
app.register_blueprint(disaster_event_blueprint)
app.register_blueprint(requests_blueprint)
app.register_blueprint(login_blueprint)
app.register_blueprint(item_blueprint)

if __name__ == "__main__":
    app.run(debug=True)