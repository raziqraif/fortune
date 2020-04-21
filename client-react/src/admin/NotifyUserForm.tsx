import React, { Component } from 'react';
import { Form, DropdownButton, Dropdown, Button } from 'react-bootstrap';
import { UsersType } from '../redux/reducers/AdminReducer';
import { RootState } from '../redux/reducers';
import actions from '../redux/actions';
import { connect } from 'react-redux';

interface NotifyUserFormProps {
    users: UsersType;
    notifyError: string;
    notifyUser: (message: string, userId?: number) => void;
}

interface NotifyUserFormState {
    [key: string]: any;
    selectedUserId: number | undefined;
    userFilter: string;
    notificationMessage: string;
}

class NotifyUserForm extends Component<NotifyUserFormProps, NotifyUserFormState> {
    constructor(props: NotifyUserFormProps) {
        super(props);
        this.state = {
            selectedUserId: undefined,
            userFilter: '',
            notificationMessage: '',
        }
    }

    notifyUser = (event: any) => {
        event.preventDefault();
        this.props.notifyUser(this.state.notificationMessage.trim(), this.state.selectedUserId);
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
            <Form onSubmit={this.notifyUser}>
                {this.props.notifyError && <p style={{color: 'red'}}>
                    {this.props.notifyError}
                </p>}
                <Form.Row>
                    <h4 style={{paddingRight: 10}}>Notify</h4>
                </Form.Row>
                <Form.Row style={{marginTop: 10}}>
                    <DropdownButton id="user-to-notify" title={currentSelectedUsername}>
                        <Dropdown.Item onClick={(e: any) => this.setSelectedUserId()}>
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
        );
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
                            onClick={(e: any) => this.setSelectedUserId(user.id)}>
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
    notifyError: state.admin.notifyErrorMessage,
})

const mapDispatchToProps = {
    notifyUser: actions.admin.notifyUser,
}

export default connect(mapStateToProps, mapDispatchToProps)(NotifyUserForm);