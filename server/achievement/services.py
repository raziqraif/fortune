from werkzeug.exceptions import BadRequest
from db import db, Achievement, AchievementProfile, Goal, GoalProfile, Profile

@db.atomic()
def get_achievement_profile_by_profile_id(profile_id):
    achievementProfile = AchievementProfile.select().join(Profile).where(Profile.id == profile_id)
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

# takes starting cash of a game, a player's current net worth, and their profile ID
# and determines if they should be awarded the double net worth achievement
@db.atomic()
def add_double_net_worth_achievement_if_necessary(net_worth, starting_cash, profile_id):
    if net_worth >= 2 * starting_cash:
        add_achievement_by_achievement_id_and_profile_id(1, profile_id)


@db.atomic()
def get_goal_profile_by_profile_id(profile_id):
    goalProfile = GoalProfile.select().join(Profile).where(Profile.id == profile_id)
    return goalProfile

@db.atomic()
def get_goal_by_goal_id(goal_id):
    goal = Goal.get_or_none(Goal.id == goal_id)
    if goal is None:
        raise BadRequest('No such goal')

    return goal

@db.atomic()
def add_goal_by_goal_id_and_profile_id(goal_id, profile_id):
    goal = get_goal_by_goal_id(goal_id)

    #TODO - figure out way to skip this if player has already gotten it
    GoalProfile.create(profile=profile_id, goal=goal)
