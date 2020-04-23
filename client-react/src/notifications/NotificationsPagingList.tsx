import React from 'react'
import { connect } from 'react-redux'
import Actions from '../redux/actions'
import { Pagination, ListGroup, Button } from 'react-bootstrap';
import { Notification } from '../redux/reducers/NotificationsReducer'
import { RootState } from '../redux/reducers';

interface NotificationsPagingListProps {
    notifications: Array<Notification>;
    getNotifications: (page: number) => void;
    fetchAuthToken: () => void;
    pages: number
}

interface NotificationsPagingListState {
    page: number;
}

class NotificationsPagingList extends React.Component<NotificationsPagingListProps, NotificationsPagingListState> {

    constructor(props: NotificationsPagingListProps) {
        super(props);
        this.state = {
            page: 1,
        }
    }

    async componentDidMount() {
        await this.props.fetchAuthToken();
        await this.getNotifications()
    }

    changePage(pageNum: number) {
        this.props.getNotifications(pageNum)
        this.setState({page: pageNum})
    }

    renderPaginationItems() {
        const res = [];
        for (let i = 1; i <= this.props.pages; i++) {
            res.push(<Pagination.Item onClick={() => this.changePage(i)} key={i} active={this.state.page === i}>{i}</Pagination.Item>)
        }
        return res
    }

    renderNotifications() {
        return this.props.notifications.map((notif) => {
            return <ListGroup.Item key={notif.id}><div>{notif.content}</div></ListGroup.Item>
        })
    }

    getNotifications() {
        this.props.getNotifications(this.state.page)
    }

    render() {
        return (
            <>
                <ListGroup>
                    {this.renderNotifications()}
                </ListGroup>
                <Pagination style={{margin: '30px 0 30px 0'}}>
                    {this.renderPaginationItems()}
                </Pagination>
            </>
        )
    }
}

export default connect((state: RootState) => ({
    notifications: state.notifications.notifications,
    pages: state.notifications.pages,
}), {
    getNotifications: Actions.notifications.getNotifications,
    fetchAuthToken: Actions.auth.fetchAuthToken,
})(NotificationsPagingList)