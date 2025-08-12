from flask import Blueprint, request, jsonify
from firebase_config import db

users_bp = Blueprint('users', __name__, url_prefix='/users')

