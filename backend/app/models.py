from . import db
from datetime import datetime
from sqlalchemy import func, and_, or_, asc, desc, Index

class User(db.Model):
    __tablename__ = 'Users'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    uuid = db.Column(db.String(255), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    username = db.Column(db.String(100), nullable=False)
    event_timestamp = db.Column(db.TIMESTAMP, server_default=func.now(), onupdate=func.now())
    last_action = db.Column(db.String(50))
    message_notification = db.Column(db.Boolean, default=False)

    post = db.relationship("Post", backref="user", lazy=True)
    subscription = db.relationship('UserSubscription', backref="user", lazy=True)
    comment = db.relationship("Comment", backref='user', lazy=True)
    
    __table_args__ = (
            Index('idx_uid', 'uuid'),
        )
    
    def to_json(self):
        return {
            "id": self.id,
            "uuid": self.uuid,
            "email": self.email,
            "username": self.username,
            "event_timestamp": self.event_timestamp,
            "message_notification": self.message_notification
        }

class UserMessage(db.Model):
    __tablename__ = "UserMessage"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    uid = db.Column(db.String(255), unique=True, nullable=False)
    recipient_uid = db.Column(db.String(255), db.ForeignKey('Users.uuid'), nullable=False)
    sender_uid = db.Column(db.String(255), db.ForeignKey('Users.uuid'), nullable=False)
    comment_uid = db.Column(db.String(255), nullable=True)
    post_uid = db.Column(db.String(255), nullable=True)
    message = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.String(50))
    event_timestamp = db.Column(db.TIMESTAMP, server_default=func.now(), onupdate=func.now())
    has_read = db.Column(db.Boolean, default=False)
    
    sender = db.relationship('User', foreign_keys=[sender_uid], backref="sender")
    recipient = db.relationship('User', foreign_keys=[recipient_uid], backref='recipient')

    __table_args__ = (
        Index('idx_uid', 'uid'),
    )

    def to_json(self):
        sender_name = self.sender.username
        if self.timestamp:
            timestamp_in_seconds = int(self.timestamp) / 1000
            timestamp = datetime.fromtimestamp(timestamp_in_seconds)
        else:
            timestamp = 0
        return {
            "id": self.id,
            "uid": self.uid,
            "recipient_uid": self.recipient_uid,
            "sender_uid": self.sender_uid,
            "sender_name": sender_name,
            "message": self.message,
            "timestamp": timestamp,
            "has_read": self.has_read,
            "event_timestamp": self.event_timestamp,
            "post_uid": self.post_uid,
            "comment_uid": self.comment_uid
        }

class UserSubscription(db.Model):
    __tablename__ = 'Usersubscription'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_uid = db.Column(db.String(255), db.ForeignKey('Users.uuid'), nullable=False)
    subpage_uid = db.Column(db.String(255), nullable=False)
    timestamp = db.Column(db.String(100))
    event_timestamp = db.Column(db.TIMESTAMP, server_default=func.now(), onupdate=func.now())

    __table_args__ = (
        Index('idx_uid', 'user_uid'),
    )

    def to_json(self):
        if self.timestamp:
            timestamp_in_seconds = int(self.timestamp) / 1000
            timestamp = datetime.fromtimestamp(timestamp_in_seconds)
        else:
            timestamp = 0
        return {
            "id": self.id,
            "user_uid": self.user_uid,
            "subpage_uid": self.subpage_uid,
            "timestamp": timestamp,
            "event_timestamp": self.event_timestamp
        }


class Subpage(db.Model):
    __tablename__ = 'Subpage'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    uid = db.Column(db.String(255), unique=True, nullable=False)
    name = db.Column(db.String(50), unique=True, nullable=False)
    description = db.Column(db.String(500), nullable=False)
    public = db.Column(db.Boolean, default=True)
    active = db.Column(db.Boolean, default=True)
    nsfw = db.Column(db.Boolean, default=False)
    event_timestamp = db.Column(db.TIMESTAMP, server_default=func.now(), onupdate=func.now())
    total_subs = db.Column(db.Integer)

    __table_args__ = (
        Index('idx_uid', 'uid'),
    )

    def to_json(self):
        return {
            "id": self.id,
            "uid": self.uid,
            "name": self.name,
            "description": self.description,
            "public": self.public,
            "active": self.active,
            "nsfw": self.nsfw,
            "event_timestamp": self.event_timestamp,
            "total_subs": self.total_subs
        }

class Post(db.Model):
    __tablename__ = "Post"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    uid = db.Column(db.String(255), unique=True, nullable=False)
    subpage_uid = db.Column(db.String(255), db.ForeignKey('Subpage.uid'), nullable=False)
    subpage_name = db.Column(db.String(50))
    author_uuid = db.Column(db.String(255), db.ForeignKey('Users.uuid'), nullable=False)
    author_name = db.Column(db.String(100))
    title = db.Column(db.String(50), nullable=False)
    post = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.String(100))
    total_votes = db.Column(db.Integer)
    upvotes = db.Column(db.Integer)
    downvotes = db.Column(db.Integer)
    event_timestamp = db.Column(db.TIMESTAMP, server_default=func.now(), onupdate=func.now())
    deleted = db.Column(db.Boolean, default=False)
    deleted_post = db.Column(db.Text, nullable = True)

    __table_args__ = (
        Index('idx_uid', 'uid'),
    )

    def to_json(self):
        if self.timestamp:
            timestamp_in_seconds = int(self.timestamp) / 1000
            timestamp = datetime.fromtimestamp(timestamp_in_seconds)
        else:
            timestamp = 0
        return {
            'id': self.id,
            'uid': self.uid,
            "subpage_uid": self.subpage_uid,
            "subpage_name": self.subpage_name,
            'author_uuid': self.author_uuid,
            'author_name': self.author_name,
            'title': self.title,
            'post': self.post,
            'timestamp': timestamp,
            'total_votes': self.total_votes,
            'upvotes': self.upvotes,
            'downvotes': self.downvotes,
            "event_timestamp": self.event_timestamp,
            "deleted": self.deleted,
        }

class Comment(db.Model):
    __tablename__ = "Comment"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    uid = db.Column(db.String(255), unique=True, nullable=False)
    author = db.Column(db.String(255), db.ForeignKey('Users.uuid'), nullable=False)
    post_uid = db.Column(db.String(255), db.ForeignKey('Post.uid'), nullable=False)
    parent_comment_uid = db.Column(db.String(255), nullable=True)
    comment = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.String(100))
    total_votes = db.Column(db.Integer)
    upvotes = db.Column(db.Integer)
    downvotes = db.Column(db.Integer)
    event_timestamp = db.Column(db.TIMESTAMP, server_default=func.now(), onupdate=func.now())
    deleted = db.Column(db.Boolean, default=False)
    deleted_comment = db.Column(db.Text)

    #post = db.relationship('Post', foreign_keys=[post_uid], backref='comment')
    #author = db.relationship('User', foreign_keys=[author], backref='author')
    

    __table_args__ = (
        Index('idx_uid', 'uid'),
    )

    def to_json(self):
        author_object = db.session.query(User).filter(User.uuid == self.author).first()
        author_name = author_object.username
        post = db.session.query(Post).filter(Post.uid == self.post_uid).first()
        subpage_name = post.subpage_name
        if self.timestamp:
            timestamp_in_seconds = int(self.timestamp) / 1000
            timestamp = datetime.fromtimestamp(timestamp_in_seconds)
        else:
            timestamp = 0
        return {
            'id': self.id,
            'uid': self.uid,
            "author_uuid": self.author,
            "author_name": author_name,
            'post_uid': self.post_uid,
            "subpage_name": subpage_name,
            'parent_comment_uid': self.parent_comment_uid,
            'timestamp': timestamp,
            "comment": self.comment,
            'total_votes': self.total_votes,
            'upvotes': self.upvotes,
            'downvotes': self.downvotes,
            "event_timestamp": self.event_timestamp,
            "deleted": self.deleted
        }

class Vote(db.Model):
    __tablename__ = "Vote"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    uid = db.Column(db.String(255), unique=True, nullable=False)
    post_uid = db.Column(db.String(255), db.ForeignKey('Post.uid'), nullable=True)
    comment_uid = db.Column(db.String(255), db.ForeignKey('Comment.uid'), nullable=True)
    author_uuid = db.Column(db.String(255), db.ForeignKey('Users.uuid'), nullable=False)
    upvote = db.Column(db.Boolean)
    downvote = db.Column(db.Boolean)
    event_timestamp = db.Column(db.TIMESTAMP, server_default=func.now(), onupdate=func.now())

    __table_args__ = (
        Index('idx_uid', 'uid'),
    )
    
    def to_json(self):
        return {
            "id": self.id,
            "uid": self.uid,
            "post_uid": self.post_uid,
            "comment_uid": self.comment_uid,
            "author_uuid": self.author_uuid,
            "upvote": self.upvote,
            "downvote": self.downvote,
            "event_timestamp": self.event_timestamp
        }
        
