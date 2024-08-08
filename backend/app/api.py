from flask import  Blueprint, request, jsonify
from firebase_admin import auth
from functools import wraps
from markupsafe import escape
from . import db_ops as db

api = Blueprint("api", __name__)

def firebase_auth_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        id_token = request.headers.get('Authorization')
        #print(f"ID_TOKEN: {id_token}")
        if id_token is None:
            return jsonify({"error": "Unauthorized"}), 401
        token = id_token.split(" ")[1]
        try:
            #print("Verifying token")
            decoded_token = auth.verify_id_token(token)
            #print(f"decoded token: {decoded_token}")
            request.user = decoded_token
        except Exception as e:
            #print("Failed to verify token")
            return jsonify({"error": str(e)}), 401
        return f(*args, **kwargs)
    return decorated_function

@api.route('/register/', methods=['POST'])
def register():
    data = request.get_json()
    #print(data)
    if data:
        escaped_data = {}
        for key, value in data.items():
            escaped_data[key] = escape(value.strip())
        if db.register_new_user(escaped_data):
            return jsonify({"success": True, "message": "User created"})
        else:
            return jsonify({"success": False, "message": "Could not create user"})
    else:
        return jsonify({"success": False, "message": "No data received"})

@api.route('/subpage/create/', methods=['POST'])
@firebase_auth_required
def create_subpage():
    data = request.get_json()
    if data:
        escaped_data = {}
        for key, value in data.items():
            if key == "name" or key == "description":
                escaped_data[key] = escape(value.strip())
            else:
                escaped_data[key] = escape(value)
        print (escaped_data)
        return jsonify({"success": True, "message": "Subpage created"})
    else:
        return jsonify({"success": False, "message": "No data received"})

@api.route('/test/', methods=['GET'])
@firebase_auth_required
def test():
    user = request.user
    return jsonify({"message": f"Authorized {user['uid']}"}), 200

