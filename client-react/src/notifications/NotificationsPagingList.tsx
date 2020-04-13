import React from 'react'
import { connect } from 'react-redux'
import Actions from '../redux/actions'
import { Pagination, ListGroup } from 'react-bootstrap';
import { Notification } from '../redux/reducers/NotificationsReducer'
import { RootState } from '../redux/reducers';

interface NotificationsPagingListProps {
    notifications: Array<Notification>;
}

interface NotificationsPagingListState {
    page: number;
}

class NotificationsPagingList extends React.Component<NotificationsPagingListProps, NotificationsPagingListState> {

    constructor(props: NotificationsPagingListProps) {
        super(props);
        this.state = {
            page: 0
        }
    }

    renderPaginationItems() {
        const paginationItems = [];
        for (let i = 0; i < this.props.notifications.length / 16; i++) {
            paginationItems.push(<Pagination.Item key={i} active={this.state.page === i}>{i+1}</Pagination.Item>)
        }
        return paginationItems;
    }

    renderNotifications() {
        return this.props.notifications.map((notif) => {
            return <ListGroup.Item><div key={notif.id}>{notif.content}</div></ListGroup.Item>
        })
    }

    render() {
        return (
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <ListGroup>
                    {this.renderNotifications()}
                </ListGroup>
                <Pagination style={{margin: '30px 0 30px 0'}}>
                    {this.renderPaginationItems()}
                </Pagination>
            </div>
        )
    }
}

export default connect((state: RootState) => ({
    notifications: state.notifications.notifications,
}), {
    getNotifications: Actions.notifications.getNotifications,
})(NotificationsPagingList)