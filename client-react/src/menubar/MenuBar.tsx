import * as React from 'react';
import logo from '../logo.svg';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';

interface MenuBarState {
    loggedIn: boolean;
}

export default class MenuBar extends React.Component<{}, MenuBarState> {
    constructor(props: any) {
        super(props);
        this.state = {
            loggedIn: true, // TODO: we shouldn't do logging in this way, but that's a later task
        }
    }
    render() {
        return (
            <Navbar collapseOnSelect expand="md" bg="dark" variant="dark">
                <Navbar.Brand href="/">
                <img
                    alt=""
                    src={logo}
                    width="30"
                    height="30"
                    className="d-inline-block align-top"
                />{' '}
                Fortune
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                    <Nav>
                        <Nav.Link href="play">Play</Nav.Link>
                        {this.renderLoginOrUsername()}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        )
    }

    private renderLoginOrUsername = () => {
        if (this.state.loggedIn) {
            return (
                <NavDropdown title="Username" id="basic-nav-dropdown" alignRight>
                    <NavDropdown.Item href="play">Games</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={this.logOut}>Logout</NavDropdown.Item>
                </NavDropdown>
            )
        } else {
            return (
                <Nav.Link href="login">Sign In</Nav.Link>
            )
        }
    }

    private logOut = () => {
        this.setState({ loggedIn: false });
    }
}