import React, { Component } from 'react';
import {InputGroup, Button, FormControl, ListGroup} from 'react-bootstrap';

interface FriendsState {
  username: string;
}

class Friends extends Component {

constructor(props){
  super(props)
  this.state = {
    username: '',
  }
}

private sendRequest = () => {
  console.log('fren pls', this.state.username)
}

private handleChange = (event: any) => {
  this.setState({
      [event.currentTarget.name]: event.currentTarget.value
    })
}

    render() {
        return (
            <div style={{paddingTop: 15}}>
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Add by Username"
                name="username"
                value={this.state.username}
                onChange={this.handleChange}
              />
              <InputGroup.Append>
                <Button onClick={this.sendRequest}>Send Request</Button>
              </InputGroup.Append>
            </InputGroup>

              <div style={{paddingTop: 15}}>
                <h3>Pending:</h3>
                <ListGroup>
                  <ListGroup.Item>usrname</ListGroup.Item>
                </ListGroup>
              </div>
              <div style={{paddingTop: 15}}>
                <h3>Friends:</h3>
                <ListGroup>
                  <ListGroup.Item>usrname</ListGroup.Item>
                </ListGroup>
              </div>
            </div>

        )
    }
}

export default Friends;