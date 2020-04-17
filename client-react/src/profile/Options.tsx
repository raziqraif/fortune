import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';

interface OptionsState {
    [key: string]: any;
    newUsername: string;
}

class Options extends Component<{}, OptionsState> {
    constructor(props: {}) {
        super(props);
        
        this.state = {
            newUsername: ''
        }
    }

    private handleChange = (event: any) => {
        this.setState({ [event.currentTarget.name]: event.currentTarget.value });
    }

    private changeUsername = (event: any) => {
        event.preventDefault();
        console.log(this.state.newUsername);
    }

    render() {
        return (
            <div style={{ padding: 10 }}>
                <h4>Options</h4>
                <Form onSubmit={this.changeUsername}>
                    <Form.Row>
                        <Form.Group controlId="newUsername" className="col-sm-6">
                            <Form.Control
                                type="username"
                                placeholder="Change username"
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

export default Options;