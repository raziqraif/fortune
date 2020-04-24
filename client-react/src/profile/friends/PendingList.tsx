import React, { Component } from 'react';
import {ListGroup} from 'react-bootstrap';
import { RootState } from '../../redux/reducers';
import Actions from '../../redux/actions';
import { connect } from 'react-redux';
import PendingListItem from './PendingListItem'

import Friend from '../../redux/reducers/FriendsReducer'

interface PendingListProps {
  getPending: (username) => void;
  username?: string;
  pendingFriends: Array<Friend>;
}

interface PendingListState {
}

class PendingList extends Component<PendingListProps, PendingListState>{

  componentDidMount(){
    this.props.getPending(this.props.username)
  }

  private createItems() {
    var items = [];
    if(this.props.pendingFriends) {
      var index = 0
      this.props.pendingFriends.forEach(friend => {
        items.push(<PendingListItem key={index++} friendUsername={friend.username}/>)
      });
    }
    return items;
  }

    render() {
        return (
          <div style={{paddingTop: 15}}>
            <h3>Pending:</h3>
            <ListGroup>
            {this.createItems()}
            </ListGroup>
          </div>

        )
    }
}

const mapStateToProps = (state: RootState) => ({
  username: state.auth.username,
  pendingFriends: state.friends.pending,
})

const mapDispatchToProps = {
  getPending: Actions.friends.getPending,
}

export default connect(mapStateToProps, mapDispatchToProps)(PendingList);
