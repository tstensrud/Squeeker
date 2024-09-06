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
        message_data = {}
        for message in messages:
            message_data[message.uid] = message.to_json()
        return jsonify({"success": True, "message": "Messages", "data": message_data})
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
        
@messages.route('/read/', methods=['PATCH'])
@firebase_auth_required
def message_read():
    data = request.get_json()
    message_uid = data["uid"]
    message_is_read = db.mark_message_read(message_uid)
    if message_is_read:

        return jsonify({"success": True, "message": "Message marked as read"})
    return jsonify({"success": False, "message": "Could not mark message as read"})

@messages.route('/markall/<uuid>/', methods=['PATCH'])
@firebase_auth_required
def mark_all_read(uuid):
    marked_messages = db.mark_all_messages_as_read(uuid)
    if marked_messages:
        return jsonify({"success": True, "message": "All messages marked as read"})
    return jsonify({"success": False, "message": "No messages marked as read"})
    

@messages.route('/test/', methods=['GET'])
def message_test():
    number = 5
    message = "All GitHub and Patreon donors get a nice little newsletter every now and then; for people who donate at least 10USD a month I briefly did a  newsletter roughly once a month (see an example here) but now I'm open to other ideas for saying thanks. You can also donate via PayPal, but they charge fairly high fees and you won't get any newsletters. Donations currently aim to ensure that bovine3dom can work one day a week on Tridactyl at minimum wage. Previously the donations have funded an in-person developer retreat."
    uid = '2LVeEeXwwmTai5O4te7321QvAUs2'
    for i in range(number):
        db.send_message_to_single_user(f"Message number {i}. {message}", 'jTm6KdjWE2WZ5n0BDaJOd65mtdf2', "nird", uid)
    return jsonify({"success": True, "message": "Mock messages created"})

