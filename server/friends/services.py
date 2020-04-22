from db import db, Notification, Profile, Friends
from werkzeug.exceptions import BadRequest

from notifications.services import send_notification

@db.atomic()
def create_request(requester_name, requestee_name, status):
    requester_profile = Profile.select().where(Profile.username == requester_name).get()
    requestee_profile = Profile.select().where(Profile.username == requestee_name).get()
    if requester_profile is None:
        raise BadRequest('Could not find requester')
    if requestee_profile is None:
        raise BadRequest('Could not find requestee')
    check_duplicates = Friends.select().where((Friends.requester == requester_profile and Friends.requestee == requestee_profile)
                                    or (Friends.requester == requestee_profile and Friends.requestee == requester_profile)).get()
    if check_duplicates is not None:
        raise BadRequest('Friend request has already been made')
    req = Friends.create(
        requester=requester_profile,
        requestee=requestee_profile,
        status=status)
    send_notification(requestee_profile, f'{requester_profile.username} has sent you a friend request!')
    return req

def get_friends_by_username(username):
    get_friends = Friends.select().where((Friends.requester == username or Friends.requestee == username) and Friends.status == 1)
    if get_friends.count() == 0:
        raise BadRequest("This user has no friends.")
    return get_friends
