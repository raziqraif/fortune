from db import db, Notification, Profile, Friends
from werkzeug.exceptions import BadRequest

@db_atomic()
def create_request(profile, requestee, status):
    req = Friends.create(
        requester=profile.id,
        requestee=requestee,
        status=status
        )
    return req
