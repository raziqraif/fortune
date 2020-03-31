import * as React from 'react';
import { RootState } from '../redux/reducers';
import { Container } from 'react-bootstrap';
import Actions from '../redux/actions';
import { connect } from 'react-redux';
import { GameType } from '../redux/actions/Game';
import HeaderBar from './HeaderBar/HeaderBar';
import InfoBar from './InfoBar/InfoBar';
import Cointable from './CoinTable/Cointable';

interface GameProps {
	getGame: (
		id: number
	) => void;
	gameId?: string;
	game: {
		data: GameType,
		gameProfile: {
			cash: string,
		},
		coins: Array<{
			id: string;
			name: string;
			symbol: string;
			number: string;
		}>
	}
	error: string;
	history: any;
}

interface GameState {
	priceOrder: priceOrder;
}

export enum priceOrder {
	MINIMUM,
	MAXIMUM,
}

class Game extends React.Component<GameProps, GameState> {

	constructor(props: GameProps) {
		super(props);

		this.state = {
			priceOrder: priceOrder.MINIMUM,
		}
	}

	componentDidMount() {
		const { gameId } = this.props;
		if (!gameId) { // global game
			this.props.getGame(1);
		} else {
			const id = parseInt(gameId);
			if (isNaN(id)) this.props.history.push('/'); // non-numerical ID
			else this.props.getGame(id); // private game
		}
	}

	private changePriceOrder = (priceOrder: priceOrder) => {
		this.setState({ priceOrder });
	}

	render() {
		const { gameId, error, game } = this.props;
		const { priceOrder } = this.state;
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
						coins={game.coins}
						changePriceOrder={this.changePriceOrder}
					/>
					<Cointable
						coins={game.coins}
						priceOrder={priceOrder}
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
