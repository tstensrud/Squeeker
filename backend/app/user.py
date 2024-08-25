from flask import  Blueprint, request, jsonify
from firebase_admin import auth
from functools import wraps
from . import db_ops as db

user = Blueprint("user", __name__)

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

# Get user data
@user.route('/<uuid>/', methods=['GET'])
@firebase_auth_required
def account(uuid):
    user = db.get_user(uuid)
    user_data = user.to_json()
    if user:
        return jsonify({"success": True, "message": "Account found", "data": user_data})
    else:
        return jsonify({"success": False, "message": "No account found"})

# Get user subscriptions
@user.route('/subs/<uuid>/', methods=['GET'])
@firebase_auth_required
def get_user_subs(uuid):
    subs = db.get_user_subscriptions(uuid, True)
    if subs is not None:
        return jsonify({"success": True, "message": "User subscriptions", "data": subs})
    else:
        return jsonify({"success": False, "message": "No user subscriptions"})

# Get all user posts
@user.route('/posts/<uuid>/', methods=['GET'])
@firebase_auth_required
def get_posts(uuid):
    posts = db.get_all_user_posts(uuid)
    if posts:
        return jsonify({"success": True, "message": "Posts", "data": posts})
    else:
        return jsonify({"success": False, "message": "No posts found"})

# Get all user comments
@user.route('/comments/<uuid>/', methods=['GET'])
@firebase_auth_required
def get_user_comments(uuid):
    comments = db.get_all_user_comments(uuid)
    if comments:
        return jsonify({"success": True, "message": "Comments", "data": comments})
    else:
        return jsonify({"success": False, "message": "No comments found"})

# Get upvoted posts
@user.route('/upvoted/posts/<uuid>/', methods=['GET'])
def get_upvoted_posts(uuid):
    posts = db.get_all_votes_posts_user(uuid, True)
    if posts:
        return jsonify({"success": True, "message": "Upvoted posts", "data": posts})
    else:
        return jsonify({"success": False, "message": "No upvoted posts found"})

# Get downvoted posts
@user.route('/downvoted/posts/<uuid>/', methods=['GET'])
def get_downvoted_posts(uuid):
    posts = db.get_all_votes_posts_user(uuid, False)
    if posts:
        return jsonify({"success": True, "message": "Downvoted posts", "data": posts})
    else:
        return jsonify({"success": False, "message": "No Downvoted posts found"})