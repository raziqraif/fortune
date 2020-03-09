import * as React from 'react';
import logo from '../logo.svg';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import {connect} from 'react-redux'
import Actions from '../redux/actions'
import { RootState } from '../redux/reducers';
import { Redirect } from 'react-router-dom';

interface MenuBarProps {
    loggedIn: boolean;
    logout: () => void;
    fetchAuthToken: () => void;
}

interface MenuBarState {
    toLogin: boolean;
}

class MenuBar extends React.Component<MenuBarProps, MenuBarState> {
    constructor(props: MenuBarProps) {
        super(props);
        this.state = {
            toLogin: false,
        }
    }

    componentDidMount() {
      this.props.fetchAuthToken()
    }

    private navigateToLogin = () => {
        this.setState({ toLogin: true });
    }

    render() {
        if (this.state.toLogin === true) {
            this.setState({ toLogin: false });
            return <Redirect to='/login' />
        }
        
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
                <Nav.Link onClick={this.navigateToLogin}>Sign In</Nav.Link>
            )
        }
    }
}

const mapStateToProps = (state: RootState) => ({
  loggedIn: state.auth.loggedIn,
})
const mapDispatchToProps = {
  logout: Actions.auth.logout,
  fetchAuthToken: Actions.auth.fetchAuthToken,
}
export default connect(mapStateToProps, mapDispatchToProps)(MenuBar)
