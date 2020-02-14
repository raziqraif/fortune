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


username_length_validator = validate.Length(min=5, max=63)
password_length_validator = validate.Length(min=5, max=63)
class LoginRequest(BaseSerializer):
    username = fields.Str(required=True, validate=username_length_validator)
    password = fields.Str(required=True, validate=password_length_validator)

