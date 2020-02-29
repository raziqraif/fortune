from marshmallow import Schema, fields, validate


class BaseSerializer(Schema):
    @classmethod
    def serialize(cls, obj, many=False):
        """
        Shortcut method for using a serializer to serialize a Python object
        to a Python dictionary
        """
        return cls().dump(obj, many=many).data

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


class CreateGameResponse(BaseSerializer):
    name = fields.Str(required=True)
    starting_cash = fields.Decimal(required=True)
    shareable_link = fields.Str(required=True)
    shareable_code = fields.Str(required=True)
    ends_at = fields.DateTime(required=True)
