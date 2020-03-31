from marshmallow import Schema, fields, validate

from game.serializers import CoinsResponse

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


class TickersResponse(BaseSerializer):
    id = fields.Int()
    coin = fields.Nested(CoinsResponse)
    price = fields.Decimal(as_string=True)
    captured_at = fields.DateTime()
    price_change_day_pct = fields.Decimal(as_string=True)
