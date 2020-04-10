from marshmallow import Schema, fields


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


class SortCriteria(BaseSerializer):
    titleAscending = fields.Bool(required=True)
    titleDescending = fields.Bool(required=True)
    endTimeAscending = fields.Bool(required=True)
    endTimeDescending = fields.Bool(required=True)


class GameResponse(BaseSerializer):
    title = fields.Str(required=True)
    endTime = fields.DateTime(required=True)
    link = fields.Str(required=True)


class PlayResponse(BaseSerializer):
    games = fields.List(fields.Nested(GameResponse), required=True)
    totalGames = fields.Int(required=True)
    pageSize = fields.Int(required=True)
