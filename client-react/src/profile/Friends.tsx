import React, { Component } from 'react';
import {InputGroup, Button, FormControl, ListGroup} from 'react-bootstrap';
import { RootState } from '../redux/reducers';
import Actions from '../redux/actions';
import { connect } from 'react-redux';

import PendingList from './friends/PendingList'
import FriendsList from './friends/FriendsList'

interface FriendsProps {
  sendFriendRequest: (requester_name, requestee_name, status) => void;
  acceptFriendRequest: (requester_name, requestee_name, status) => void;
  username?: string;
}

interface FriendsState {
  usernameToFriend: string;
}

class Friends  extends Component<FriendsProps, FriendsState> {

constructor(props){
  super(props)
  this.state = {
    usernameToFriend: '',
  }
}

private sendRequest = () => {
  this.props.sendFriendRequest(this.props.username, this.state.usernameToFriend, 0)
  this.setState({usernameToFriend:'',})
}

private handleChange = (event: any) => {
  this.setState({
      [event.currentTarget.name]: event.currentTarget.value
    })
}
private acceptRequest(requester_name, requestee_name) {
  this.props.acceptFriendRequest(requester_name,requestee_name, 1)
}

    render() {
        return (
            <div style={{paddingTop: 15}}>
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Add by Username"
                name="usernameToFriend"
                value={this.state.usernameToFriend}
                onChange={this.handleChange}
              />
              <InputGroup.Append>
                <Button onClick={this.sendRequest}>Send Request</Button>
              </InputGroup.Append>
            </InputGroup>

            <PendingList/>
            <FriendsList/>
            </div>

        )
    }
}

const mapStateToProps = (state: RootState) => ({
  username: state.auth.username,
})

const mapDispatchToProps = {
  sendFriendRequest: Actions.friends.sendFriendRequest,
  acceptFriendRequest: Actions.friends.acceptFriendRequest,
}

export default connect(mapStateToProps, mapDispatchToProps)(Friends);