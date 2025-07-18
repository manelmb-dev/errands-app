from flask import Blueprint, request, jsonify
from firebase_config import db

lists_bp = Blueprint('lists', __name__, url_prefix='/lists')

@lists_bp.route('/add', methods=['POST'])
def add_list():
    data = request.get_json()
    list_ref = db.collection('lists').add(data)
    return jsonify({'success': True, 'id': list_ref[1].id})
