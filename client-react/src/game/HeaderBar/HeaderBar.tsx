import * as React from 'react';
import { Row, Modal, Col, Button } from 'react-bootstrap';
import { GameDataType } from '../../redux/actions/Game'
import CSS from 'csstype';
import moment from 'moment';
import copy from 'copy-to-clipboard';

interface HeaderBarState {
	days: string;
	hours: string;
	minutes: string;
	seconds: string;
	showShare: boolean;
}

interface HeaderBarProps {
	game: GameDataType,
	history: any,
	gameId?: string,
}

const styles: { [name: string]: CSS.Properties } = {
	heading: {
		borderBottom: 'medium solid',
		alignItems: 'center',
		flexWrap: 'nowrap',
	},

	toolbar: {
		justifyContent: 'flex-end',
		alignItems: 'center',
		flexWrap: 'nowrap',
	},

	time: {
		justifyContent: 'center',
		alignItems: 'center',
		flexWrap: 'nowrap',
	}
};

class HeaderBar extends React.Component<HeaderBarProps, HeaderBarState> {
	private interval!: NodeJS.Timeout; // setInterval ref

	constructor(props: HeaderBarProps) {
		super(props);

		this.state = {
			days: '',
			hours: '',
			minutes: '',
			seconds: '',
			showShare: false,
		}
	}

	componentDidMount() {
		// moment countdown interval if there's an endAt
		if (this.props.game.endsAt) this.interval = setInterval(this.countdown, 1000);
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	// calculates how much time is left in the game
	private countdown = () => {
		const endsAt = moment.utc(this.props.game.endsAt);
		const now = moment();
		// game time is expired, so navigate to leaderboard
		if (now > endsAt) {
			this.navigateToLeaderBoard();
			return;
		}
		const diff = moment.duration(endsAt.diff(now));
		const days = diff.asDays().toFixed(0);
		const hours = diff.hours().toString();
		const minutes = diff.minutes().toString();
		const seconds = diff.seconds().toString();
		this.setState({ days, hours, minutes, seconds });
	}

	private toggleShow = () => {
		this.setState({ showShare: !this.state.showShare });
	}

	private copyLink = () => {
		copy(this.props.game.shareableLink);
	}

	private navigateToLeaderBoard = () => {
		if (this.props.gameId) this.props.history.push(`/${this.props.gameId}/leaderboard`); // private game leaderboard
		else this.props.history.push('/leaderboard'); // global leaderboard
	}

	render() {
		const { days, hours, minutes, seconds, showShare } = this.state;
		const { game } = this.props;
		// truncate name with '...' if it is too long
		let name = game.name;
		name = name.length > 10 ? name.substring(0, 10) + '...' : name;
		return (
			<div className="HeaderBar">
				<Row style={styles.heading}>
					<Col md="auto">
						<h1>{name}</h1>
					</Col>

					<Col md="auto">
						<Row style={styles.toolbar}>
							{
								game.endsAt &&
								<>
									<Col style={{ textAlign: 'right' }}>
										<h4>Ends in:</h4>
									</Col>
									<Col style={styles.toolbar}>

										<Row style={styles.time}>
											<Col>{days}</Col>
											<Col>{hours}</Col>
											<Col>{minutes}</Col>
											<Col>{seconds}</Col>
										</Row>
										<Row style={styles.time}>
											<Col>days</Col>
											<Col>hours</Col>
											<Col>minutes</Col>
											<Col>seconds</Col>
										</Row>
									</Col>
								</>
							}

							<Button style={{ marginRight: '1em' }} variant="primary" onClick={this.toggleShow}>Share</Button>
							<Button variant="primary" onClick={this.navigateToLeaderBoard}>Leaderboard</Button>
						</Row>
					</Col>
				</Row>


				{/* Share modal */}
				<div className="myModal">
					<Modal show={showShare} onHide={this.toggleShow}>
						<Modal.Header closeButton>
							<Modal.Title>Share this game!</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<Row style={{ justifyContent: 'center' }}>Link:</Row>
							<Row onClick={this.copyLink}>{game.shareableLink}</Row>
							<br />
							<Row style={{ justifyContent: 'center' }}>Code:</Row>
							<Row style={{ justifyContent: 'center' }}>{game.shareableCode}</Row>
						</Modal.Body>
						<Modal.Footer style={{ justifyContent: 'center' }}>
							<Button variant="secondary" onClick={this.toggleShow}>
								Close
							</Button>
						</Modal.Footer>
					</Modal>
				</div>
			</div>

		)
	}
}


export default HeaderBar
