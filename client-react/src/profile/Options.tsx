import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import { RootState } from '../redux/reducers';
import Actions from '../redux/actions';
import { connect } from 'react-redux';

interface OptionsProps {
    changeUsername: (username: string) => void;
    error: string;
}

interface OptionsState {
    [key: string]: any;
    newUsername: string;
}

class Options extends Component<OptionsProps, OptionsState> {
    constructor(props: OptionsProps) {
        super(props);
        
        this.state = {
            newUsername: ''
        }
    }

    private handleChange = (event: any) => {
        this.setState({ [event.currentTarget.name]: event.currentTarget.value.trim() });
    }

    private changeUsername = (event: any) => {
        event.preventDefault();
        this.props.changeUsername(this.state.newUsername);
    }

    render() {
        return (
            <div style={{ padding: 10 }}>
                <h4>Options</h4>
                <p style={{color: 'red'}}>{this.props.error}</p>
                <Form onSubmit={this.changeUsername}>
                    <Form.Row>
                        <Form.Group controlId="newUsername" className="col-sm-6">
                            <Form.Control
                                type="username"
                                placeholder="New username"
                                name="newUsername"
                                value={this.state.newUsername}
                                onChange={this.handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="col-sm-6">
                            <Button variant="primary" type="submit">
                                Change Username
                            </Button>
                        </Form.Group>
                    </Form.Row>
                </Form>
            </div>
        )
    }
}

const mapStateToProps = (state: RootState) => ({
    error: state.auth.optionsErrorMessage,
})
const mapDispatchToProps = {
    changeUsername: Actions.auth.changeUsername
}

export default connect(mapStateToProps, mapDispatchToProps)(Options);