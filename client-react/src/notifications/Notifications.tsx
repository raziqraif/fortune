import React from 'react'
import {
    ListGroup,
} from 'react-bootstrap'
import { connect } from 'react-redux'
import { RootState } from '../redux/reducers';
import Actions from '../redux/actions'
import { push } from 'connected-react-router';

interface NotificationsProps {
    notifications: Array<Notification>,
}

class Notifications extends React.Component<NotificationsProps> {
    render() {
        return (
            <ListGroup>
                <ListGroup.Item>Hi</ListGroup.Item>
            </ListGroup>
        )
    }
}

const mapStateToProps = (state: RootState) => ({
    loggedIn: state.auth.loggedIn,
    authToken: state.auth.authToken,
})
const mapDispatchToProps = (dispatch: any) => ({
    logout: () => dispatch(Actions.auth.logout()),
    navigateTo: (location: string) => dispatch(push(location)),
    fetchAuthToken: () => dispatch(Actions.auth.fetchAuthToken()),
})
export default connect(mapStateToProps, mapDispatchToProps)(Notifications)
