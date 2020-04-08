import React from 'react'
import {
    Button,
    ListGroup,
} from 'react-bootstrap'
import { connect } from 'react-redux'
import { RootState } from '../redux/reducers';
import Actions from '../redux/actions'
import { Notification } from '../redux/reducers/NotificationsReducer'
import CreatePriceAlertModal from './CreatePriceAlertModal';

interface NotificationsState {
    modalOpen: boolean;
}

interface NotificationsProps {
    notifications: Array<Notification>;
    authToken: string;
    getNotifications: () => void;
    fetchAuthToken: () => void;
}

class Notifications extends React.Component<NotificationsProps, NotificationsState> {

    constructor(props: NotificationsProps) {
        super(props);
        this.state = {
            modalOpen: false,
        }
    }

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
            <>
                <CreatePriceAlertModal open={this.state.modalOpen} close={() => this.setState({modalOpen: false})}/>
                <Button variant='success' onClick={() => this.setState({modalOpen: true})}>Create price alert</Button>
                <ListGroup>
                    The notifications:
                    {this.renderNotifications()}
                </ListGroup>
            </>
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
