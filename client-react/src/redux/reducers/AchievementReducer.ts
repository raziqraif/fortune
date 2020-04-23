import { Type } from '../actions/Types'

export type State = typeof initialState;
const initialState = {
  achievements: [],
  achievementProfile: []
}

export type Achievement = {
    name: string;
    description: string;
}

export type AchievementState = {
    achievements: Array<Achievement>;
    achievementProfile: Array<AchievementProfile>;
}

export type AchievementProfile = {
    achievement: Achievement;
    achievedAt: Date;
}

export type Action = {
  type: Type;
  payload?: any;
}

export default (state = initialState, action: Action) => {
  switch (action.type) {
    case Type.SET_ACHIEVEMENTS:
      return {
        ...state,
        achievements:action.payload,
      }
    case Type.SET_ACHIEVEMENT_PROFILE:
      return {
        ...state,
        achievementProfile: action.payload,
      }
    default:
      return state
  }
}
