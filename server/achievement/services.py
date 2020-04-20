from werkzeug.exceptions import BadRequest
from db import db, Achievement, AchievementProfile, Profile

@db.atomic()
def get_achievement_profile_by_profile_id(profile_id):
    achievementProfile = AchievementProfile.select().join(Profile).where(Profile.id == profile_id)

    # if a user exists, but has no achievements, achievement profile will be None, so come back to this
    # if not achievementProfile:
    #     raise BadRequest('User does not exist')

    return achievementProfile

@db.atomic()
def get_achievement_by_achievement_id(achievement_id):
    achievement = Achievement.get_or_none(Achievement.id == achievement_id)
    if achievement is None:
        raise BadRequest('No such achievement')

    return achievement

@db.atomic()
def add_achievement_by_achievement_id_and_profile_id(achievement_id, profile_id):
    achievement = get_achievement_by_achievement_id(achievement_id)

    #TODO - figure out way to skip this if player has already gotten it
    AchievementProfile.create(profile=profile_id, achievement=achievement)

@db.atomic()
def get_achievements():
    print('bae')
    achi = Achievement.get()
    # for a in achi:
    # print(a.name)
    return achi