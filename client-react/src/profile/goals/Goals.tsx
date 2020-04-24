import React from 'react'
import { RootState } from '../../redux/reducers';
import { Table } from 'react-bootstrap';
import Actions from '../../redux/actions';
import { connect } from 'react-redux';
import { Goal, GoalProfile } from '../../redux/reducers/AchievementReducer';

interface GoalsProps {
    getGoals: () => void;
    getGoalProfile: () => void;
    goals: Array<Goal>;
    goalProfile: Array<GoalProfile>;
}


interface myGoals {
    goal: Goal;
    achieved?: string;
}

class Goals extends React.Component<GoalsProps> {

    componentDidMount() {
        this.props.getGoals();
        this.props.getGoalProfile();
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
            const myGoals = this.getMyGoals();

            return (
                <div>
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
        goals: state.achievement.goals,
        goalProfile: state.achievement.goalProfile,
    })

    const mapDispatchToProps = {
        getGoals: Actions.achievements.getGoals,
        getGoalProfile: Actions.achievements.getGoalProfile,
    }

    export default connect(mapStateToProps, mapDispatchToProps)(Goals);