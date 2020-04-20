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


####
# this code is taken from
# https://marshmallow.readthedocs.io/en/latest/examples.html#inflection-camel-casing-keys
####

def camelcase(s):
    parts = iter(s.split("_"))
    return next(parts) + "".join(i.title() for i in parts)


class CamelCaseSerializer(BaseSerializer):
    """Schema that uses camel-case for its external representation
    and snake-case for its internal representation.
    """

    def on_bind_field(self, field_name, field_obj):
        field_obj.data_key = camelcase(field_obj.data_key or field_name)

####

class NotificationSerializer(CamelCaseSerializer):
    id = fields.Int()
    content = fields.Str()
    created_at = fields.DateTime()

class PagedNotificationResponse(CamelCaseSerializer):
    page = fields.Int()
    pages = fields.Int()
    notifications = fields.List(fields.Nested(NotificationSerializer))


class CreatePriceAlertRequestSerializer(CamelCaseSerializer):
    strike_price = fields.Decimal(required=True, as_string=True)
    coin_id = fields.Int(required=True)
    type = fields.Str(required=True)


class PriceAlertSerializer(CamelCaseSerializer):
    id = fields.Int()
    created_at = fields.DateTime()
    above = fields.Boolean()
    coin_id = fields.Int()
    strike_price = fields.Decimal(as_string=True)
    hit = fields.Boolean()
