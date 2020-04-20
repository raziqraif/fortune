import React from 'react'
import { RootState } from '../redux/reducers';
import { Container } from 'react-bootstrap';
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
    }

    render() {
        console.log('bet: ', this.props.achievements)
        return (
            <div>
                Achievements
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