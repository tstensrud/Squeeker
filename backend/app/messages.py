from flask import  Blueprint, request, jsonify
from firebase_admin import auth
from functools import wraps
from . import db_ops as db

messages = Blueprint("messages", __name__)

def firebase_auth_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        id_token = request.headers.get('Authorization')
        #print(f"ID_TOKEN: {id_token}")
        if id_token is None:
            #print("Unauthorize access atempted")
            return jsonify({"success": False, "message": "Unauthorized"}), 401
        token = id_token.split(" ")[1]
        try:
            #print("Verifying token")
            decoded_token = auth.verify_id_token(token)
            #print(f"decoded token: {decoded_token}")
            request.user = decoded_token
        except Exception as e:
            #print(f"Failed to verify token: {e}")
            return jsonify({"error": str(e)}), 401
        return f(*args, **kwargs)
    return decorated_function

@messages.route('/inbox/<uuid>/', methods=['GET'])
@firebase_auth_required
def inbox(uuid):
    messages = db.get_all_user_messages(uuid)
    if messages:
        return jsonify({"success": True, "message": "Messages", "data": messages})
    return jsonify({"success": False, "message": "No messages found"})

@messages.route('/send/<recipient>/', methods=["POST"])
@firebase_auth_required
def send_messag(recipient):
    data = request.get_json()
    if data:
        sender = request.user
        if sender:
            sender_uid = sender.uid
            message = db.send_message_to_single_user(sender_uid, recipient, message)
            if message:
                return jsonify({"success": False, "message": "Message sent"})
            else:
                return jsonify({"success": False, "message": "Could not send message"})
        else:
            return jsonify({"success": False, "message": "Sender not found"})
    else:
        return jsonify({"success": False, "message": "No message data received"})
        
    

