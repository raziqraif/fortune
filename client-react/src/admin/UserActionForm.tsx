import React, { Component } from 'react';
import { Form, DropdownButton, Dropdown, Button } from 'react-bootstrap';
import { UsersType } from '../redux/reducers/AdminReducer';
import { RootState } from '../redux/reducers';
import { connect } from 'react-redux';
import actions from '../redux/actions';

interface UserActionFormProps {
    users: UsersType;
    userActionError: string;
    issueWarning: (userId: number, message: string) => void;
    issueBan: (userId: number) => void;
}

interface UserActionFormState {
    [key: string]: any;
    selectedUserId: number | undefined;
    userFilter: string;
    selectedAction: 'Warning' | 'Ban';
    warningMessage: string;
}

class UserActionForm extends Component<UserActionFormProps, UserActionFormState> {
    constructor(props: UserActionFormProps) {
        super(props);
        this.state = {
            selectedUserId: undefined,
            userFilter: '',
            selectedAction: 'Warning',
            warningMessage: '',
        }
    }

    userAction = (event: any) => {
        event.preventDefault();
        const { selectedAction, selectedUserId, warningMessage } = this.state;
        if (!selectedUserId) return;
        if (selectedAction === 'Warning') {
            this.props.issueWarning(selectedUserId, warningMessage.trim());
            this.setState({ warningMessage: '' });
        }
        else if (selectedAction === 'Ban') {
            this.props.issueBan(selectedUserId);
        }
    }

    setSelectedAction = (selectedAction: 'Warning' | 'Ban') => {
        this.setState({ selectedAction, warningMessage: '' });
    }

    setSelectedUserId = (selectedUserId?: number) => {
        this.setState({ selectedUserId });
    }

    private handleChange = (event: any) => {
        this.setState({ [event.currentTarget.name]: event.currentTarget.value });
    }

    render() {
        let currentSelectedUsername = 'No Users';
        if (this.state.selectedUserId) {
            const currentSelectedUser = this.props.users.find((user) => user.id === this.state.selectedUserId);
            if (currentSelectedUser) currentSelectedUsername = currentSelectedUser.username;
        }
        else if (this.props.users && this.props.users.length > 0) {
            this.setState({ selectedUserId: this.props.users[0].id })
        }

        return (
            <Form onSubmit={this.userAction}>
                {this.props.userActionError && <p style={{color: 'red'}}>
                    {this.props.userActionError}
                </p>}
                <Form.Row>
                    <h4 style={{paddingRight: 10}}>Issue Action</h4>
                </Form.Row>
                <Form.Row style={{marginTop: 10}}>
                    <DropdownButton id="action-to-user" title={this.state.selectedAction}>
                        <Dropdown.Item onClick={(e: any) => this.setSelectedAction('Warning')}>
                            Warning
                        </Dropdown.Item>
                        <Dropdown.Item onClick={(e: any) => this.setSelectedAction('Ban')}>
                            Ban
                        </Dropdown.Item>
                    </DropdownButton>
                    <Form.Control
                        type="input"
                        placeholder="Warning Message"
                        name="warningMessage"
                        value={this.state.warningMessage}
                        onChange={this.handleChange}
                        className="col-lg-6"
                        disabled={this.state.selectedAction !== 'Warning'}
                    />
                    <DropdownButton
                        id="user-to-act-on"
                        title={currentSelectedUsername}
                        disabled={!this.state.selectedUserId}
                    >
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
                    <Button
                        variant={
                            this.state.selectedAction === 'Warning'
                                ? 'warning'
                                : 'danger'
                        }
                        type="submit"
                    >
                        Issue {this.state.selectedAction}
                    </Button>
                </Form.Row>
            </Form>
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
    userActionError: state.admin.userActionErrorMessage,
})

const mapDispatchToProps = {
    issueWarning: actions.admin.issueWarning,
    issueBan: actions.admin.issueBan,
}

export default connect(mapStateToProps, mapDispatchToProps)(UserActionForm);