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
