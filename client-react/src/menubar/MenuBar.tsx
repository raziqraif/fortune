import * as React from 'react';
import logo from '../logo.svg';
import 'react-toastify/dist/ReactToastify.css';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import {connect} from 'react-redux'
import Actions from '../redux/actions'
import { RootState } from '../redux/reducers';
import { Redirect } from 'react-router-dom';
import { currentPricesType } from '../redux/reducers/CoinReducer'
import { toast } from 'react-toastify';

interface MenuBarProps {
    loggedIn: boolean;
    authToken: string;
    logout: () => void;
    fetchAuthToken: () => void;
    setCurrentPrices: (payload: currentPricesType) => void;
    initializeSocketConnection: (authToken: string) => void;
}

interface MenuBarState {
    navigateTo?: string;
}

class MenuBar extends React.Component<MenuBarProps, MenuBarState> {
    constructor(props: MenuBarProps) {
        super(props);
        this.state = {
            navigateTo: undefined
        }
    }

    async componentDidMount() {
      toast.configure()
      await this.props.fetchAuthToken()
      // TODO reestablish connection on login/register? Or just send the user's socketid when logging in/registering?
      await this.props.initializeSocketConnection(this.props.authToken)
    }

    private navigateTo = (navigateTo: string) => () => {
        this.setState({ navigateTo })
    }

    private logout = () => {
        this.props.logout();
        this.navigateTo('/')();
    }

    render() {
        if (this.state.navigateTo) {
            this.setState({ navigateTo: undefined })
            return <Redirect to={this.state.navigateTo} />
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
                    <NavDropdown.Item onClick={this.navigateTo('/notifications')} >Notifications</NavDropdown.Item>
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
const mapDispatchToProps = {
  logout: Actions.auth.logout,
  fetchAuthToken: Actions.auth.fetchAuthToken,
  setCurrentPrices: Actions.coins.setCurrentPrices,
  initializeSocketConnection: Actions.auth.initializeSocketConnection,
}
export default connect(mapStateToProps, mapDispatchToProps)(MenuBar)
