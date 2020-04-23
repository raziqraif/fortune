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

class Friend(BaseSerializer):
    username = fields.Str()

class FriendsSerializer(BaseSerializer):
    requester = fields.Str()
    requestee = fields.Str()
    status = fields.Int()

class FriendsList(BaseSerializer):
    friendsList = fields.List(fields.Nested(Friend))

class PendingList(BaseSerializer):
    pending = fields.List(fields.Nested(Friend))
