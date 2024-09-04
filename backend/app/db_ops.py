import datetime
from . import models, db
from sqlalchemy import func, and_, or_, asc, desc
from uuid import uuid4

def get_timestamp():
    return datetime.datetime.now().strftime("%Y%m%d%H%M%S")

#############################
# USER RELATED STUFF        #
#############################

def register_new_user(uuid: str, username: str, email: str) -> bool:
    new_user = models.User(uuid=uuid,username=username,email=email)
    try:
        db.session.add(new_user)
        db.session.commit()
        return True
    except Exception as e:
        db.session.rollback()
        print(e)
        return False

def get_user(uuid) -> models.User:
    user = db.session.query(models.User).filter(models.User.uuid == uuid).first()
    if user:
        return user
    else:
        return None

def get_user_by_username(username: str) -> models.User:
    user = db.session.query(models.User).filter(models.User.username == username).first()
    if user:
        return user
    else:
        return None

def front_page_data(user_uid: str):
    subpage_uids = get_user_subscriptions(user_uid, False)
    if subpage_uids:
        subpage_names = get_user_subscriptions(user_uid, True)
        posts = {}
        for subpage_uid, subpage_name in zip(subpage_uids, subpage_names):
            subpage_posts = get_subpage_posts(10, subpage_uid, "votes")
            posts[subpage_name] = subpage_posts
        return posts
    else:
        return None

def get_all_user_posts(user_uid: str) -> dict:
    posts = db.session.query(models.Post).filter(models.Post.author_uuid == user_uid).all()
    if posts:
        post_data = {}
        for post in posts:
            post_data[post.uid] = post.to_json()
        return post_data
    else:
        return None

def get_all_user_comments(user_uid: str) -> dict:
    comments = db.session.query(models.Comment).filter(models.Comment.author == user_uid).all()
    if comments:
        comment_data = {}
        for comment in comments:
            comment_data[comment.uid] = comment.to_json()
        return comment_data
    else:
        return None

def get_all_votes_posts_user(user_uid: str, upvotes: bool) -> dict:
    if upvotes:
        posts = db.session.query(models.Vote).filter(models.Vote.author_uuid == user_uid, models.Vote.upvote == True, models.Vote.post_uid.isnot(None)).all()
    else:
        posts = db.session.query(models.Vote).filter(models.Vote.author_uuid == user_uid, models.Vote.downvote == True, models.Vote.post_uid.isnot(None)).all()
    if posts:
        posts_data = {}
        for post in posts:
            post_data = get_post(post.post_uid)
            posts_data[post_data.uid] = post_data.to_json()
        return posts_data
    else:
        return None

def get_user_post_score(uuid: str) -> int:
    post_upvotes = db.session.query(func.sum(models.Post.upvotes)).filter(models.Post.author_uuid == uuid).scalar()
    post_downvotes = db.session.query(func.sum(models.Post.downvotes)).filter(models.Post.author_uuid == uuid).scalar()
    if post_upvotes is None:
        post_upvotes = 0
    if post_downvotes is None:
        post_downvotes = 0
    post_score = post_upvotes - post_downvotes
    return post_score

def get_user_comment_score(uuid: str) -> int:
    comment_upvotes = db.session.query(func.sum(models.Comment.upvotes)).filter(models.Comment.author == uuid).scalar()
    comment_downvotes = db.session.query(func.sum(models.Comment.downvotes)).filter(models.Comment.author == uuid).scalar()
    if comment_upvotes is None:
        comment_upvotes = 0
    if comment_downvotes is None:
        comment_downvotes = 0
    comment_score = comment_upvotes - comment_downvotes
    return comment_score

def get_user_total_posts(uuid: str) -> int:
    total_posts = db.session.query(func.count(models.Post.author_uuid)).filter(models.Post.author_uuid == uuid).scalar()
    if total_posts:
        return total_posts
    else:
        return 0

def get_user_total_comments(uuid: str) -> int:
    total_comments = db.session.query(func.count(models.Comment.author)).filter(models.Comment.author == uuid).scalar()
    if total_comments:
        return total_comments
    else:
        return 0

# Checks if timestamp of current action is not less than 60 seconds to prevent post/comment spam
def can_user_post_again(uuid: str) -> bool:
    user = get_user(uuid)
    if user:
        timestamp = user.last_action
        if timestamp is None:
            return True
        print(f"Timestamp for last actio: {timestamp}")
        timestamp_now = get_timestamp()
        print(f"Timestamp now: {timestamp_now}")
        time_since_last_entry = int(timestamp_now) - int(timestamp)
        print(f"Seconds since last entry by user: {time_since_last_entry}")
        if time_since_last_entry < 60:
            return False
        else:
            return True
    return False

# Add timestamp when user performed last action to prevent users from spamming content
def add_user_last_action(uuid: str) -> bool:
    user = get_user(uuid)
    if user:
        timestamp = get_timestamp()
        user.last_action = timestamp
        try:
            db.session.commit()
            return True
        except Exception as e:
            db.session.rollback()
            print(e)
            return False
    return False

#############################
# USER SUBSCRIPTIONS        #
#############################
# Returns a list of either subscription names, for viewing on frontend, or list of sub uids for backend handling
def get_user_subscriptions(user_uid: str, names_only: bool) -> list[str]:
    subs = db.session.query(models.UserSubscription).filter(models.UserSubscription.user_uid == user_uid).all()
    if subs:
        if names_only:
            subscription_names = []
            for sub in subs:
                sub = get_subpage(None, sub.subpage_uid)
                sub_name = sub.name
                subscription_names.append(sub_name)
            return subscription_names
        else:
            sub_uids = []
            for sub in subs:
                sub_uids.append(sub.subpage_uid)
            return sub_uids
    else:
        return None
    
# Get the UserSubscription record
def get_user_sub(user_uid: str, sub_uid: str) -> models.UserSubscription:
    sub = db.session.query(models.UserSubscription).filter(and_(models.UserSubscription.user_uid == user_uid, models.UserSubscription.subpage_uid == sub_uid)).first()
    if sub:
        return sub
    else:
        return None
    
def add_subscription_to_user(user_uid: str, sub_uid: str) -> bool:
    timestamp = get_timestamp()
    subscription = models.UserSubscription(user_uid=user_uid, subpage_uid=sub_uid, timestamp=timestamp)
    sub = get_subpage(None, sub_uid)
    sub.total_subs = sub.total_subs + 1
    try:
        db.session.add(subscription)
        db.session.commit()
        return True
    except Exception as e:
        print(f"Could not add subscription: {e}")
        db.session.rollback()
        return False

def remove_subscription_from_user(user_uid: str, sub_uid: str) -> bool:
    sub = get_user_sub(user_uid, sub_uid)
    if sub:
        subpage = get_subpage(None, sub_uid)
        subpage.total_subs = subpage.total_subs - 1
        try:
            db.session.delete(sub)
            db.session.commit()
            return True
        except Exception as e:
            print(f"Could not unsubscribe: {e}")
            db.session.rollback()
            return False
    else:
        return None

def check_for_user_sub(user_uid: str, sub_uid: str) -> bool:
    sub = db.session.query(models.UserSubscription).filter(and_(models.UserSubscription.user_uid == user_uid, models.UserSubscription.subpage_uid == sub_uid)).first()
    if sub:
        return True
    else:
        return False

def get_total_subs_of_subpage(sub_uid: str) -> int:
    total_subs = db.session.query(func.count(models.UserSubscription.subpage_uid)).filter(models.UserSubscription.subpage_uid == sub_uid).scalar()
    if total_subs is not None:
        return total_subs
    else:
        return 0

#############################
# SUBPAGE RELATED STUFF     #
#############################

def find_subpage_name(subpage_name: str) -> bool:
    subpage = db.session.query(models.Subpage).filter(models.Subpage.name == subpage_name).first()
    if subpage:
        return True
    else:
        return False
    
def create_subpage(data) -> bool:
    uid = str(uuid4())
    name = data["name"]
    description = data["description"]
    public = data["public"]
    active = True
    nsfw = data["nsfw"]

    new_subpage = models.Subpage(uid=uid,
                                 name=name,
                                 description=description,
                                 public=public,
                                 active=active,
                                 nsfw=nsfw)
    try:
        db.session.add(new_subpage)
        db.session.commit()
        return True
    except Exception as e:
        print(f"Could not create subpage: {e}")
        db.session.rollback()
        return False

def get_all_subpages() -> list[str]:
    subpages = db.session.query(models.Subpage).all()
    if subpages:
        subpage_titles_and_descriptions = {}
        for subpage in subpages:
            subpage_titles_and_descriptions[subpage.name] = subpage.description
        return subpage_titles_and_descriptions
    else:
        return None
    
def get_subpage(subpage_name, subpage_uid) -> models.Subpage:
    
    if subpage_uid is None:
        subpage = db.session.query(models.Subpage).filter(models.Subpage.name == subpage_name).first()
    else:
        subpage = db.session.query(models.Subpage).filter(models.Subpage.uid == subpage_uid).first()

    if subpage:
        return subpage
    else:
        return False

def get_subpage_data(subpage_uid) -> dict:
    subpage = get_subpage(None, subpage_uid)
    if subpage:
        subpage_data = subpage.to_json()
        return subpage_data
    return {}

def get_subpage_subscribers(subpage_uid) -> list[str]:
    subscriber_uuids = db.session.query(models.UserSubscription.user_uid).filter(models.UserSubscription.subpage_uid == subpage_uid).all()
    if subscriber_uuids:
        subscribers = []
        for user_uuid in subscriber_uuids:
            user = get_user(user_uuid)
            username = user.username
            subscribers.append(username)
        return subscribers

def get_subpage_posts(total_posts: int, subpage_uid: str, order_by: str):
    if order_by == "date":
        posts = db.session.query(models.Post).filter(models.Post.subpage_uid == subpage_uid).order_by(desc(models.Post.timestamp)).limit(total_posts).all()
    elif order_by == "votes":
        posts = db.session.query(models.Post).filter(models.Post.subpage_uid == subpage_uid).order_by(desc(models.Post.total_votes)).limit(total_posts).all()

    if posts:
        post_dict = {}
        for post in posts:
            post_data = post.to_json()
            post_data["comment_count"] = count_comments_on_post(post.uid)
            post_dict[post.uid] = post_data
        return post_dict
    else:
        return None
    
#############################
# POST RELATED STUFF        #
#############################

def new_post(data):
    author_uuid = data["author"]
    author_object = get_user(author_uuid)
    uid = str(uuid4())
    subpage_uid = data["subpageUid"]
    author_name = author_object.username
    subpage_name = data["subpageName"]
    title = data["title"]
    post = data["content"]
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")

    new_post = models.Post(uid=uid,
                           subpage_uid=subpage_uid,
                           subpage_name=subpage_name,
                           author_uuid=author_uuid,
                           author_name=author_name,
                           title=title,
                           post=post,
                           timestamp=timestamp,
                           total_votes=1,
                           upvotes=1,
                           downvotes=0)
    try:
        db.session.add(new_post)
        db.session.commit()
    except Exception as e:
        print(f"Error creating new post {e}")
        db.session.rollback()
        return False
    vote = set_vote(author_uuid, "1", post_uid = uid)
    if vote:
        add_user_last_action(author_uuid)
        return uid
    else:
        return False

def get_post(post_uid: str) -> models.Post:
    post = db.session.query(models.Post).filter(models.Post.uid == post_uid).first()
    if post:
        return post
    else:
        return None

def delete_post(post_uid: str) -> bool:
    post = get_post(post_uid)
    if post:
        post.deleted_post = post.post
        post.post = "The content of this post was deleted.."
        post.deleted = True
        try:
            db.session.commit()
            return True
        except Exception as e:
            print (e)
            db.session.rollback()
            return False
    return False


#############################
# COMMENT RELATED STUFF     #
#############################

def new_comment(post_uid: str, author_uuid: str, comment: str, parent_comment_uid: str) -> str:
    uid = str(uuid4())
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
    new_comment = models.Comment(uid=uid,
                             post_uid = post_uid,
                             author=author_uuid,
                             parent_comment_uid = parent_comment_uid,
                             comment=comment,
                             timestamp=timestamp,
                             total_votes=1,
                             upvotes=1,
                             downvotes=0
                             )
    try:
        db.session.add(new_comment)
        db.session.commit()
    except Exception as e:
        print(f"Could not add comment: {e}")
        db.session.rollback()
        return str(e)
    
    vote = set_vote(author_uuid, "1", comment_uid=uid)
    if vote:
        add_user_last_action(author_uuid)
        return uid
    else:
        return False

def get_comment(comment_uid: str) -> models.Comment:
    comment = db.session.query(models.Comment).filter(models.Comment.uid == comment_uid).first()
    if comment:
        return comment
    else:
        return None

def get_comment_children(comment_uid: str, uuid=None) -> dict:
    children = db.session.query(models.Comment).filter(models.Comment.parent_comment_uid == comment_uid).all()
    if children:
        all_comment_data = {}
        for child in children:
            comment_data = {}
            comment_data["data"] = child.to_json()
            if uuid:
                comment_data["has_voted"] = has_upvoted_comment(child.uid, uuid)
            if child.parent_comment_uid is not None:
                comment_data["children"] = get_comment_children(child.uid)
            all_comment_data[child.uid] = comment_data
        return all_comment_data
    else:
        return {}

def count_comments_on_post(post_uid: str) -> int:
    comment_count = db.session.query(func.count(models.Comment.post_uid)).filter(models.Comment.post_uid == post_uid).scalar()
    if comment_count is None:
        return 0
    return comment_count

def get_post_comments_uids(post_uid: str) -> dict:
    comments = db.session.query(models.Comment).filter(and_(models.Comment.post_uid == post_uid, or_( models.Comment.parent_comment_uid == None, models.Comment.parent_comment_uid == ""))).order_by(models.Comment.total_votes).all()
    if comments:
        comment_uids = {}
        for comment in comments:
            comment_uids[comment.id] = comment.uid
        return comment_uids
    else:
        return None

def get_post_comments_all_data(post_uid: str, limit: int, uuid=None) -> list[models.Comment]:
    comments = db.session.query(models.Comment).filter(and_(models.Comment.post_uid == post_uid, or_( models.Comment.parent_comment_uid == None, models.Comment.parent_comment_uid == ""))).order_by(models.Comment.total_votes).all()
    if comments:
        all_comment_data = {}
        for comment in comments:
            comment_data = {}
            comment_data["data"] = comment.to_json()
            if uuid:
                has_voted = has_upvoted_comment(comment.uid, uuid)
                comment_data["has_voted"] = has_voted
            comment_data["children"] = get_comment_children(comment.uid, uuid=uuid)
            all_comment_data[comment.uid] = comment_data
        return all_comment_data
    return None

def delete_comment(comment_uid: str) -> bool:
    comment = get_comment(comment_uid)
    if comment:
        if comment.deleted is True:
            return False
        comment.deleted_comment = comment.comment
        comment.comment = "This comment was deleted :-("
        comment.deleted = True
        try:
            db.session.commit()
            return True
        except Exception as e:
            print (e)
            db.session.rollback()
            return False
    return False

#############################
# VOTING                    #
#############################

def get_vote_record(vote_object_uid: str, author_uuid: str, post: bool) -> models.Vote:
    if post:
        vote_object = db.session.query(models.Vote).filter(and_(models.Vote.post_uid == vote_object_uid, models.Vote.author_uuid == author_uuid)).first()
    else:
        vote_object = db.session.query(models.Vote).filter(and_(models.Vote.comment_uid == vote_object_uid, models.Vote.author_uuid == author_uuid)).first()

    if vote_object:
        return vote_object
    else:
        return None
    
def set_vote(author_uuid: str, direction: str, post_uid=None, comment_uid=None) -> bool:
    if post_uid:
        vote_record = get_vote_record(post_uid, author_uuid, True)
        post_or_comment = get_post(post_uid)
    elif comment_uid:
        vote_record = get_vote_record(comment_uid, author_uuid, False)
        post_or_comment = get_comment(comment_uid)

    # Set votes for existing voting record in Vote-table
    if vote_record:
        
        if direction == "0":
            if vote_record.upvote is True:
                post_or_comment.upvotes = post_or_comment.upvotes - 1
            elif vote_record.downvote is True:
                post_or_comment.downvotes = post_or_comment.downvotes - 1
            vote_record.upvote = False
            vote_record.downvote = False
        
        elif direction == "1":
            #Prevent multiple upvotes from same user
            if vote_record.upvote is True:
                return False
            else:
                post_or_comment.upvotes = post_or_comment.upvotes + 1
                if vote_record.downvote is True:
                    post_or_comment.downvotes = post_or_comment.downvotes - 1
            vote_record.upvote = True
            vote_record.downvote = False
        
        elif direction == "-1":
            #Prevent multiple downvotes from same user
            if vote_record.downvote is True:
                return False
            else:
                post_or_comment.downvotes = post_or_comment.downvotes + 1
                if vote_record.upvote is True:
                    post_or_comment.upvotes = post_or_comment.upvotes - 1
            vote_record.upvote = False
            vote_record.downvote = True
        
        post_or_comment.total_votes = post_or_comment.upvotes - post_or_comment.downvotes

        try:
            db.session.commit()
            return True
        except Exception as e:
            print(e)
            db.session.rollback()
            return False
    
    # If user has not voted for this post/comment yet
    else:
        uid = str(uuid4())
        upvote = False
        downvote = False
        if direction == "1":
            upvote = True
            post_or_comment.upvotes = post_or_comment.upvotes + 1
        if direction == "-1":
            downvote = True
            post_or_comment.downvotes = post_or_comment.downvotes + 1
        
        post_or_comment.total_votes = post_or_comment.upvotes - post_or_comment.downvotes
            
        new_vote_object = models.Vote(uid = uid,
                                      post_uid = post_uid,
                                      comment_uid = comment_uid,
                                      author_uuid=author_uuid,
                                      upvote=upvote,
                                      downvote=downvote)
        try:
            db.session.add(new_vote_object)
            db.session.commit()
            return True
        except Exception as e:
            print(e)
            db.session.rollback()
            return False

def has_upvoted_post(post_uid: str, uuid: str) -> bool:
    vote_record = get_vote_record(post_uid, uuid, True)
    if vote_record:
        upvoted = vote_record.upvote
        downvoted = vote_record.downvote
        return {
            "upvoted": upvoted,
            "downvoted": downvoted
        }
    else:
        return None

def has_upvoted_comment(comment_uid: str, uuid: str) -> bool:
    vote_record = get_vote_record(comment_uid, uuid, False)
    if vote_record:
        upvoted = vote_record.upvote
        downvoted = vote_record.downvote
        return {
            "upvoted": upvoted,
            "downvoted": downvoted
        }
    else:
        return None
    
#############################
# FRONTPAGE                 #
#############################
def get_frontpage_posts_logged_in(user_uid: str, limit: int) -> dict:
    subs = get_user_subscriptions(user_uid, False)
    if subs:
        try:
            limit = int(limit)
        except Exception as e:
            print(e)
            return False

        if limit % len(subs) == 0:
            posts_per_sub = limit / len(subs)
        else:
            for lim in range(limit, limit + 10):
                if lim % len(subs) == 0:
                    posts_per_sub = lim / len(subs)
                    break
        post_dict = {}
        for sub in subs:
            posts = db.session.query(models.Post).filter(models.Post.subpage_uid == sub).order_by(models.Post.timestamp.desc()).limit(posts_per_sub)
            for post in posts:
                comment_count = count_comments_on_post(post.uid)
                post_data = post.to_json()
                post_data["comment_count"] = comment_count
                post_dict[post.uid] = post_data
        return post_dict
    return {}

#############################
# MESSAGES                  #
#############################
def get_all_user_messages(uuid: str) -> dict:
    messages = db.session.query(models.UserMessage).filter(models.UserMessage.recipient_uid == uuid).all()
    if messages:
        message_data = {}
        for message in messages:
            sender_name = message.sender.username
            message_data[sender_name] = message.to_json()
        return message_data
    return {}

def send_message_to_single_user(message: str, sender_uid: str, receiver_name=None, receiver_uid=None ) -> bool:
    if receiver_name:
        receiver = get_user_by_username(receiver_name)
    if receiver_uid:
        receiver = get_user(receiver_uid)
    if not receiver:
        return False
    receiver_uid = receiver.uuid
    uid = str(uuid4())
    timestamp = get_timestamp()
    new_message = models.UserMessage(uid=uid,
                                     recipient_uid=receiver_uid,
                                     sender_uid=sender_uid,
                                     message=message,
                                     timestamp=timestamp)
    receiver.message_notification = True
    try:
        db.session.add(new_message)
        db.session.commit()
        return True
    except Exception as e:
        db.session.rollback()
        print(e)
        return False

def send_message_on_post_comment(message: str, commentor_uid: str, post_uid: str) -> bool:
    post = get_post(post_uid)
    post_title = post.title
    message_to_post_author = f"{message}: {post_title}"
    post_author = post.author_uuid
    sent_message = send_message_to_single_user(message_to_post_author, sender_uid=commentor_uid, receiver_uid=post_author)
    return sent_message

def send_message_on_comment_reply(commentor_uid: str, parent_comment_uid: str) -> bool:
    parent_comment = get_comment(parent_comment_uid)
    parent_comment_author = parent_comment.author
    commentor = get_user(commentor_uid)
    message = f"{commentor.username} has replied to your comment."
    send_message_to_single_user(message, commentor_uid, receiver_uid=parent_comment_author)
