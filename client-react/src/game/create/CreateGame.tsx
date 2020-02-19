import * as React from 'react';
import { Button, Form } from 'react-bootstrap';

export default class CreateGame extends React.Component {
    constructor(props: any) {
        super(props);
    }

    private submitForm = (event: any) => {
        event.preventDefault();
        console.log(event.currentTarget);
      };

    render() {
        return (
            <Form onSubmit={this.submitForm}>
                <Form.Label>Create Game</Form.Label>
                <Form.Group controlId="formBasicTitle">
                    <Form.Label>Title</Form.Label>
                    <Form.Control type="text" placeholder="Enter game title" />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        )
    }
}