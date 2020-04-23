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

class TradeRequest(BaseSerializer):
    coinId = fields.Int(required=True, as_string=True)
    coinAmount = fields.Decimal(required=True, as_string=True)

class GameResponse(BaseSerializer):
    id = fields.Int(required=True)
    name = fields.Str(required=True)
    starting_cash = fields.Decimal(required=True, as_string=True)
    shareable_link = fields.Str(required=True)
    shareable_code = fields.Str(required=True)
    ends_at = fields.DateTime(required=True)


class GameProfileResponse(BaseSerializer):
    cash = fields.Decimal(required=True, as_string=True)
    net_worth = fields.Decimal(required=True, as_string=True)

class CoinsResponse(BaseSerializer):
    id = fields.Int(required=True)
    name = fields.Str(required=True)
    symbol = fields.Str(required=True)


class GameCoinsResponse(CoinsResponse):
    number = fields.Decimal(required=True, as_string=True)


class TickerResponse(BaseSerializer):
    price = fields.Decimal(as_string=True)
    captured_at = fields.DateTime()
    price_change_day_pct = fields.Decimal(as_string=True)


class CoinAndPrices(BaseSerializer):
    coin = fields.Nested(GameCoinsResponse)
    prices = fields.List(fields.Nested(TickerResponse))


class GetCoinsResponse(BaseSerializer):
    coins_and_prices = fields.List(fields.Nested(CoinAndPrices))


class GetGameResponse(BaseSerializer):
    game = fields.Nested(GameResponse)
    gameProfile = fields.Nested(GameProfileResponse)

class Cash(BaseSerializer):
    cash = fields.Decimal(required=True, as_string=True)

class TradeResponse(BaseSerializer):
    new_amount = fields.Decimal(required=True, as_string=True)
    new_cash = fields.Decimal(required=True, as_string=True)