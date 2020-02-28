import * as React from 'react';
import {Form, Button} from 'react-bootstrap';
import { RootState } from '../redux/reducers';
import Actions from '../redux/actions';
import { connect } from 'react-redux';

interface RegisterProps {
  register: (
    username: string,
    password: string,
  ) => void;
}

interface RegisterState {
  [key: string]: any;
  username: string;
  password: string;
  confirmPassword: string,
}

class Register extends React.Component<RegisterProps, RegisterState> {

  constructor(props: RegisterProps){
    super(props);

    this.state = {
      username: '',
      password: '',
      confirmPassword: '',
    }
  }
  private submitForm = (event: any) => {
    event.preventDefault()
    this.props.register(this.state.username, this.state.password)
  }
  private onChange = (event: any) => {
    this.setState({
        [event.currentTarget.name]: event.currentTarget.value
      })
  }

    render() {
        return (
          <Form onSubmit={this.submitForm}>
          <h1>Register</h1>
            <Form.Group controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control name="username" type="username" placeholder="Username" value={this.state.username} onChange={this.onChange} />
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control name="password" type="password" placeholder="Password" />
            </Form.Group>
            <Form.Group controlId="confirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control name="confirmPassword" type="password" placeholder="Confirm Password" />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        )
    }
}

const mapStateToProps = (state: RootState) => ({
  state
})

const mapDispatchToProps = {
    register: Actions.auth.register
}
export default connect(mapStateToProps, mapDispatchToProps)(Register);
