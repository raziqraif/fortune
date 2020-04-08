import React from 'react'
import {
    Button,
    ListGroup,
    Modal,
} from 'react-bootstrap'
import { connect } from 'react-redux'
import { RootState } from '../redux/reducers';
import Actions from '../redux/actions'
import { Notification } from '../redux/reducers/NotificationsReducer'
import CreatePriceAlertForm from './CreatePriceAlertForm';

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
                <Modal centered size='lg' show={this.state.modalOpen} onHide={() => this.setState({modalOpen: false})}>
                    <Modal.Header closeButton>
                        <Modal.Title>Create Price Alert</Modal.Title>
                    </Modal.Header>
                    {/* <MSFIDOCredentialAssertion */}
                    <Modal.Body>
                        <CreatePriceAlertForm onClose={() => this.setState({modalOpen: false})}/>
                    </Modal.Body>
                </Modal>
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
