import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import { RootState } from '../redux/reducers';
import Actions from '../redux/actions';
import { connect } from 'react-redux';

interface OptionsProps {
    changeUsername: (username: string) => void;
    changePassword: (oldPassword: string, newPassword: string) => void;
    usernameError: string;
    passwordSuccess: string;
    passwordError: string;
}

interface OptionsState {
    [key: string]: any;
    newUsername: string;
    oldPassword: string;
    newPassword: string;
}

class Options extends Component<OptionsProps, OptionsState> {
    constructor(props: OptionsProps) {
        super(props);
        
        this.state = {
            newUsername: '',
            oldPassword: '',
            newPassword: '',
        }
    }

    private handleChange = (event: any) => {
        this.setState({ [event.currentTarget.name]: event.currentTarget.value.trim() });
    }

    private changeUsername = (event: any) => {
        event.preventDefault();
        this.props.changeUsername(this.state.newUsername);
        this.setState({ newUsername: '' });
    }

    private changePassword = (event: any) => {
        event.preventDefault();
        this.props.changePassword(this.state.oldPassword, this.state.newPassword);
        this.setState({
            oldPassword: '',
            newPassword: '',
        });
    }

    render() {
        return (
            <div style={{ padding: 10 }}>
                <h4>Options</h4>
                <hr />
                <p style={{color: 'red'}}>{this.props.usernameError}</p>
                <Form onSubmit={this.changeUsername}>
                    <Form.Row>
                        <Form.Group controlId="newUsername" className="col-md-6">
                            <Form.Control
                                type="username"
                                placeholder="New username"
                                name="newUsername"
                                value={this.state.newUsername}
                                onChange={this.handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="col-md-6">
                            <Button variant="primary" type="submit">
                                Change Username
                            </Button>
                        </Form.Group>
                    </Form.Row>
                </Form>
                <hr />
                <p style={{color: 'green'}}>{this.props.passwordSuccess}</p>
                <p style={{color: 'red'}}>{this.props.passwordError}</p>
                <Form onSubmit={this.changePassword}>
                    <Form.Row>
                        <Form.Group controlId="oldPassword" className="col-md-6">
                            <Form.Control
                                type="password"
                                placeholder="Old password"
                                name="oldPassword"
                                value={this.state.oldPassword}
                                onChange={this.handleChange}
                            />
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group controlId="newPassword" className="col-md-6">
                            <Form.Control
                                type="password"
                                placeholder="New password"
                                name="newPassword"
                                value={this.state.newPassword}
                                onChange={this.handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="col-md-6">
                            <Button variant="primary" type="submit">
                                Change Password
                            </Button>
                        </Form.Group>
                    </Form.Row>
                </Form>
            </div>
        )
    }
}

const mapStateToProps = (state: RootState) => ({
    usernameError: state.auth.usernameErrorMessage,
    passwordError: state.auth.passwordErrorMessage,
    passwordSuccess: state.auth.passwordSuccessMessage,
})
const mapDispatchToProps = {
    changeUsername: Actions.auth.changeUsername,
    changePassword: Actions.auth.changePassword,
}

export default connect(mapStateToProps, mapDispatchToProps)(Options);