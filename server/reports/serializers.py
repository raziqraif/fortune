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


class CreateReport(BaseSerializer):
    gameID = fields.Int(required=True)
    offenderID = fields.Int(required=True)
    flaggedMessage = fields.Str(required=True)


class UpdateReport(BaseSerializer):
    userAction = fields.Str(required=True)
    message = fields.Str(required=True)


class Profile(BaseSerializer):
    id = fields.Int(required=True)
    username = fields.Str(required=True)


class Game(BaseSerializer):
    id = fields.Int(required=True)
    title = fields.Str(required=True)


class Report(BaseSerializer):
    id = fields.Int(required=True)
    createdAt = fields.DateTime(required=True)
    game = fields.Nested(Game, required=True)
    issuer = fields.Nested(Profile, required=True)
    offender = fields.Nested(Profile, required=True)
    flaggedMessage = fields.Str(required=True)
    resolved = fields.Bool(required=True)
    takenAction = fields.Str(required=True)


class ReportsResponse(BaseSerializer):
    reports = fields.List(fields.Nested(Report, required=True))
    totalItems = fields.Int(required=True)
