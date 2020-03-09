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
  error: string;
  loading: boolean;
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
    if(this.state.password !== this.state.confirmPassword) {
      alert("Passwords must be equal.")
    } else {
      this.props.register(this.state.username, this.state.password)
    }

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
              <Form.Control name="password" type="password" value={this.state.password} placeholder="Password" onChange={this.onChange}/>
            </Form.Group>
            <Form.Group controlId="confirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control name="confirmPassword" type="password" value={this.state.confirmPassword} placeholder="Confirm Password" onChange={this.onChange}/>
            </Form.Group>
            <p style={{color: 'red'}}>{this.props.error}</p>
            <Button disabled={this.props.loading} variant="primary" type="submit">
              {this.props.loading ? 'Loading...' : 'Submit'}
            </Button>
          </Form>
        )
    }
}

const mapStateToProps = (state: RootState) => ({
  error: state.auth.registrationErrorMessage,
  loading: state.auth.registrationLoading,
})

const mapDispatchToProps = {
  register: Actions.auth.register,
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);
