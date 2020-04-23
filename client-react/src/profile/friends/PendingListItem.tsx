import React, { Component } from 'react';
import {Button, ListGroup, ButtonGroup} from 'react-bootstrap';
import { RootState } from '../../redux/reducers';
import Actions from '../../redux/actions';
import { connect } from 'react-redux';

interface PendingListItemProps {
  friendUsername: string;
  username?: string;
  getFriendsList: (username) => void;
}

interface PendingListItemState {
  username: string;
  friended: boolean;
}

class PendingListItem extends Component<PendingListItemProps> {
  constructor(props) {
    super(props)
    this.state = {
      friended: false,
    }
  }

  private acceptRequest(requester_name, requestee_name) {
    this.props.acceptFriendRequest(requester_name, requestee_name, 1)
    this.setState({friended: true,})
  }
    render() {
        return (
          <div>
          {
            !this.state.friended &&
          <ListGroup.Item>
          {this.props.friendUsername}
          <ButtonGroup style={{paddingLeft: 25}}>
            <Button onClick={() => this.acceptRequest(this.props.friendUsername, this.props.username)}>Accept</Button>
          </ButtonGroup>
          </ListGroup.Item>
          }
          </div>
        )
    }
}
const mapStateToProps = (state: RootState) => ({
  username: state.auth.username,
})

const mapDispatchToProps = {
  acceptFriendRequest: Actions.friends.acceptFriendRequest,
  getFriendsList: Actions.friends.getFriendsList,
}

export default connect(mapStateToProps, mapDispatchToProps)(PendingListItem);