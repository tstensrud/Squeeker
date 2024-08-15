from . import db

class User(db.Model):
    __tablename__ = 'Users'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    uuid = db.Column(db.String(255), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    username = db.Column(db.String(100), nullable=False)

    posts = db.relationship("Post", backref="user", lazy=True)
    subscriptions = db.relationship('UserSubscription', backref="user", lazy=True)

    def to_json(self):
        return {
            "id": self.id,
            "uuid": self.uuid,
            "email": self.email,
            "username": self.username
        }

class UserSubscription(db.Model):
    __tablename__ = 'Usersubscription'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_uid = db.Column(db.String(255), db.ForeignKey('Users.uuid'), nullable=False)
    subpage_uid = db.Column(db.String(255), nullable=False)
    timestamp = db.Column(db.String(100))


class Subpage(db.Model):
    __tablename__ = 'Subpage'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    uid = db.Column(db.String(255), unique=True, nullable=False)
    name = db.Column(db.String(50), unique=True, nullable=False)
    description = db.Column(db.String(500), nullable=False)
    public = db.Column(db.Boolean, default=True)
    active = db.Column(db.Boolean, default=True)
    nsfw = db.Column(db.Boolean, default=False)

    def to_json(self):
        return {
            "id": self.id,
            "uid": self.uid,
            "name": self.name,
            "description": self.description,
            "public": self.public,
            "active": self.active,
            "nsfw": self.nsfw
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

    comments = db.relationship("Comment")

    def to_json(self):
        return {
            'id': self.id,
            'uid': self.uid,
            "subpage_uid": self.subpage_uid,
            "subpage_name": self.subpage_name,
            'author_uuid': self.author_uuid,
            'author_name': self.author_name,
            'title': self.title,
            'post': self.post,
            'timestamp': self.timestamp,
            'total_votes': self.total_votes,
            'upvotes': self.upvotes,
            'downvotes': self.downvotes
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

    def to_json(self):
        return {
            'id': self.id,
            'uid': self.uid,
            "author": self.author,
            'post_uid': self.post_uid,
            'parent_comment_uid': self.parent_comment_uid,
            'timestamp': self.timestamp,
            "comment": self.comment,
            'total_votes': self.total_votes,
            'upvotes': self.upvotes,
            'downvotes': self.downvotes
        }
