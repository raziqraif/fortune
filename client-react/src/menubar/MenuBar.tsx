import * as React from 'react';
import logo from '../logo.svg';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import {connect} from 'react-redux'
import Actions from '../redux/actions'

interface MenuBarProps {
    loggedIn: boolean;
    login: (email: string, password: string) => void;
    logout: () => void;
}

class MenuBar extends React.Component<MenuBarProps, {}> {
    constructor(props: any) {
        super(props);
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
        if (this.props.loggedIn) {
            return (
                <NavDropdown title="Username" id="basic-nav-dropdown" alignRight>
                    <NavDropdown.Item href="play">Games</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={this.props.logout}>Logout</NavDropdown.Item>
                </NavDropdown>
            )
        } else {
            return (
                <Nav.Link onClick={() => this.props.login('email', 'passwd')}>Sign In</Nav.Link>
            )
        }
    }

    private logOut = () => {
        this.setState({ loggedIn: false });
    }
}

const mapStateToProps = state => ({
  loggedIn: state.auth.loggedIn,
})
const mapDispatchToProps = {
  login: Actions.auth.login,
  logout: Actions.auth.logout,
}
export default connect(mapStateToProps, mapDispatchToProps)(MenuBar)
