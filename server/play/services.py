from datetime import datetime
from decimal import Decimal
from math import ceil

from werkzeug.exceptions import BadRequest

from db import db, Game, GameCoin, Coin, GameProfile, Profile
from play.serializers import SortCriteria

PAGE_SIZE = 12


@db.atomic()
def active_games_at_page(profile_id, page_number, keyword, criteria):
    """ Returns
        - active games in the requested page that matches the keyword (sorted by criteria)
        - number of active games matching the keyword
    """

    games_query = Game.select()\
        .join(GameProfile)\
        .where((Game.name == "Global Indefinite")
               | ((GameProfile.profile == profile_id)
                  & Game.name.contains(keyword)
                  & (Game.ends_at > datetime.utcnow())))
    total_games = games_query.count()
    max_page = int(ceil(total_games / PAGE_SIZE))

    # Verify page is within range
    page_number = max(1, page_number)
    page_number = max_page if page_number > max_page else page_number

    if criteria['titleAscending']:
        games_query = games_query.order_by(+Game.name)
    elif criteria['titleDescending']:
        games_query = games_query.order_by(-Game.name)
    elif criteria['endTimeAscending']:
        games_query = games_query.order_by(+Game.ends_at)
    elif criteria['endTimeDescending']:
        games_query = games_query.order_by(-Game.ends_at)

    games_query = games_query.paginate(page_number, PAGE_SIZE)
    games = []
    for gm in games_query:
        games.append(gm)
    return games, total_games, PAGE_SIZE
