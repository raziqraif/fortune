import React from 'react'
import {
    Button,
    ListGroup,
    Pagination,
    Tab,
    Tabs,
} from 'react-bootstrap'
import { connect } from 'react-redux'
import { RootState } from '../redux/reducers';
import Actions from '../redux/actions'
import { Notification } from '../redux/reducers/NotificationsReducer'
import CreatePriceAlertModal from './CreatePriceAlertModal';
import NotificationsPagingList from './NotificationsPagingList';
import PriceAlertsList from './PriceAlertsList';

interface NotificationsState {
    modalOpen: boolean;
    page: number;
    tab: string;
}

interface NotificationsProps {
    notifications: Array<Notification>;
    authToken: string;
    fetchAuthToken: () => void;
    getNotifications: (page: number) => void;
    getPriceAlerts: () => void;
}

class Notifications extends React.Component<NotificationsProps, NotificationsState> {

    constructor(props: NotificationsProps) {
        super(props);
        this.state = {
            modalOpen: false,
            page: 0,
            tab: 'notifications',
        }
    }

    render() {
        return (
            <>
                <Tabs id='tabs' activeKey={this.state.tab} onSelect={(tab: string) => this.setState({tab})}>
                    <Tab eventKey='notifications' title='Notifications'>
                        <CreatePriceAlertModal open={this.state.modalOpen} close={() => this.setState({modalOpen: false})}/>
                        <h1>Notifications</h1>
                        <Button style={{margin: '30px 0 30px 0'}} onClick={() => this.props.getNotifications(this.state.page)}>Refresh</Button>
                        <NotificationsPagingList/>
                    </Tab>
                    <Tab eventKey='alerts' title='Price Alerts'>
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <Button onClick={() => this.setState({modalOpen: true})}>Create price alert</Button>
                            <Button onClick={() => this.props.getPriceAlerts()}>Refresh</Button>
                        </div>
                        <h1>Active Price Alert Subscriptions</h1>
                        <PriceAlertsList/>
                    </Tab>
                </Tabs>
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
    getNotifications: Actions.notifications.getNotifications,
    getPriceAlerts: Actions.notifications.getPriceAlerts,
};
export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
