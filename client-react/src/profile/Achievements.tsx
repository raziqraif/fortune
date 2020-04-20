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

class Achievements extends React.Component<AchievementsProps> {

    componentDidMount() {
        this.props.getAchievements();
        this.props.getAchievementProfile();
    }

    render() {
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
                            this.props.achievements.map(achievement => (
                                <tr>
                                    <td>{achievement.name}</td>
                                    <td>{achievement.description}</td>
                                    <td>yes</td>
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
    achievementProfile: state.achievement.achievements,
})

const mapDispatchToProps = {
    getAchievements: Actions.achievements.getAchievements,
    getAchievementProfile: Actions.achievements.getAchievementProfile,
}

export default connect(mapStateToProps, mapDispatchToProps)(Achievements);