from flask import Blueprint, request, jsonify
from firebase_config import db

users_bp = Blueprint('users', __name__, url_prefix='/users')

@users_bp.route('/register', methods=['POST'])
def register_user():
    data = request.get_json()
    phone = data.get('phone')
    password = data.get('password')

    if not phone or not password:
        return jsonify({'error': 'Faltan datos'}), 400

    user_ref = db.collection('users').document(phone)
    user_ref.set({
        'phone': phone,
        'password': password,
    })

    return jsonify({'success': True, 'phone': phone})
