import datetime
from . import models, db
from sqlalchemy import func, and_
from uuid import uuid4

def register_new_user(data) -> bool:
    print(data)
    uuid = data['uuid']
    username = data['username']
    email = data['email']

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
    return user

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

def get_subpage(subpage_uid) -> models.Subpage:
    subpage = db.session.query(models.Subpage).filter(models.Subpage.uid == subpage_uid).first()
    if subpage:
        return subpage
    else:
        return False

def get_subpage_data(subpage_uid) -> dict:
    subpage = get_subpage(subpage_uid)
    subpage_data = subpage.to_json()
    return subpage_data

def get_subpage_subscribers(subpage_uid) -> list[str]:
    subscriber_uuids = db.session.query(models.UserSubscription.user_uid).filter(models.UserSubscription.subpage_uid == subpage_uid).all()
    if subscriber_uuids:
        subscribers = []
        for sub in subscriber_uuids:
            user = get_user(subscriber_uuids)
            username = user.username
            subscribers.append(username)
        return subscribers

