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


class WarningRequest(BaseSerializer):
    message = fields.Str(required=True)


class User(BaseSerializer):
    id = fields.Int(required=True)
    username = fields.Str(required=True)


class UsersResponse(BaseSerializer):
    users = fields.List(fields.Nested(User))


