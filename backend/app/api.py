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

@firebase_auth_required
@api.route('/user/<uuid>/', methods=["GET"])
def get_userdata(uuid):
    user = db.get_user(uuid)
    if user:
        user_data = user.to_json()
        return jsonify({"success": True, "message": "User found", "data": user_data})
    else:
        return jsonify({"success": False, "message": "Could not find user"})

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

@firebase_auth_required
@api.route('/subpage/create/', methods=['POST'])
def create_subpage():
    data = request.get_json()
    if data:
        escaped_data = {}
        for key, value in data.items():
            if key == "name" or key == "description":
                escaped_data[key] = escape(value.strip())
            else:
                escaped_data[key] = value
        if db.find_subpage_name(escaped_data['name']):
            return jsonify({"success": False, "message": "A subpage with that name already exist"})
        
        if db.create_subpage(escaped_data):
            return jsonify({"success": True, "message": "Subpage created"})
        else:
            return jsonify({"success": False, "message": "Could not create sub page"})
    else:
        return jsonify({"success": False, "message": "No data received"})

@api.route('/subpage/all/', methods=['GET'])
def get_subpages():
    print("All subpages")
    subpages = db.get_all_subpages()
    if subpages:
        return jsonify({"success": True, "message": "All subpages", "data": subpages})
    else:
        return jsonify({"success": False, "message": "No subpages were found"})

@api.route('/subpage/<subpage_name>/', methods=['GET'])
def get_subpage(subpage_name):
    subpage = db.get_subpage(subpage_name)
    if subpage is False:
        return jsonify({"success": False, "message": "This subpage does not exist"})
    subpage_data = subpage.to_json()
    return jsonify({"success": True, "message": "Fetched subpage data", "data": subpage_data})

@api.route('/subpage/<subpage_uid>/posts/', methods=['GET'])
def get_subpage_posts(subpage_uid):
    posts = db.get_subpage_posts(10, subpage_uid)
    if posts:
        return jsonify({"success": True, "message": "Posts returned", "data": posts})
    else:
        return jsonify({"success": False, "message": "This subpage has no posts yet."})

@api.route('/subpage/post/<post_uid>/', methods=['GET'])
def get_post(post_uid):
    post = db.get_post(post_uid)
    if post:
        post_data = post.to_json()
        return jsonify({"success": True, "message": "Post found", "data": post_data})
    else:
        return jsonify({"success": False, "message": "Could not find post"})

@api.route('/subpage/post/<post_uid>/comments/', methods=['GET'])
def get_post_comments(post_uid):
    comments = db.get_post_comments(post_uid)
    if comments:
        return jsonify({"success": True, "message": f"Comments for post {post_uid}", "data": comments})
    else:
        return jsonify({"success": False, "message": "No comments found for post"})


@firebase_auth_required
@api.route('/subpage/<subpage_uid>/new_post/', methods=['POST'])
def new_subpage_post(subpage_uid):
    data = request.get_json()
    if data:
        processed_data = {}
        for key, value in data.items():
            processed_data[key] = escape(value).strip()
        new_post = db.new_post(processed_data)
        new_data = {}
        new_data["post_uid"] = new_post
        if new_post is not False: # return the uid of the post
            return jsonify({"success": True, "message": "Post added", "data": new_data})
        else:
            return jsonify({"success": False, "message": "Could not add post"})
    else:
        return jsonify({"success": False, "message": "No data received"})

@firebase_auth_required
@api.route('/subpage/comment/new/', methods=['POST'])
def new_comment():
    data = request.get_json()
    if data:
        subpage_name = escape(data["subPageName"])
        find_subpage = db.get_subpage(subpage_name)
        if find_subpage is False:
            return({"success": False, "message": f"Subpage {subpage_name} does not exist"})
        author = escape(data["author"])
        postUid = escape(data["postId"])
        comment = escape(data["comment"]).strip()
        new_comment = db.new_comment(postUid, author, comment, "")
        if new_comment is True:
            return ({"success": True, "message": "Comment added"})
        else:
            return({"success": False, "message": f"Could not add comment: {new_comment}"})
    else:
        return({"success": False, "message": "No comment data received"})

@firebase_auth_required
@api.route('/test/', methods=['GET'])
def test():
    user = request.user
    return jsonify({"message": f"Authorized {user['uid']}"}), 200

