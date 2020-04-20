import * as React from 'react';
import { RootState } from '../redux/reducers';
import {Col, Row, Container} from 'react-bootstrap';
import Actions from '../redux/actions';
import { connect } from 'react-redux';
import { GameType } from '../redux/actions/Game';
import HeaderBar from './HeaderBar/HeaderBar';
import InfoBar from './InfoBar/InfoBar';
import GameChat from "./chat";
import { CoinsAndPrices } from '../redux/actions/Coins';
import Cointable from './CoinTable/Cointable';
import "./Game.css"

interface GameProps {
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
	game: GameType
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
	gameID = -1;

	constructor(props: GameProps) {
		super(props);

		this.state = {
			priceOrder: priceOrder.MINIMUM,
		}
	}

	componentDidMount() {
		const { gameId } = this.props;
		if (!gameId) { // global game
			this.gameID = 1;
			this.props.getGame(1);
			this.props.getCoins(1);
		} else {
			const id = parseInt(gameId);
			if (isNaN(id)) this.props.history.push('/'); // non-numerical ID
			else {
				this.gameID = id;
				this.props.getGame(id); // private game
				this.props.getCoins(id);
			}
		}
	}

	private changePriceOrder = (priceOrder: priceOrder) => {
		this.setState({ priceOrder });
	}

	render() {
		const { gameId, error, game, coinsAndPrices } = this.props;
		const { priceOrder } = this.state;
		const global = (!gameId || parseInt(gameId) == 1)
		if (error) {
			return <p style={{ color: 'red' }}>{error}</p>
		}

		return (
			<div className="Game-container">
				<div className="Chat-container"/>
				<div className={"GameDetails-container"}>
					<HeaderBar
						game={game.data}
						global={global}
						history={this.props.history}
						gameId={gameId}
					/>
					<InfoBar
						gameProfile={game.gameProfile}
						coins={coinsAndPrices}
						changePriceOrder={this.changePriceOrder}
					/>
					{/* <Cointable
					coins={coinsAndPrices}
					priceOrder={priceOrder}
					/> */}
				</div>
				<div className="Chat-container">
					<GameChat gameID={this.gameID}/>
				</div>
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
