import React, { Component } from 'react';
import { Form, DropdownButton, Dropdown, Button } from 'react-bootstrap';
import { RootState } from '../redux/reducers';
import actions from '../redux/actions';
import { connect } from 'react-redux';

interface AdminProps {
    users: Array<{id: number, username: string}>
    usersError: string;
    notifyError: string;
    getUsers: () => void;
    notifyUser: (message: string, userId?: number) => void;
}
interface AdminState {
    [key: string]: any;
    selectedUserId: number | undefined;
    userFilter: string;
    notificationMessage: string;
}

class Admin extends Component<AdminProps, AdminState> {
    constructor(props: AdminProps) {
        super(props);
        this.state = {
            selectedUserId: undefined,
            userFilter: '',
            notificationMessage: '',
        }
    }

    componentDidMount() {
        this.props.getUsers();
    }

    notifyUser = (event: any) => {
        event.preventDefault();
        this.props.notifyUser(this.state.notificationMessage, this.state.selectedUserId);
        this.setState({notificationMessage: '', selectedUserId: undefined});
    }

    setSelectedUserId = (selectedUserId?: number) => {
        this.setState({ selectedUserId });
    }

    private handleChange = (event: any) => {
        this.setState({ [event.currentTarget.name]: event.currentTarget.value });
    }


    render() {
        let currentSelectedUsername = 'All Users';
        if (this.state.selectedUserId) {
            const currentSelectedUser = this.props.users.find((user) => user.id === this.state.selectedUserId);
            if (currentSelectedUser) currentSelectedUsername = currentSelectedUser.username;
        }

        return (
            <div className="container row col-lg-12" style={{alignItems: 'left'}}>
                {this.props.usersError && <div className="row col-lg-12">
                    <p style={{color: 'red'}} className="col-lg-12">
                        {this.props.usersError}
                    </p>
                </div>}
                <div className="row col-lg-12" style={{marginBottom: 10}}>
                    <h1>Admin</h1>
                </div>
                <div className="col-lg-12">
                    <Form onSubmit={this.notifyUser}>
                        {this.props.notifyError && <p style={{color: 'red'}}>
                            {this.props.notifyError}
                        </p>}
                        <Form.Row>
                            <h4 style={{paddingRight: 10}}>Notify</h4>
                        </Form.Row>
                        <Form.Row style={{marginTop: 10}}>
                            <DropdownButton id="user-to-notify" title={currentSelectedUsername}>
                                <Dropdown.Item as="button" onClick={(e) => this.setSelectedUserId()}>
                                    All Users
                                </Dropdown.Item>
                                <Form.Control
                                    autoFocus
                                    className="mx-3 my-2 w-auto"
                                    name="userFilter"
                                    placeholder="Type to filter..."
                                    onChange={this.handleChange}
                                    value={this.state.userFilter}
                                />
                                <Dropdown.Divider />
                                {this.renderUsersInDropdown()}
                            </DropdownButton>
                            <Form.Control
                                type="input"
                                placeholder="Message"
                                name="notificationMessage"
                                value={this.state.notificationMessage}
                                onChange={this.handleChange}
                                className="col-lg-6"
                            />
                            <Button variant="primary" type="submit">
                                Send Message
                            </Button>
                        </Form.Row>
                    </Form>
                </div>
            </div>
        )
    }

    renderUsersInDropdown = () => {
        const filteredUsers = this.props.users ? this.props.users.filter(
            (user) => user.username.toLowerCase().startsWith(this.state.userFilter.toLowerCase())
        ).slice(0,10) : [];
        return (
            <>
                {filteredUsers.map((user) => {
                    return (
                        <Dropdown.Item
                            key={user.id}
                            as="button"
                            onClick={(e) => this.setSelectedUserId(user.id)}>
                            {user.username}
                        </Dropdown.Item>
                    );
                })}
                <Dropdown.Item disabled>
                    Filter for more...
                </Dropdown.Item>
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    users: state.admin.users,
    usersError: state.admin.usersErrorMessage,
    notifyError: state.admin.notifyErrorMessage,
})

const mapDispatchToProps = {
    getUsers: actions.admin.getUsers,
    notifyUser: actions.admin.notifyUser,
}

export default connect(mapStateToProps, mapDispatchToProps)(Admin);