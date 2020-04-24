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
  listErrorMessage: string;
  friendsList: Array<Friend>;
}

class FriendsList extends Component<FriendsListProps, FriendsListState>{
  constructor(props) {
    super(props)
    this.state = {
      listErrorMessage: '',
      friendsList: [],
    }
  }
  componentDidMount(){
    this.props.getFriendsList(this.props.username)
  }

  private createItems() {
    var items = [];
    if(this.props.friendsList.friendsList) {
      var index = 0
      this.props.friendsList.friendsList.forEach(friend => {
        items.push(<FriendsListItem key={index++} friendUsername={friend.username}/>)
      });
    }
    return items;
  }

    render() {
      var list = [];
      if(this.props.friendsList.friendsList && this.props.friendsList.friendsList.length > 0) {
        list =    <ListGroup>
                    {this.createItems()}
                  </ListGroup>
      } else {
        list = <span> This user has no friends! Type a name above to send a request! </span>
      }
        return (
          <div style={{paddingTop: 15}}>
            <h3>Friends:</h3>
            {list}
          </div>

        )
    }
}

const mapStateToProps = (state: RootState) => ({
  username: state.auth.username,
  friendsList: state.friends.friendsList,
  listErrorMessage: state.friends.listErrorMessage,
})

const mapDispatchToProps = {
  getFriendsList: Actions.friends.getFriendsList,
}

export default connect(mapStateToProps, mapDispatchToProps)(FriendsList);
