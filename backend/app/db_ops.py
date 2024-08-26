import datetime
from . import models, db
from sqlalchemy import func, and_, or_, asc, desc
from uuid import uuid4

def get_timestamp():
    return datetime.datetime.now().strftime("%Y-%m-%d %H:%M")

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
    post_score = post_upvotes - post_downvotes
    return post_score

def get_user_comment_score(uuid: str) -> int:
    comment_upvotes = db.session.query(func.sum(models.Comment.upvotes)).filter(models.Comment.author == uuid).scalar()
    comment_downvotes = db.session.query(func.sum(models.Comment.downvotes)).filter(models.Comment.author == uuid).scalar()
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
    print(total_subs)
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
    subpage_data = subpage.to_json()
    return subpage_data

def get_subpage_subscribers(subpage_uid) -> list[str]:
    subscriber_uuids = db.session.query(models.UserSubscription.user_uid).filter(models.UserSubscription.subpage_uid == subpage_uid).all()
    if subscriber_uuids:
        subscribers = []
        for user_uuid in subscriber_uuids:
            user = get_user(user_uuid)
            username = user.username
            subscribers.append(username)
        return subscribers

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
        return uid
    else:
        return False

def get_post(post_uid: str) -> models.Post:
    post = db.session.query(models.Post).filter(models.Post.uid == post_uid).first()
    if post:
        return post
    else:
        return None

def get_subpage_posts(total_posts: int, subpage_uid: str, order_by: str):
    if order_by == "date":
        posts = db.session.query(models.Post).filter(models.Post.subpage_uid == subpage_uid).order_by(desc(models.Post.timestamp)).limit(total_posts).all()
    elif order_by == "votes":
        posts = db.session.query(models.Post).filter(models.Post.subpage_uid == subpage_uid).order_by(desc(models.Post.total_votes)).limit(total_posts).all()

    if posts:
        post_dict = {}
        for post in posts:
            post_dict[post.uid] = post.to_json()
        return post_dict
    else:
        return None

def get_post_comments(post_uid: str) -> list[models.Comment]:
    comments = db.session.query(models.Comment).filter(and_(models.Comment.post_uid == post_uid, or_( models.Comment.parent_comment_uid == None, models.Comment.parent_comment_uid == ""))).order_by(models.Comment.total_votes).all()
    if comments:
        comment_uids = {}
        for comment in comments:
            comment_uids[comment.id] = comment.uid
        return comment_uids
    else:
        return None

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
        return uid
    else:
        return False

def get_comment(comment_uid: str) -> models.Comment:
    comment = db.session.query(models.Comment).filter(models.Comment.uid == comment_uid).first()
    if comment:
        return comment
    else:
        return None

def get_comment_children(comment_uid: str) -> list[models.Comment]:
    children = db.session.query(models.Comment).filter(models.Comment.parent_comment_uid == comment_uid).all()
    if children:
        children_data = {}
        for child in children:
            children_data[child.id] = child.uid
        return children_data
    else:
        return None
    
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
        post_comment = get_post(post_uid)
    elif comment_uid:
        vote_record = get_vote_record(comment_uid, author_uuid, False)
        post_comment = get_comment(comment_uid)

    # Set votes for existing voting record in Vote-table
    if vote_record:
        # Prevents a user to vote for his own content
        if direction == "0":
            if vote_record.upvote is True:
                post_comment.upvotes = post_comment.upvotes - 1
            elif vote_record.downvote is True:
                post_comment.downvotes = post_comment.downvotes - 1
            vote_record.upvote = False
            vote_record.downvote = False
        
        elif direction == "1":
            if vote_record.upvote is True:
                return False
            else:
                post_comment.upvotes = post_comment.upvotes + 1
                if vote_record.downvote is True:
                    post_comment.downvotes = post_comment.downvotes - 1
            vote_record.upvote = True
            vote_record.downvote = False
        
        elif direction == "-1":
            if vote_record.downvote is True:
                return False
            else:
                post_comment.downvotes = post_comment.downvotes + 1
                if vote_record.upvote is True:
                    post_comment.upvotes = post_comment.upvotes - 1
            vote_record.upvote = False
            vote_record.downvote = True
        
        post_comment.total_votes = post_comment.upvotes - post_comment.downvotes

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
        new_vote_object = models.Vote(uid = uid,
                                      post_uid = post_uid,
                                      comment_uid = comment_uid,
                                      author_uuid=author_uuid,
                                      upvote=True,
                                      downvote=False)
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