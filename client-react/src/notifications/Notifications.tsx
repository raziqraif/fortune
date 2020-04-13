import React from 'react'
import {
    Button,
    ListGroup,
    Pagination,
} from 'react-bootstrap'
import { connect } from 'react-redux'
import { RootState } from '../redux/reducers';
import Actions from '../redux/actions'
import { Notification } from '../redux/reducers/NotificationsReducer'
import CreatePriceAlertModal from './CreatePriceAlertModal';
import NotificationsPagingList from './NotificationsPagingList';

interface NotificationsState {
    modalOpen: boolean;
    page: number;
}

interface NotificationsProps {
    notifications: Array<Notification>;
    authToken: string;
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

    render() {
        return (
            <>
                <CreatePriceAlertModal open={this.state.modalOpen} close={() => this.setState({modalOpen: false})}/>
                <h1>Notifications</h1>
                <Button style={{margin: '30px 0 30px 0'}} onClick={() => this.setState({modalOpen: true})}>Create price alert</Button>
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
    fetchAuthToken: Actions.auth.fetchAuthToken,
};
export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
