from flask import Blueprint, request, jsonify
from firebase_config import db

errands_bp = Blueprint('errands', __name__, url_prefix='/errands')

@errands_bp.route('/add', methods=['POST'])
def add_errand():
    data = request.get_json()
    errand_ref = db.collection('errands').add(data)
    return jsonify({'success': True, 'id': errand_ref[1].id})
