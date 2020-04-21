from db import db, Notification, Profile, Friend
from werkzeug.exceptions import BadRequest

@db.atomic()
def create_request(requester, requestee, status):
    req = Friends.create(
        requester=requester,
        requestee=requestee,
        status=status
        )
    return req
