import * as React from 'react';
import {Button, ButtonGroup, ButtonToolbar, Col, Container, FormControl, InputGroup, Row} from "react-bootstrap";
import './Play.css'
import {CSSProperties} from "react";

const buttonStyle: CSSProperties = {
    width: 300,
    height: 145,
    fontSize: '120%',
    lineHeight: "620%",
};

export default class Play extends React.Component {
    showJoinModal() {
        console.log("Clicked Join");
    };

    render() {
        return (
            <div className={'container'}>
                <h1>Play a Game</h1>
                <br/>
                <Container>
                    <Row>
                        <Col>
                            <Button
                                style={buttonStyle}
                                href={"/global"}
                                variant={"primary"}
                                size={"lg"}
                            > Global Game
                            </Button>
                        </Col>
                        <Col>
                            <Button
                                style={buttonStyle}
                                href={"/globalTimed"}  // TODO: Update link
                                variant={"primary"}
                                size={"lg"}
                                title={"Global Timed Game"}
                            > Global Timed Game
                            </Button>
                        </Col>
                    </Row>
                    <br/>
                    <Row>
                        <Col>
                            <Button
                                style={buttonStyle}
                                href={"/join"}
                                variant={"primary"}
                                size={"lg"}
                                onClick={this.showJoinModal}
                            > Join a Game </Button>
                        </Col>
                        <Col>
                            <Button
                                style={buttonStyle}
                                href={"/create"}
                                variant={"primary"}
                                size={"lg"}
                            > Create a Game </Button>
                        </Col>
                    </Row>
                    <br/>
                    <div className={"wrapper"}>
                        <InputGroup>
                            <FormControl
                                placeholder={"Game title"}
                            />
                            <InputGroup.Append>
                                <Button variant={"primary"}>Search</Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </div>
                </Container>
            </div>)
    }
}
