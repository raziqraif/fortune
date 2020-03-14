from marshmallow import Schema, fields, validate


class BaseSerializer(Schema):
    @classmethod
    def serialize(cls, obj, many=False):
        """
        Shortcut method for using a serializer to serialize a Python object
        to a Python dictionary
        """
        return cls().dump(obj, many=many)

    @classmethod
    def deserialize(cls, obj, many=False):
        """
        Shortcut method for using a serializer to deserialize data
        """
        return cls().load(obj, many=many)


title_length_validator = validate.Length(min=4, max=63)
class GameCreateRequest(BaseSerializer):
    activeCoins = fields.List(fields.Dict(), required=True)
    endsOn = fields.DateTime(required=True)
    startingCash = fields.Decimal(required=True, as_string=True)
    title = fields.Str(required=True, validate=title_length_validator)

class GetCoinsRequest(BaseSerializer):
    timeSpan = fields.Int(required=True)
    sortBy = fields.Int(required=True)
    # sortByNameAscending = fields.Boolean()
    # sortByPriceDescending = fields.Boolean()
    # sortByPercentChangeDescending = fields.Boolean()
    # sortByYourAmountDescending = fields.Boolean()
    numPerPage = fields.Int()
    pageNum = fields.Int()

class GameResponse(BaseSerializer):
    id = fields.Int(required=True)
    name = fields.Str(required=True)
    starting_cash = fields.Decimal(required=True, as_string=True)
    shareable_link = fields.Str(required=True)
    shareable_code = fields.Str(required=True)
    ends_at = fields.DateTime(required=True)


class CoinsResponse(BaseSerializer):
    id = fields.Int(required=True)
    name = fields.Str(required=True)
    symbol = fields.Str(required=True)

class GameCoinsResponse(CoinsResponse):
    number = fields.Decimal(required=True, as_string=True)

class TicketResponse(BaseSerializer):
    price = fields.Decimal()
    captured_at = fields.DateTime()

class CoinAndPrices(BaseSerializer):
    coin = fields.Nested(GameCoinsResponse)
    prices = fields.List(fields.Nested(TicketResponse))

class GetCoinsResponse(BaseSerializer):
    coins_and_prices = fields.List(fields.Nested(CoinAndPrices))

class GetGameResponse(BaseSerializer):
    game = fields.Nested(GameResponse)
    gameProfile = fields.Nested(GameProfileResponse)
    coins = fields.List(fields.Nested(GameCoinsResponse), required=True)