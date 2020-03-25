import * as React from 'react';
import { RootState } from '../redux/reducers';
import { Container } from 'react-bootstrap';
import Actions from '../redux/actions';
import { connect } from 'react-redux';
import { GameType } from '../redux/actions/Game';
import HeaderBar from './HeaderBar/HeaderBar';
import InfoBar from './InfoBar/InfoBar';

export interface GameProps {
	getGame: (
		id: number
	) => void;
	gameId?: string;
	game: GameType;
	error: string;
	history: any;
}

class Game extends React.Component<GameProps> {

	constructor(props: GameProps) {
		super(props);

		this.state = {

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
			this.props.getGame(1);
		}
	}

	render() {
		const { gameId, error, game } = this.props;
		const global = gameId ? false : true;
		if (error) {
			return <p style={{ color: 'red' }}>{error}</p>
		}

		return (
			<div className="Game">
				<Container fluid>
					<HeaderBar
						game={game.data}
						global={global}
						history={this.props.history}
						gameId={gameId}
					/>
					<InfoBar
						gameProfile={game.gameProfile}
						coins={game.coins}
					/>
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