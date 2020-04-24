import React, { Component } from 'react';
import {Button, ListGroup, ButtonGroup} from 'react-bootstrap';
import { RootState } from '../../redux/reducers';
import Actions from '../../redux/actions';
import { connect } from 'react-redux';

interface FriendsListItemProps {
  friendUsername: string;
  username?: string;
}

interface FriendsListItemState {
  username: string;
}

class FriendsListItem extends Component<FriendsListItemProps> {

  private acceptRequest(requester_name, requestee_name) {
    this.props.acceptFriendRequest(requester_name, requestee_name, 1)
  }
    render() {
        return (
          <ListGroup.Item>
          {this.props.friendUsername}
          </ListGroup.Item>

        )
    }
}
const mapStateToProps = (state: RootState) => ({
  username: state.auth.username,
})

const mapDispatchToProps = {
  acceptFriendRequest: Actions.friends.acceptFriendRequest,
}

export default connect(mapStateToProps, mapDispatchToProps)(FriendsListItem);