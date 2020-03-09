import * as React from 'react';
import {Button, ButtonGroup, ButtonToolbar, Col, Container, FormControl, InputGroup, Row} from "react-bootstrap";
import './Play.css'
import {CSSProperties} from "react";
import ActiveGames from "./active";

const buttonStyle: CSSProperties = {
    width: 100,
    height: 38,
    marginRight: 2,
    marginLeft: 2
    // fontSize: '120%',
    // lineHeight: "620%",
};

export default class Play extends React.Component {
    showJoinModal() {
        console.log("Clicked Join");
    };

    render() {
        return (
            // <div>
            <div className={'container'}>
            <h1>Play a Game</h1>
                <br/>
                <div className={"searchbar-wrapper"}>
                    <div className={"wrapper"} style={{marginRight:10}}>
                        <InputGroup>
                            <FormControl
                                placeholder={"Game title"}
                            />
                            <InputGroup.Append>
                                <Button variant={"primary"}>Search</Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </div>
                    <br/>
                    {/*<ButtonGroup>*/}
                    <div>
                        <Button
                            style={buttonStyle}
                            variant={"primary"}
                            // size={"sm"}
                            onClick={this.showJoinModal}
                        > Join </Button>
                        <Button
                            style={buttonStyle}
                            href={"/create"}
                            variant={"primary"}
                            // size={"sm"}
                        > Create </Button>
                    </div>
                    {/*</ButtonGroup>*/}
                </div>
                <br/>
                <ActiveGames/>
            {/*</div>*/}
            </div>
        )
    }
}
