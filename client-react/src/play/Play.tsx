import * as React from 'react';
import {Alert, Button, Container, Dropdown, DropdownButton, FormControl, InputGroup, Modal, Row} from "react-bootstrap";
import './Play.css'
import {CSSProperties} from "react";
import ActiveGames from "./active";
import assert from "assert";
import Pagination from "../pagination";
import {RootState} from "../redux/reducers";
import {GameType} from "../redux/reducers/PlayReducer";
import Actions from "../redux/actions";
import {connect} from "react-redux";
import { Redirect } from 'react-router-dom';

const buttonStyle: CSSProperties = {
    width: 100,
    height: 38,
    marginRight: 2,
    marginLeft: 2
};

interface PlayProp {
    activeGamesAtPage: (
        pageNumber: number,
        keyword: string,
        sortCriteria: SortCriteriaType
    ) => {}
    gamesInPage: GameType[],
    pageSize: number,
    totalGames: number,
    joinGame: (
        code: string,
    ) => {},
    redirectLink: string,
    showGameNotFound: boolean,
}

interface PlayState {
    showJoinModal: boolean,
    gameNotFoundDismissed: boolean,
}

export type SortCriteriaType = {
    // NOTE: Update SortCriteriaKey too if any attributes were changed
    [key: string]: boolean,
    titleAscending: boolean,
    titleDescending: boolean,
    endTimeAscending: boolean,
    endTimeDescending: boolean
}

enum SortCriteriaKey {
    // The value corresponds to the attribute name in SortCriteria
    TITLE_ASCENDING = "titleAscending",
    TITLE_DESCENDING = "titleDescending",
    ENDTIME_ASCENDING = "endTimeAscending",
    ENDTIME_DESCENDING = "endTimeDescending",
}

class Play extends React.Component<PlayProp, PlayState> {
    pageNumber: number = 1;
    keyword: string = '';
    sortCriteria: SortCriteriaType = {
        titleAscending: false,
        titleDescending: false,
        endTimeAscending: false,
        endTimeDescending: false
    };
    gameCode = '';

    constructor(props: PlayProp) {
        super(props);

        this.state = {
            showJoinModal: false,
            gameNotFoundDismissed: false,
        };
    }

    componentDidMount(): void {
        this.updateBackendData();
    }

    updateBackendData(resetPageNumber= false) {
        if (resetPageNumber) {
            this.pageNumber = 1;
        }
        this.props.activeGamesAtPage(
            this.pageNumber,
            this.keyword,
            this.sortCriteria
        );
        console.log("API", this.props.gamesInPage)
    }

    toggleSortCriteria(criteria: string) {
        let sortCriteriaProps = Object.keys(this.sortCriteria);
        assert(sortCriteriaProps.includes(criteria));

        let prevCriteriaValue: boolean = (this.sortCriteria as SortCriteriaType)[criteria];
        sortCriteriaProps.forEach((prop) => {
            this.sortCriteria[prop] = false;
        });

        this.sortCriteria[criteria] = !prevCriteriaValue;
        this.updateBackendData(true);
    }

    handleShowJoinModal = () => {
        this.setState({showJoinModal: true})
    };

    handleHideJoinModal = () => {
        this.setState({showJoinModal: false})
    };

    handleModalKeyPress = (event: any) => {
        if (event.key === "Enter") {
            this.handleJoinGame(event);
        }
    };

    handleGameCodeChange = (event: any) => {
        this.gameCode = event.target.value.trim();
    };

    handleJoinGame = (event: any) => {
        // TODO: Show error if code is invalid/game doesn't exist. Add player to the game if it exists.
        if (this.gameCode === "") {
            return
        }
        this.props.joinGame(this.gameCode);
        this.setGameNotFoundDismissed(false)
        this.handleHideJoinModal()
    };

    handleKeywordChange = (event: any) => {
        this.keyword = event.target.value.trim();
    };

    setGameNotFoundDismissed(val: boolean) {
        console.log("Dismissed: ", val)
        this.setState({gameNotFoundDismissed: val})
    }

    handleSearchGames = (_event: any) => {
        this.pageNumber = 1;
        this.updateBackendData()
    };

    handleSearchBarKeyPress = (event: any) => {
        if (event.key === "Enter") {
            this.handleSearchGames(event);
        }
    };

    handlePageChange = (pageNumber: number) => {
        this.pageNumber = pageNumber;
        this.updateBackendData()
    };

    render() {
        if (this.props.redirectLink !== "") {
            return <Redirect to={this.props.redirectLink}/>
        }
        return (
            <div className={'container'}>
                {this.props.showGameNotFound
                && !this.state.gameNotFoundDismissed
                && <Alert variant={"danger"}
                          onClose={() => this.setGameNotFoundDismissed(true)}
                          dismissible={true}>
                    Invalid game code!
                </Alert>
                }
                <div className={"title-wrapper"}>
                    <h1>Play</h1>
                </div>
                <div className={"toolbar-wrapper"}>
                    <div className={"searchbar-wrapper"} style={{marginRight:5}}>
                        <InputGroup>
                            <FormControl
                                onChange={this.handleKeywordChange}
                                onKeyPress={this.handleSearchBarKeyPress}
                                placeholder={"Game title"}
                            />
                            <InputGroup.Append>
                                <Button
                                    variant={"primary"}
                                    onClick={this.handleSearchGames}
                                >Search</Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </div>
                    <div className={"widgets-wrapper"} style={{marginRight:40}}>
                        <DropdownButton
                            id={'dropdown-basic-button'}
                            title={'Sort by'}
                        >
                            <Dropdown.Item
                                eventKey="1"
                                active={this.sortCriteria.titleAscending}
                                onClick={() => this.toggleSortCriteria(SortCriteriaKey.TITLE_ASCENDING)}
                            >Title: Ascending</Dropdown.Item>
                            <Dropdown.Item
                                eventKey="2"
                                active={this.sortCriteria.titleDescending}
                                onClick={() => this.toggleSortCriteria(SortCriteriaKey.TITLE_DESCENDING)}
                            >Title: Descending</Dropdown.Item>
                            <Dropdown.Item
                                eventKey="3"
                                active={this.sortCriteria.endTimeAscending}
                                onClick={() => this.toggleSortCriteria(SortCriteriaKey.ENDTIME_ASCENDING)}
                            >End Time: Ascending</Dropdown.Item>
                            <Dropdown.Item
                                eventKey="4"
                                active={this.sortCriteria.endTimeDescending}
                                onClick={() => this.toggleSortCriteria(SortCriteriaKey.ENDTIME_DESCENDING)}
                            >End Time: Descending</Dropdown.Item>
                        </DropdownButton>
                    </div>
                    <div className={"widgets-wrapper"}>
                        <Button
                            style={buttonStyle}
                            variant={"primary"}
                            onClick={this.handleShowJoinModal}
                        > Join </Button>
                        <Button
                            style={buttonStyle}
                            href={"/create"}
                            variant={"primary"}
                        > Create </Button>
                    </div>
                </div>

                <Container>
                    <ActiveGames games={this.props.gamesInPage}/>
                    <Row>
                        <Pagination
                            currentPage={this.pageNumber}
                            pageSize={this.props.pageSize}
                            totalItems={this.props.totalGames}
                            handlePageChange={this.handlePageChange}
                        />
                    </Row>
                </Container>

                <Modal show={this.state.showJoinModal} onHide={this.handleHideJoinModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Join a Game</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{display: "flex", flexDirection: "column", alignItems: "center",
                        marginLeft: 50, marginRight: 50, marginTop: 15, marginBottom: 15}}>
                        <InputGroup
                        >
                            <InputGroup.Prepend>
                                <InputGroup.Text style={{background:"#2a79f7", color:"white"}}>Code</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                onChange={this.handleGameCodeChange}
                                onKeyPress={this.handleModalKeyPress}
                                placeholder={"Enter the unique game code"}
                            />
                        </InputGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant={"primary"} style={{width: 90}} onClick={this.handleJoinGame}>
                        Join
                    </Button>
                    <Button variant={"primary"} style={{width: 90}} onClick={this.handleHideJoinModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            </div>
        )
    }
}

const mapStateToProps = (state: RootState) => ({
    gamesInPage: state.play.gamesInPage,
    totalGames: state.play.totalGames,
    pageSize: state.play.pageSize,
    redirectLink: state.play.redirectLink,
    showGameNotFound: state.play.showGameNotFound,
});

const mapDispatchToProps = {
    activeGamesAtPage: Actions.play.activeGamesAtPage,
    joinGame: Actions.play.joinGame,
};

export default connect(mapStateToProps, mapDispatchToProps)(Play);