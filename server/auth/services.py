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
    return create_auth_token(profile)




@db.atomic()
def login(username: str, password: str):
    profile = Profile.get_or_none(Profile.username == username)
    if profile is None:
        raise BadRequest('A user with this username does not exist')
    if not bcrypt.checkpw(password.encode(), profile.hashed_password.encode()):
        raise BadRequest('Incorrect password')
    return create_auth_token(profile)
