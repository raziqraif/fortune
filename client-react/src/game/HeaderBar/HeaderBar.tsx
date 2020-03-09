import * as React from 'react';
import { Row, Modal, Col, Button } from 'react-bootstrap';
import { GameType } from '../../redux/actions/Game'
import CSS from 'csstype';
import moment from 'moment';

interface HeaderBarState {
	days: string;
	hours: string;
	minutes: string;
	seconds: string;
	showShare: boolean;
}

interface HeaderBarProps {
	game: GameType,
	global: boolean,
}

const styles: { [name: string]: CSS.Properties } = {
	heading: {
		width: '100%',
		borderBottom: 'medium solid',
	},
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
		// moment countdown interval
		this.interval = setInterval(this.countdown, 1000);
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	// calculates how much time is left in the game
	private countdown = () => {
		const endsAt = moment(this.props.game.endsAt);
		const now = moment();
		const diff = moment(endsAt.diff(now));
		const days = diff.format('D');
		const hours = diff.format('HH');
		const minutes = diff.format('mm');
		const seconds = diff.format('ss');
		this.setState({ days, hours, minutes, seconds });
	}

	private toggleShow = () => {
		this.setState({ showShare: !this.state.showShare });
	}

	render() {
		const { days, hours, minutes, seconds, showShare } = this.state;
		const { global, game } = this.props;
		return (
			<div className="HeaderBar">
				<Row>
					<h1 style={styles.heading}>Fortune</h1>
				</Row>
				<Row>
					<div style={styles.heading}>
						<h3>{global ? `Global Game` : `Private Game: ${game.name}`}</h3>
						<div>Ends in: {days} {hours} {minutes} {seconds} </div>
					</div>
					<Button variant="primary" onClick={this.toggleShow}>Share</Button>
				</Row>

				{/* Share modal */}
				<Modal show={showShare} onHide={this.toggleShow}>
					<Modal.Header closeButton>
						<Modal.Title>Share this game!</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<span>Link: {game.shareableLink}</span> <br/>
						<span>Code: {game.shareableCode}</span>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={this.toggleShow}>
							Close
          				</Button>
					</Modal.Footer>
				</Modal>
			</div>
		)
	}
}

export default HeaderBar