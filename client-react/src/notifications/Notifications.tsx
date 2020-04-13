import React from 'react'
import {
    Button,
} from 'react-bootstrap'
import { connect } from 'react-redux'
import { RootState } from '../redux/reducers';
import Actions from '../redux/actions'
import CreatePriceAlertModal from './CreatePriceAlertModal';
import NotificationsPagingList from './NotificationsPagingList';

interface NotificationsState {
    modalOpen: boolean;
    page: number;
}

interface NotificationsProps {
    authToken: string;
    getNotifications: () => void;
    fetchAuthToken: () => void;
}

class Notifications extends React.Component<NotificationsProps, NotificationsState> {

    constructor(props: NotificationsProps) {
        super(props);
        this.state = {
            modalOpen: false,
            page: 0,
        }
    }

    async componentDidMount() {
        await this.props.fetchAuthToken();
        this.props.getNotifications();
    }

    render() {
        return (
            <>
                <CreatePriceAlertModal open={this.state.modalOpen} close={() => this.setState({modalOpen: false})}/>
                <Button style={{margin: '30px 0 30px 0'}} onClick={() => this.setState({modalOpen: true})}>Create price alert</Button>
                <h1>Notifications</h1>
                <NotificationsPagingList/>
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
