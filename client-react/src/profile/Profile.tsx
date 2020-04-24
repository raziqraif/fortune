import React, { Component } from 'react';
import { Tabs, Tab, Button } from 'react-bootstrap';
import Options from './Options';
import Friends from './Friends';
import { RootState } from '../redux/reducers';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import Achievements from './Achievements'

interface ProfileProps {
    profileId: string;
    username?: string;
    navigateTo: (location: string) => void;
}

const tabs = [
    {
        title: 'Options',
        component: <Options />
    },
    {
        title: 'Achievements',
        component: <Achievements />
    },
    {
        title: 'Friends',
        component: <Friends />
    }

]

class Profile extends Component<ProfileProps> {
    private navigateTo = (location: string) => () => {
        this.props.navigateTo(location);
    }

    render() {
        return (
            <div className="row col-lg-12" style={{paddingTop: 10}}>
                <h1 className="col-lg-6" style={{alignItems: 'left'}}>{this.props.username ? this.props.username : 'Profile'}</h1>
                <div className="col-lg-6" style={{textAlign: 'right'}}>
                    <Button onClick={this.navigateTo('/play')}>
                        My Games
                    </Button>
                </div>
                <div className="col-lg-12">
                    {this.renderTabs()}
                </div>
            </div>
        )
    }

    renderTabs = () => {
        return (
            <Tabs defaultActiveKey={tabs[0].title} id="profile-tabbing" style={{width: '100%', marginTop: 10}}>
                {tabs.map((tab) =>
                    <Tab key={tab.title} eventKey={tab.title} title={tab.title}>
                        {tab.component}
                    </Tab>
                )}
            </Tabs>
        )
    }
}

const mapStateToProps = (state: RootState) => ({
    username: state.auth.username,
});
const mapDispatchToProps = (dispatch: any) => ({
    navigateTo: (location: string) => dispatch(push(location)),
})
export default connect(mapStateToProps, mapDispatchToProps)(Profile);