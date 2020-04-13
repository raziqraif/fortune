from flask import Blueprint, jsonify, request, json
from werkzeug.exceptions import BadRequest

from auth.decorators import require_authentication
from play.serializers import SortCriteria, GameResponse, PlayResponse
from play.services import active_games_at_page

play_bp = Blueprint('play', __name__, url_prefix='/play')


@play_bp.route('/', methods=['GET'])
@require_authentication
def play(profile):

    try:
        keyword = request.args.get('keyword')
        sort_criteria = request.args.get('criteria')
        page_number = request.args.get('page')
    except:
        raise BadRequest('Invalid parameters')

    try:
        page_number = int(page_number)
        keyword = str(keyword)
        sort_criteria = json.loads(sort_criteria)  # Convert string to dict
        sort_criteria = SortCriteria.deserialize(sort_criteria)  # Make sure that all required attributes are present
        # and no additional attributes are passed
    except:
        raise BadRequest('Invalid parameter format')

    print("page number arg: ", page_number)

    try:
        game_entries, total_games, page_size = active_games_at_page(profile.id, page_number, keyword, sort_criteria)
    except:
        raise BadRequest("Asynchronous query underway")
    games = []
    for entry in game_entries:
        game = GameResponse()
        game.title = entry.name
        game.link = "/game/" + str(entry.id)
        game.endTime = entry.ends_at
        games.append(game)

    resp = PlayResponse()
    resp.games = games
    resp.pageSize = page_size
    resp.totalGames = total_games

    return jsonify(PlayResponse.serialize(resp))
