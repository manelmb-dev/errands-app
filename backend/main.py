from flask import Flask
from firebase_config import db
from services.users import users_bp
from services.errands import errands_bp
from services.lists import lists_bp

app = Flask(__name__)
app.register_blueprint(users_bp)
app.register_blueprint(errands_bp)
app.register_blueprint(lists_bp)

if __name__ == "__main__":
    app.run(debug=True)
