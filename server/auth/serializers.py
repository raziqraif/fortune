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


username_length_validator = validate.Length(min=5, max=63)
password_length_validator = validate.Length(min=5, max=63)
class LoginRequestSerializer(BaseSerializer):
    username = fields.Str(required=True, validate=username_length_validator)
    password = fields.Str(required=True, validate=password_length_validator)

class ChangeUsername(BaseSerializer):
    username = fields.Str(required=True, validate=username_length_validator)

class ChangePassword(BaseSerializer):
    oldPassword = fields.Str(required=True, validate=password_length_validator)
    newPassword = fields.Str(required=True, validate=password_length_validator)

class AuthTokenSerializer(BaseSerializer):
    issued_at = fields.DateTime(required=True)
    token = fields.Str(required=True)

class VerifyResponseSerializer(BaseSerializer):
    id = fields.Int()
    username = fields.Str()