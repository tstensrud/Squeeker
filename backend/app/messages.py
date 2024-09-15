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
    messages = db.get_all_user_messages(uuid, unread=True)
    if messages:
        message_data = {}
        for message in messages:
            message_json = message.to_json()
            
            post = db.get_post(message.post_uid)
            if post:
                subpage = db.get_subpage(subpage_uid=post.subpage_uid)
                subpage_name = subpage.name
                message_json["subpage_name"] = subpage_name
            message_data[message.uid] = message_json
        return jsonify({"success": True, "message": "Messages", "data": message_data})
    return jsonify({"success": False, "message": "Your inbox is empty"})

@messages.route('/inbox/old/<uuid>/', methods=['GET'])
@firebase_auth_required
def inbox_old_messages(uuid: str):
    old_messages = db.get_all_user_messages(uuid, unread=False)
    if old_messages:
        message_data = {}
        for message in old_messages:
            message_json = message.to_json()
            
            post = db.get_post(message.post_uid)
            if post:
                subpage = db.get_subpage(subpage_uid=post.subpage_uid)
                subpage_name = subpage.name
                message_json["subpage_name"] = subpage_name
            message_data[message.uid] = message_json
        return jsonify({"success": True, "message": "Messages", "data": message_data})
    return jsonify({"success": False, "message": "No messages found"})

@messages.route('/sent/<uuid>/', methods=['GET'])
@firebase_auth_required
def sent(uuid: str):
    messages = db.get_all_user_sent_messages(uuid)
    if messages:
        message_data = {}
        for message in messages:
            if (message.comment_uid == None and message.post_uid == None):
                message_data[message.uid] = message.to_json()
        return jsonify({"success": True, "data": message_data})
    else:
        return jsonify({"success": False, "message": "No sent messages found"})

@messages.route('/send/', methods=["POST"])
@firebase_auth_required
def send_message():
    data = request.get_json()
    if data:
        sender_uid = data["sender_uid"]
        message = data["message"]
        recipient = data["username"].strip()
        user = db.get_user_by_username(recipient)
        if user is None:
            return jsonify({"success": False, "message": f"The user {recipient} does not exists"})
        send_message = db.send_message_to_single_user(sender_uid=sender_uid, receiver_name=recipient, message=message)
        if send_message:
            return jsonify({"success": True, "message": "Message sent"})
        else:
            return jsonify({"success": False, "message": "Could not send message"})
    else:
        return jsonify({"success": False, "message": "No message data received"})
        
@messages.route('/read/', methods=['PATCH'])
@firebase_auth_required
def message_read():
    data = request.get_json()
    print(data)
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
    
@messages.route('/notification/<uuid>/', methods=['GET'])
@firebase_auth_required
def get_notification(uuid):
    notification_status = db.get_user_notification_status(uuid)
    notification = {"notification": notification_status}
    return jsonify({"success": True, "data": notification})

@messages.route('/delete_message/', methods=['DELETE'])
@firebase_auth_required
def delete_message():
    data = request.get_json()
    if data:
        print(data)
        uuid = data["uuid"]
        try:
            user = auth.get_user(uuid)
        except Exception as e:
            return jsonify({"success": False, "message": "User not recognized"})
        if uuid == user.uid:
            message_uid = data["message_uid"]
            deleted_message = db.delete_message(message_uid)
            if deleted_message:
                return jsonify({"success": True, "message": "Message deleted"})
    return jsonify({"success": False, "message": "Could not delete message"})

@messages.route('/delete_all/', methods=['DELETE'])
@firebase_auth_required
def delete_all_messages():
    data = request.get_json()
    if data:
        uuid = data["uuid"]
        try:
            user = auth.get_user(uuid)
        except Exception as e:
            return jsonify({"success": False, "message": "User not recognized"})
        if uuid == user.uid:
            deleted_messages = db.delete_all_read_messages(uuid)
            if deleted_messages is True:
                return jsonify({"success": True, "message": "Read messages deleted"})
    return jsonify({"success": False, "message": "No messages deleted"})

@messages.route('/test/', methods=['GET'])
def message_test():
    number = 5
    message = "All GitHub and Patreon donors get a nice little newsletter every now and then; for people who donate at least 10USD a month I briefly did a  newsletter roughly once a month (see an example here) but now I'm open to other ideas for saying thanks. You can also donate via PayPal, but they charge fairly high fees and you won't get any newsletters. Donations currently aim to ensure that bovine3dom can work one day a week on Tridactyl at minimum wage. Previously the donations have funded an in-person developer retreat."
    uid = '2LVeEeXwwmTai5O4te7321QvAUs2'
    for i in range(number):
        db.send_message_to_single_user(f"Message number {i}. {message}", 'jTm6KdjWE2WZ5n0BDaJOd65mtdf2', "nird", uid)
    return jsonify({"success": True, "message": "Mock messages created"})

