# auth.py
from flask import Blueprint, request, jsonify
from firebase_admin import auth as firebase_auth
from your_project.database import get_user_by_phone, create_user, unlink_phone  # funciones que defines tú

auth_bp = Blueprint('auth', __name__)

@auth_bp.route("/check-phone", methods=["POST"])
def check_phone():
    phone = request.json.get("phone")
    user = db.users.find_one({"phone": phone})
    return jsonify({"exists": bool(user)})


@auth_bp.route("/check-phone-exists", methods=["POST"])
def check_phone_exists():
    data = request.get_json()
    phone = data.get("phone")

    if not phone:
        return jsonify(success=False, message="Missing phone"), 400

    user = get_user_by_phone(phone)
    if user:
        return jsonify(success=True, exists=True, email=user.get("email"))
    else:
        return jsonify(success=True, exists=False)


@auth_bp.route("/create-account", methods=["POST"])
def create_account():
    data = request.get_json()
    phone = data.get("phone")
    email = data.get("email")
    password = data.get("password")
    name = data.get("name")

    if not all([phone, email, password, name]):
        return jsonify(success=False, message="Missing data"), 400

    try:
        user = create_user(email=email, phone=phone, password=password, name=name)
        return jsonify(success=True, user_id=user.get("id"))
    except Exception as e:
        return jsonify(success=False, message=str(e)), 500


@auth_bp.route("/unlink-phone", methods=["POST"])
def unlink_old_phone():
    data = request.get_json()
    phone = data.get("phone")

    if not phone:
        return jsonify(success=False, message="Missing phone"), 400

    try:
        unlink_phone(phone)  # desvincula el teléfono del antiguo usuario
        return jsonify(success=True)
    except Exception as e:
        return jsonify(success=False, message=str(e)), 500
