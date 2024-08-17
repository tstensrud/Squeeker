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

# User subscribe to subpage
@firebase_auth_required
@api.route('/subpage/subscribe/', methods=['POST'])
def subscribe():
    data = request.get_json()
    if data:
        client_uid = escape(data["clientUid"])
        subpage_uid = escape(data["subpageUid"])
        
        # If the user is alreadu subbed, unsub
        is_subed = db.check_for_user_sub(client_uid, subpage_uid)
        if is_subed is True:
            removed = db.remove_subscription_from_user(client_uid, subpage_uid)
            if removed is True:
                return jsonify({"success": True, "message": "Unsubscribed user"})
            else:
                return jsonify({"success": False, "message": "Could not unsubscribed user"})
            

        # If user is not subbed, sub
        else:
            sub = db.add_subscription_to_user(client_uid, subpage_uid)
            if sub is True:
                return jsonify({"success": True, "message": "Subscription added"})
            else:
                return jsonify({"success": False, "message": "Could not add subscription"})    
    else:
        return jsonify({"success": False, "message": "No data received"})

# Get total subs of subpage
@api.route('/subpage/total_subs/<sub_uid>/', methods=['GET'])
def get_total_subs(sub_uid):
    subs = db.get_total_subs_of_subpage(sub_uid)
    return jsonify({"success": True, "message": "Total subs found", "data": subs})

# Check if user is subscribed to subpage
@firebase_auth_required
@api.route('/subpage/is_subscribed/<sub_page_uid>/<uuid>/', methods=['GET'])
def is_client_subscribed(sub_page_uid, uuid):
    sub = db.check_for_user_sub(uuid, sub_page_uid)
    if sub is True:
        return jsonify({"success": True, "message": "User is subscribed", "data": True})
    else:
        return jsonify({"success": True, "message": "User is not subscribed", "data": False})

    
# Get posts from a specific sub page
@api.route('/subpage/<subpage_uid>/posts/', methods=['GET'])
def get_subpage_posts(subpage_uid):
    posts = db.get_subpage_posts(10, subpage_uid)
    if posts:
        return jsonify({"success": True, "message": "Posts returned", "data": posts})
    else:
        return jsonify({"success": False, "message": "This subpage has no posts yet."})

# Get data about specific post
@api.route('/subpage/post/<post_uid>/', methods=['GET'])
def get_post(post_uid):
    post = db.get_post(post_uid)
    if post:
        post_data = post.to_json()
        return jsonify({"success": True, "message": "Post found", "data": post_data})
    else:
        return jsonify({"success": False, "message": "Could not find post"})

# Retrieve comments from a specific post
@api.route('/subpage/post/<post_uid>/comments/', methods=['GET'])
def get_post_comments(post_uid):
    comments = db.get_post_comments(post_uid)
    if comments:
        return jsonify({"success": True, "message": f"Comments for post {post_uid}", "data": comments})
    else:
        return jsonify({"success": False, "message": "No comments found for post"})

# Get specific comment
@api.route('/subpage/get_comment/<comment_uid>/', methods=['GET'])
def get_comment(comment_uid):
    print("Get comment")
    comment = db.get_comment(comment_uid)
    if comment:
        comment_data = comment.to_json()
        return jsonify({"success": True, "message": "Comment fetched", "data": comment_data})
    else:
        return jsonify({"success": False, "message": "Could not find comment"})

# New post to subpage
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

# New comment
@firebase_auth_required
@api.route('/subpage/comment/new/', methods=['POST'])
def new_comment():
    data = request.get_json()
    if data:
        subpage_name = escape(data["subPageName"])
        find_subpage = db.get_subpage(subpage_name)
        if find_subpage is False:
            return jsonify({"success": False, "message": f"Subpage {subpage_name} does not exist"})
        author = escape(data["author"])
        postUid = escape(data["postId"])
        comment = escape(data["comment"]).strip()
        new_comment = db.new_comment(postUid, author, comment, None)
        if new_comment is not False:
            return jsonify({"success": True, "message": "Comment added", "data": new_comment})
        else:
            return jsonify({"success": False, "message": f"Could not add comment: {new_comment}"})
    else:
        return jsonify({"success": False, "message": "No comment data received"})

# New reply to comment
@firebase_auth_required
@api.route('/subpage/comment/reply/new/', methods=['POST'])
def new_reply():
    data = request.get_json()
    print(data)
    if data:
        author_uid = escape(data["authorUid"])
        parent_comment_uid = escape(data["parentComment"])
        post_uid = escape(data["postUid"])
        comment = escape(data["comment"]).strip()
        new_comment = db.new_comment(post_uid, author_uid, comment, parent_comment_uid)
        #new_comment = False
        if new_comment is not False:
            return jsonify({"success": True, "message": "Reply added", "data": new_comment})
        else:
            return jsonify({"success": False, "message": "Could not add reply"})
    else:
        return jsonify({"success": False, "message": "No data received"})

# Get all children from a comment
@api.route('/subpage/comment/children/<comment_uid>/', methods=['GET'])
def get_comment_children(comment_uid):
    children_data = db.get_comment_children(comment_uid)
    if children_data is not None:
        return jsonify({"success": True, "message": "Children comments retrieved", "data": children_data})
    else:
        return jsonify({"success": False, "message": "Parent comment has no children"})


@firebase_auth_required
@api.route('/test/', methods=['GET'])
def test():
    user = request.user
    return jsonify({"message": f"Authorized {user['uid']}"}), 200

