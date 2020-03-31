from flask import Blueprint, jsonify, request, json
from werkzeug.exceptions import BadRequest

from auth.decorators import require_authentication
from .services import get_game_with_code, add_to_game
from .serializers import JoinResponse

join_bp = Blueprint('join', __name__, url_prefix='/join')


@join_bp.route('/', methods=['GET'])
@require_authentication
def join(profile):
    try:
        code = request.args.get('code')
    except:
        raise BadRequest('Invalid parameters')

    code = str(code)

    link = ""
    game = get_game_with_code(code)
    if game:
        add_to_game(profile.id, game)
        link = "/game/" + str(game.id)

    resp = JoinResponse()
    resp.showGameNotFound = game is None
    resp.redirectLink = link

    return JoinResponse.serialize(resp)
