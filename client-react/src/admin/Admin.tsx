import React, { Component } from 'react';
import { Form, DropdownButton, Dropdown, Button } from 'react-bootstrap';
import { RootState } from '../redux/reducers';
import actions from '../redux/actions';
import { connect } from 'react-redux';
import NotifyUserForm from './NotifyUserForm';
import UserActionForm from './UserActionForm';
import ReportPagination from './ReportPagination';

interface AdminProps {
    usersError: string;
    getUsers: () => void;
}

class Admin extends Component<AdminProps> {
    componentDidMount() {
        this.props.getUsers();
    }

    render() {
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
                    <NotifyUserForm />
                    <hr />
                    <UserActionForm />
                    <hr />
                    <ReportPagination />
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state: RootState) => ({
    usersError: state.admin.usersErrorMessage,
})

const mapDispatchToProps = {
    getUsers: actions.admin.getUsers,
}

export default connect(mapStateToProps, mapDispatchToProps)(Admin);