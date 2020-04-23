import React from 'react'
import { RootState } from '../redux/reducers';
import { Table } from 'react-bootstrap';
import Actions from '../redux/actions';
import { connect } from 'react-redux';
import { Achievement, AchievementProfile } from '../redux/reducers/AchievementReducer';

interface AchievementsProps {
    getAchievements: () => void;
    getAchievementProfile: () => void;
    achievements: Array<Achievement>;
    achievementProfile: Array<AchievementProfile>;
}

interface myAchievements {
    achievement: Achievement;
    achieved?: string;
}

class Achievements extends React.Component<AchievementsProps> {

    componentDidMount() {
        this.props.getAchievements();
        this.props.getAchievementProfile();
    }

    render() {
        // determine which achievements the player has
        const myAchievements: Array<myAchievements> = [];
        outerLoop:
        for (let i = 0; i < this.props.achievements.length; i++) {
            const achievement = this.props.achievements[i];
            for (let j = 0; j < this.props.achievementProfile.length; j++) {
                const profile = this.props.achievementProfile[j];
                if (achievement.name === profile.achievement.name) {
                    // player has current achievement
                    const myAchievement = {achievement: achievement, achieved: 'Yes'};
                    myAchievements.push(myAchievement);
                    continue outerLoop;
                }
            }
            // player does not have the current achievement
            const myAchievement = {achievement: achievement, achieved: 'No'};
            myAchievements.push(myAchievement);
        }

        return (
            <div>
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
            </div>
        )
    }
}

const mapStateToProps = (state: RootState) => ({
    achievements: state.achievement.achievements,
    achievementProfile: state.achievement.achievementProfile,
})

const mapDispatchToProps = {
    getAchievements: Actions.achievements.getAchievements,
    getAchievementProfile: Actions.achievements.getAchievementProfile,
}

export default connect(mapStateToProps, mapDispatchToProps)(Achievements);