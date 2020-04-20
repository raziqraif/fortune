import React, { Component } from 'react';
import {InputGroup, Button, FormControl, ListGroup} from 'react-bootstrap';

class Friends extends Component {

    render() {
        return (
            <div style={{paddingTop: 15}}>
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Add by Username"
              />
              <InputGroup.Append>
                <Button>Send Request</Button>
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