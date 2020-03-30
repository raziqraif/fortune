import * as React from 'react';
import { RootState } from '../redux/reducers';
import {Button, Container, Row} from 'react-bootstrap';
import Actions from '../redux/actions';
import { connect } from 'react-redux';
import { GameType } from '../redux/actions/Game'
import HeaderBar from './HeaderBar/HeaderBar';
import InfoBar from './InfoBar/InfoBar';
import { CoinsAndPrices } from '../redux/actions/Coins';

export interface GameProps {
	getGame: (
		id: number
	) => void;
	getCoins: (
		gameId: number,
		timeSpan?: number,
		sortBy?: number,
		pageNum?: number,
		numPerPage?: number
	) => void;
	coinsAndPrices: CoinsAndPrices;
	gameId?: string;
	error: string;
	game: GameType;
}

class Game extends React.Component<GameProps> {

	constructor(props: GameProps) {
		super(props);
	}

	componentDidMount() {
		const { gameId } = this.props;
		// private game - get game
		// LOOKATME - getGame and the backend expect gameId to be a number,
		// but since gameId comes from match.params, it is a string.
		// not sure how we should unify this discrepency
		if (gameId) {
			this.props.getGame(parseInt(gameId));
			this.props.getCoins(parseInt(gameId));
		}

		// TODO global game - get global game 
		else {
			this.props.getGame(1);
			this.props.getCoins(1);
		}

	}

	handlePrintCoins = (event: any) => {
		this.props.getCoins(1);
		console.log(this.props.coinsAndPrices);
	}

	render() {
		const { gameId, error, game } = this.props;
		const global = gameId ? false : true;
		if (error) {
			return <p style={{ color: 'red' }}>{error}</p>
		}

		return (
			<div className="Game">
				<Container>
					<HeaderBar
						game={game}
						global={global}
					/>
					<InfoBar/>
					<Row>
						Table will go here
                </Row>
				</Container>
				<Button onClick={this.handlePrintCoins}>Print Coins</Button>
			</div>
		)
	}
}

const mapStateToProps = (state: RootState) => ({
	game: state.game.game,
	error: state.game.setGameErrorMessage,
	coinsAndPrices: state.coins.coins,
})

const mapDispatchToProps = {
	getCoins: Actions.coins.getAllCoinsForGame,
	getGame: Actions.game.getGame,
}

export default connect(mapStateToProps, mapDispatchToProps)(Game);