import React from 'react'
import { RootState } from '../redux/reducers';
import { Table } from 'react-bootstrap';
import Actions from '../redux/actions';
import { connect } from 'react-redux';
import { Achievement, AchievementProfile, Goal, GoalProfile } from '../redux/reducers/AchievementReducer';

interface AchievementsProps {
    getAchievements: () => void;
    getAchievementProfile: () => void;
    getGoals: () => void;
    getGoalProfile: () => void;
    achievements: Array<Achievement>;
    achievementProfile: Array<AchievementProfile>;
    goals: Array<Goal>;
    goalProfile: Array<GoalProfile>;
}

interface myAchievements {
    achievement: Achievement;
    achieved?: string;
}

interface myGoals {
    goal: Goal;
    achieved?: string;
}

class Achievements extends React.Component<AchievementsProps> {

    componentDidMount() {
        this.props.getAchievements();
        this.props.getAchievementProfile();
        this.props.getGoals();
        this.props.getGoalProfile();
    }

    private getMyAchievements = () => {
        // determine which achievements the player has
        const myAchievements: Array<myAchievements> = [];
        outerLoop:
        for (let i = 0; i < this.props.achievements.length; i++) {
            const achievement = this.props.achievements[i];
            for (let j = 0; j < this.props.achievementProfile.length; j++) {
                const profile = this.props.achievementProfile[j];
                if (achievement.name === profile.achievement.name) {
                    // player has current achievement
                    const myAchievement = { achievement: achievement, achieved: 'Yes' };
                    myAchievements.push(myAchievement);
                    continue outerLoop;
                }
            }
            // player does not have the current achievement
            const myAchievement = { achievement: achievement, achieved: 'No' };
            myAchievements.push(myAchievement);
        }
        return myAchievements;
    }

    private getMyGoals = () => {
        // determine which goals the player has
        const myGoals: Array<myGoals> = [];
        outerLoop:
        for (let i = 0; i < this.props.goals.length; i++) {
            const goal = this.props.goals[i];
            for (let j = 0; j < this.props.goalProfile.length; j++) {
                const profile = this.props.goalProfile[j];
                if (goal.name === profile.goal.name) {
                    // player has current goal
                    const myGoal = { goal: goal, achieved: 'Yes' };
                    myGoals.push(myGoal);
                    continue outerLoop;
                }
            }
            // player does not have the current goal
            const myGoal = { goal: goal, achieved: 'No' };
            myGoals.push(myGoal);
        }
        return myGoals;
    }
        render() {
            const myAchievements = this.getMyAchievements();
            const myGoals = this.getMyGoals();

            return (
                <div>
                    <h3>Achievements</h3>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Achieved</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                myAchievements.map((achievement, i) => (
                                    <tr key={i}>
                                        <td>{achievement.achievement.name}</td>
                                        <td>{achievement.achievement.description}</td>
                                        <td>{achievement.achieved}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table>

                    <h3>Weekly Goals</h3>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Achieved</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                myGoals.map((goal, i) => (
                                    <tr key={i}>
                                        <td>{goal.goal.name}</td>
                                        <td>{goal.goal.description}</td>
                                        <td>{goal.achieved}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table>
                </div>
            )
        }
    }

    const mapStateToProps = (state: RootState) => ({
        achievements: state.achievement.achievements,
        achievementProfile: state.achievement.achievementProfile,
        goals: state.achievement.goals,
        goalProfile: state.achievement.goalProfile,
    })

    const mapDispatchToProps = {
        getAchievements: Actions.achievements.getAchievements,
        getAchievementProfile: Actions.achievements.getAchievementProfile,
        getGoals: Actions.achievements.getGoals,
        getGoalProfile: Actions.achievements.getGoalProfile,
    }

    export default connect(mapStateToProps, mapDispatchToProps)(Achievements);