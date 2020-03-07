import * as React from 'react';
import { RootState } from '../redux/reducers';
import { Container, Row, Col, Button, ButtonGroup } from 'react-bootstrap';
import Actions from '../redux/actions';
import { connect } from 'react-redux';
import { GameType } from '../redux/actions/Game'
import CSS from 'csstype';
import moment from 'moment';
import InfoBar from './infoBar/InfoBar';

export interface GameProps {
	getGame: (
		id: number
	) => void;
	gameId?: string;
	error: string;
	game: GameType;
}

interface GameState {
	days: string;
	hours: string;
	minutes: string;
	seconds: string;
}

const styles: { [name: string]: CSS.Properties } = {
	heading: {
		width: '100%',
		borderBottom: 'medium solid',
	},
};

class Game extends React.Component<GameProps, GameState> {
	private interval!: NodeJS.Timeout;

	constructor(props: GameProps) {
		super(props);

		this.state = {
			days: '',
			hours: '',
			minutes: '',
			seconds: '',
		}
	}

	componentDidMount() {
		const { gameId } = this.props;
		// private game - get game
		// LOOKATME - getGame and the backend expect gameId to be a number,
		// but since gameId comes from match.params, it is a string.
		// not sure how we should unify this discrepency
		if (gameId) {
			this.props.getGame(parseInt(gameId));
		}

		// TODO global game - get global game 
		else {

		}

		// moment countdown interval
		this.interval = setInterval(this.countdown, 1000);

	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	// calculates how much time is left in the game
	private countdown = () => {
		const endsAt = moment(this.props.game.data.endsAt);
		const now = moment();
		const diff = moment(endsAt.diff(now));
		const days = diff.format('D');
		const hours = diff.format('HH');
		const minutes = diff.format('mm');
		const seconds = diff.format('ss');
		this.setState({ days, hours, minutes, seconds });
	}

	render() {
		const { gameId, error, game } = this.props;
		const { days, hours, minutes, seconds } = this.state;
		if (error) {
			return <p style={{ color: 'red' }}>{error}</p>
		}

		return (
			<div className="Game">
				<Container>
					<Row>
						<h1 style={styles.heading}>Fortune</h1>
					</Row>
					<Row>
						<div style={styles.heading}>
							<h3>{gameId ? `Private Game: ${game.data.name}` : `Global Game`}</h3>
							<div>Ends in: {days} {hours} {minutes} {seconds} </div>
						</div>
					</Row>
					<InfoBar />
					<Row>
						Table will go here
                </Row>
				</Container>
			</div>
		)
	}
}

const mapStateToProps = (state: RootState) => ({
	game: state.game.game,
	error: state.game.setGameErrorMessage,
})

const mapDispatchToProps = {
	getGame: Actions.game.getGame,
}

export default connect(mapStateToProps, mapDispatchToProps)(Game);