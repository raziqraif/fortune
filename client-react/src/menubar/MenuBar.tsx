import * as React from 'react';
import io from 'socket.io-client'
import logo from '../logo.svg';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import {connect} from 'react-redux'
import Actions from '../redux/actions'
import { RootState } from '../redux/reducers';
import { Redirect } from 'react-router-dom';
import { currentPricesType } from '../redux/reducers/CoinReducer'

interface MenuBarProps {
    loggedIn: boolean;
    logout: () => void;
    fetchAuthToken: () => void;
    setCurrentPrices: (payload: currentPricesType) => void;
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

    componentDidMount() {
      this.props.fetchAuthToken()
      const socket = io('http://localhost:5000').connect();
      socket.on('message', (data: any) => {
        console.log('event received:', data);
        this.setCurrentPrices(data);
      });
    }

    private navigateTo = (navigateTo: string) => () => {
        this.setState({ navigateTo })
    }

    private logout = () => {
        this.props.logout();
        this.navigateTo('/')();
    }

    private setCurrentPrices = (payload: currentPricesType) => {
        this.props.setCurrentPrices(payload);
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
const mapDispatchToProps = {
  logout: Actions.auth.logout,
  fetchAuthToken: Actions.auth.fetchAuthToken,
  setCurrentPrices: Actions.coins.setCurrentPrices,
}
export default connect(mapStateToProps, mapDispatchToProps)(MenuBar)
