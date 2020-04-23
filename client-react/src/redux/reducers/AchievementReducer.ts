import { Type } from '../actions/Types'

export type State = typeof initialState;
const initialState = {
  achievements: [],
  achievementProfile: [],
  goals: [],
  goalProfile: [],
}

export type Action = {
  type: Type;
  payload?: any;
}

export type Achievement = {
  name: string;
  description: string;
}

export type AchievementProfile = {
  achievement: Achievement;
  achievedAt: Date;
}

export type Goal = {
  name: string;
  description: string;
}

export type GoalProfile = {
  goal: Goal;
  achievedAt: Date;
}

export type AchievementState = {
  achievements: Array<Achievement>;
  achievementProfile: Array<AchievementProfile>;
  goals: Array<Goal>;
  goalProfile: Array<GoalProfile>
}

export default (state = initialState, action: Action) => {
  switch (action.type) {
    case Type.SET_ACHIEVEMENTS:
      return {
        ...state,
        achievements: action.payload,
      }
    case Type.SET_ACHIEVEMENT_PROFILE:
      return {
        ...state,
        achievementProfile: action.payload,
      }
    case Type.SET_GOALS:
      return {
        ...state,
        goals: action.payload,
      }
    case Type.SET_GOAL_PROFILE:
      return {
        ...state,
        goalProfile: action.payload,
      }
    default:
      return state
  }
}
