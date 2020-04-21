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

class FriendsRequest(BaseSerializer):
    requester = fields.Int()
    requestee = fields.Int()
    status = fields.Int()

class FriendsResponse(BaseSerializer):
    requester = fields.Int()
    requestee = fields.Int()
    status = fields.Int()

