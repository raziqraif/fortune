import * as React from 'react';
import {Form, Button} from 'react-bootstrap';

export default class Register extends React.Component {

  private submitForm = (event: any) => {
    event.preventDefault()
    //handle registration
  }

    render() {
        return (
          <Form onSubmit={this.submitForm}>
          <h1>Register</h1>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Username</Form.Label>
              <Form.Control type="input" placeholder="Username" />
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" />
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control type="password" placeholder="Confirm Password" />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        )
    }
}
