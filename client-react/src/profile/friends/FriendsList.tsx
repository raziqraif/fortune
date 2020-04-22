import React, { Component } from 'react';
import {ListGroup} from 'react-bootstrap';
import { RootState } from '../../redux/reducers';
import Actions from '../../redux/actions';
import { connect } from 'react-redux';
import FriendsListItem from './FriendsListItem'

import Friend from '../../redux/reducers/FriendsReducer'

interface FriendsListProps {
  getFriendsList: (username) => void;
  username?: string;
  friendsList: Array<Friend>;
}

interface FriendsListState {
}

class FriendsList extends Component<FriendsListProps, FriendsListState>{

  componentDidMount(){
    this.props.getFriendsList(this.props.username)
  }

  private createItems() {
    var items = [];
    if(this.props.friendsList) {
      var index = 0
      this.props.friendsList.forEach(friend => {
        items.push(<FriendsListItem key={index++} friendUsername={friend.username}/>)
      });
    }
    return items;
  }

    render() {
        return (
          <div style={{paddingTop: 15}}>
            <h3>Friends:</h3>
            <ListGroup>
            {this.createItems()}
            </ListGroup>
          </div>

        )
    }
}

const mapStateToProps = (state: RootState) => ({
  username: state.auth.username,
  friendsList: state.friends.friendsList,
})

const mapDispatchToProps = {
  getFriendsList: Actions.friends.getFriendsList,
}

export default connect(mapStateToProps, mapDispatchToProps)(FriendsList);
