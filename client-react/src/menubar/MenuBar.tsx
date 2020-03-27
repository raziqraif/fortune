import * as React from 'react';
import io from 'socket.io-client'
import logo from '../logo.svg';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import {connect} from 'react-redux'
import Actions from '../redux/actions'
import { RootState } from '../redux/reducers';
import { push } from 'connected-react-router';

interface MenuBarProps {
    loggedIn: boolean;
    logout: () => void;
    navigateTo: (location: string) => void;
    fetchAuthToken: () => void;
}

class MenuBar extends React.Component<MenuBarProps> {
    constructor(props: MenuBarProps) {
        super(props);
    }

    componentDidMount() {
      this.props.fetchAuthToken()
      const socket = io('http://localhost:5000').connect();
      socket.on('message', function(data: any){
        console.log('event received:', data)
        // TODO dispatch
      });
    }

    private navigateTo = (location: string) => () => {
        this.props.navigateTo(location);
    }

    private logout = () => {
        this.props.logout();
        this.navigateTo('/')();
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
                        <Nav.Link onClick={this.navigateTo('/play')}>Play</Nav.Link>
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
                    <NavDropdown.Item onClick={this.navigateTo('/play')} >Games</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={this.logout}>Logout</NavDropdown.Item>
                </NavDropdown>
            )
        } else {
            return (
                <Nav.Link onClick={this.navigateTo('/login')}>Sign In</Nav.Link>
            )
        }
    }
}

const mapStateToProps = (state: RootState) => ({
  loggedIn: state.auth.loggedIn,
})
const mapDispatchToProps = (dispatch: any) => ({
  logout: Actions.auth.logout,
  navigateTo: (location: string) => dispatch(push(location)),
  fetchAuthToken: Actions.auth.fetchAuthToken,
})
export default connect(mapStateToProps, mapDispatchToProps)(MenuBar)
