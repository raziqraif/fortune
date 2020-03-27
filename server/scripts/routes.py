from flask import Blueprint, jsonify
from flask_socketio import SocketIO, send, emit

from db import Tickers
from .serializers import HistoricalTickersResponse
from .services import get_tickers_from_date

tickers_bp = Blueprint('tickers', __name__, url_prefix='/tickers')

@tickers_bp.routh('/<past_date>', methods=['GET'])
def get(past_date):
    tickers = get_tickers_from_date(past_date)
    return jsonify(HistoricalTickersResponse.serialize({
        'tickers': tickers
    }))
