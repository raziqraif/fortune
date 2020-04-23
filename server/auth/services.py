import bcrypt
import secrets

from werkzeug.exceptions import BadRequest, Unauthorized

from db import db, Profile, AuthToken, Game, GameProfile

def create_auth_token(profile: Profile):
    return AuthToken.create(
        profile=profile,
        token=secrets.token_urlsafe(32),
    )

@db.atomic()
def register(username: str, password: str):
    profile = Profile.get_or_none(Profile.username == username)
    if profile is not None:
        raise BadRequest('A user with this username already exists')
    hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
    profile = Profile.create(
        username=username,
        hashed_password=hashed,
    )
    global_game = Game.get_or_none(Game.name == 'Global Indefinite')
    GameProfile.create(
        game=global_game,
        profile=profile,
        cash=global_game.starting_cash
    )
    global_game = Game.get_or_none(Game.name == 'Global Timed')
    GameProfile.create(
        game=global_game,
        profile=profile,
        cash=global_game.starting_cash
    )
    return create_auth_token(profile)

@db.atomic()
def login(username: str, password: str):
    profile = Profile.get_or_none(Profile.username == username)
    if profile is None:
        raise BadRequest('A user with this username does not exist')
    if not bcrypt.checkpw(password.encode(), profile.hashed_password.encode()):
        raise BadRequest('Incorrect password')
    return create_auth_token(profile)

@db.atomic()
def change_username(profile_id: int, username: str):
    profile = Profile.get_or_none(Profile.username == username)
    if profile is not None:
        raise BadRequest('A user with this username already exists')
    try:
        update_username = Profile.update({
            Profile.username: username
        }).where(Profile.id == profile_id)
        update_username.execute()
    except Exception as e:
        raise BadRequest('Failure to change username: {}'.format(str(e)))

@db.atomic()
def change_password(profile: Profile, old_password: str, new_password: str):
    if not bcrypt.checkpw(old_password.encode(), profile.hashed_password.encode()):
        raise BadRequest('Incorrect old password')
    hashed_new_password = bcrypt.hashpw(new_password.encode(), bcrypt.gensalt()).decode()
    try:
        update_password = Profile.update({
            Profile.hashed_password: hashed_new_password
        }).where(Profile.id == profile.id)
        update_password.execute()
    except Exception as e:
        raise BadRequest('Failure to change password: {}'.format(str(e)))