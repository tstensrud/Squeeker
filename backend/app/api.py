from flask import  Blueprint, request, jsonify
from firebase_admin import auth
from functools import wraps

api = Blueprint("api", __name__)

def firebase_auth_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        id_token = request.headers.get('Authorization')
        token = id_token.split(" ")[1]
        #print(f"ID_TOKEN: {id_token}")
        if id_token is None:
            return jsonify({"error": "Unauthorized"}), 401
        try:
            print("Verifying token")
            decoded_token = auth.verify_id_token(token)
            print(f"decoded token: {decoded_token}")
            request.user = decoded_token
        except Exception as e:
            print("Failed to verify token")
            return jsonify({"error": str(e)}), 401
        return f(*args, **kwargs)
    return decorated_function

@api.route('/test/', methods=['GET'])
@firebase_auth_required
def test():
    user = request.user
    return jsonify({"message": f"Authorized {user['uid']}"}), 200