import React from 'react'
import {
    ListGroup,
} from 'react-bootstrap'
import { connect } from 'react-redux'
import { RootState } from '../redux/reducers';
import Actions from '../redux/actions'
import { Notification } from '../redux/reducers/NotificationsReducer'

export interface NotificationsProps {
    notifications: Array<Notification>;
    getNotifications: () => void;
    authToken: string;
    fetchAuthToken: () => void;
}

class Notifications extends React.Component<NotificationsProps> {
    async componentDidMount() {
        await this.props.fetchAuthToken();
        this.props.getNotifications();
    }

    renderNotifications() {
        return this.props.notifications.map(notif => {
            return <div key={notif.id}>{notif.content}</div>
        })
    }

    render() {
        return (
            <ListGroup>
                The notifications:
                {this.renderNotifications()}
            </ListGroup>
        )
    }
}

const mapStateToProps = (state: RootState) => ({
    notifications: state.notifications.notifications,
    authToken: state.auth.authToken,
});
const mapDispatchToProps = {
    getNotifications: Actions.notifications.getNotifications,
    fetchAuthToken: Actions.auth.fetchAuthToken,
};
export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
