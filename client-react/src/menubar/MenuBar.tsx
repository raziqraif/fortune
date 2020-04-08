import * as React from 'react';
import io from 'socket.io-client'
import logo from '../logo.svg';
 import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import {connect} from 'react-redux'
import Actions from '../redux/actions'
import { RootState } from '../redux/reducers';
import { push } from 'connected-react-router';

interface MenuBarProps {
    loggedIn: boolean;
    authToken: string;
    logout: () => void;
    navigateTo: (location: string) => void;
    fetchAuthToken: () => void;
}

class MenuBar extends React.Component<MenuBarProps> {
    constructor(props: MenuBarProps) {
        super(props);
    }

    async componentDidMount() {
      toast.configure()
      await this.props.fetchAuthToken()
      // TODO reestablish connection on login/register? Or just send the user's socketid when logging in/registering?
      const socket = io('http://localhost:5000', {query: {token: this.props.authToken}}).connect();
      socket.on('message', function(data: any){
        console.log('event received:', data)
        // TODO dispatch
      });
      socket.on('notification', function(data: string){
        console.log('notification received:', data)
        toast(data)
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
  authToken: state.auth.authToken,
})
const mapDispatchToProps = (dispatch: any) => ({
  logout: () => dispatch(Actions.auth.logout()),
  navigateTo: (location: string) => dispatch(push(location)),
  fetchAuthToken: () => dispatch(Actions.auth.fetchAuthToken()),
})
export default connect(mapStateToProps, mapDispatchToProps)(MenuBar)
