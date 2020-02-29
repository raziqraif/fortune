import * as React from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import { RootState } from '../redux/reducers';
import Actions from '../redux/actions';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

interface LoginProps {
    login: (
        username: string,
        password: string,
    ) => void;
    error: string;
    loading: boolean;
}

interface LoginState {
    [key: string]: any;
    username: string;
    password: string;
    toRegister: boolean;
}

class Login extends React.Component<LoginProps, LoginState> {
    constructor(props: LoginProps) {
        super(props);

        this.state = {
            username: '',
            password: '',
            toRegister: false,
        }
    }


    private login = (event: any) => {
        event.preventDefault();
        this.props.login(this.state.username, this.state.password);
    }

    private navigateToRegister = () => {
        this.setState({ toRegister: true });
    }

    private handleChange = (event: any) => {
        this.setState({ [event.currentTarget.name]: event.currentTarget.value });
    };

    render() {
        if (this.state.toRegister) {
            return <Redirect to='/register' />
        }
        return (
            <Form onSubmit={this.login} >
                <h1>Login</h1>
                <Form.Row>
                    <Form.Group controlId="username" className="col-sm-12">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="username" placeholder="Enter username" name="username" value={this.state.username} onChange={this.handleChange}/>
                    </Form.Group>
                    <Form.Group controlId="cash" className="col-sm-12">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Enter password" name="password" value={this.state.password} onChange={this.handleChange}/>
                    </Form.Group>
                </Form.Row>
                <Form.Control.Feedback type='invalid'>
                </Form.Control.Feedback>
                <p style={{color: 'red'}}>{this.props.error}</p>
                <Form.Row>
                    <Col>
                        <Button disabled={this.props.loading} variant="primary" type="submit">
                            {this.props.loading ? 'Loading...' : 'Login'}
                        </Button>
                    </Col>
                    <Col className="text-right">
                        <Button variant="secondary" onClick={this.navigateToRegister}>
                            Register
                        </Button>
                    </Col>
                </Form.Row>
            </Form>
        )
    }
}

const mapStateToProps = (state: RootState) => ({
    allCoins: state.coins.coins,
    error: state.auth.loginErrorMessage,
    loading: state.auth.loginLoading,
})
const mapDispatchToProps = {
    login: Actions.auth.login,
}
export default connect(mapStateToProps, mapDispatchToProps)(Login);