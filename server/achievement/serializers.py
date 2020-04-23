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

# Achievement serializers

class AchievementSerializer(BaseSerializer):
    name = fields.Str(required=True)
    description = fields.Str(required=True)

class Achievements(AchievementSerializer):
    achievements: fields.List(fields.Nested(AchievementSerializer))

class AchievementProfileAchievement(AchievementSerializer):
    achievement = fields.Nested(AchievementSerializer)
    achieved_at = fields.DateTime(required=True)

class AchievementProfile(BaseSerializer):
    achievementProfile = fields.List(fields.Nested(AchievementProfileAchievement))

# Goal serializers

class GoalSerializer(BaseSerializer):
    name = fields.Str(required=True)
    description = fields.Str(required=True)

class Goals(GoalSerializer):
    goals: fields.List(fields.Nested(GoalSerializer))

class GoalProfileGoal(GoalSerializer):
    goal = fields.Nested(GoalSerializer)
    achieved_at = fields.DateTime(required=True)

class GoalProfile(BaseSerializer):
    goalProfile = fields.List(fields.Nested(GoalProfileGoal))
