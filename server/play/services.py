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

    games_query = Game.select() \
        .join(GameProfile) \
        .where((GameProfile.profile == profile_id)
               & Game.name.contains(keyword)
               & (Game.ends_at > datetime.utcnow()))  # Note: This line always filters out Global Indef.

    # LOOKATME: Depending on the keyword, the call above might return EVERY games from the database that belongs to
    # the player. If that is expensive, optimize this.

    games = [gm for gm in games_query]
    global_indef = Game.get_or_none(Game.id == 1)

    include_global_indef = False
    if keyword.lower() in global_indef.name.lower():    # Cannot append global_indef to games yet,
        include_global_indef = True                     # else sorting by endTime will break

    total_games = len(games) + 1 if include_global_indef else len(games)
    max_page = int(ceil(total_games / PAGE_SIZE))

    # Verify page is within range
    page_number = max(1, page_number)
    page_number = max_page if page_number > max_page else page_number

    from operator import attrgetter
    if criteria['titleAscending']:
        games.append(global_indef)
        games.sort(key=attrgetter("name"))
    elif criteria['titleDescending']:
        games.append(global_indef)
        games.sort(key=attrgetter("name"), reverse=True)
    elif criteria['endTimeAscending']:
        games.sort(key=attrgetter("ends_at"))
        games.append(global_indef)
    elif criteria['endTimeDescending']:
        games.sort(key=attrgetter("ends_at"), reverse=True)
        games.insert(0, global_indef)
    else:
        games.insert(0, global_indef)

    first_index_in_page = (page_number - 1) * PAGE_SIZE
    games = games[first_index_in_page: first_index_in_page + PAGE_SIZE]

    return games, total_games, PAGE_SIZE

