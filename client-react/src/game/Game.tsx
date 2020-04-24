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
		timeSpan: number,
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
	timeSpan: number;
}

export enum priceOrder {
	MINIMUM,
	MAXIMUM,
}

class Game extends React.Component<GameProps, GameState> {
	gameID: number;

	constructor(props: GameProps) {
		super(props);
		if (!props.gameId) {
			this.gameID = 1;
		}
		else {
			this.gameID = parseInt(props.gameId)
		}
		this.state = {
			priceOrder: priceOrder.MINIMUM,
			timeSpan: 0,
		}
	}

	componentDidMount() {
		this.getGameData()
		this.getCoinData()
	}

	private getGameData() {
		const { gameId } = this.props;
		// global game
		if (!gameId) { 	// Raziq's Note: I'm getting typescript error without this clause, so I added this back
			// tho it has been removed in develop
			this.gameID = 1;
			this.props.getGame(1);
		} else {
			const id = parseInt(gameId);
			if (isNaN(id)) {
				this.props.history.push('/'); // non-numerical ID
			} else {
				this.gameID = id;
				this.props.getGame(id); // private game
			}
		}
	}

	private getCoinData() {
		const { gameId } = this.props;
		const id = parseInt(gameId ? gameId : "");
		if (isNaN(id)){
			this.props.history.push('/'); // non-numerical ID
		} else {
			this.props.getCoins(id,this.state.timeSpan);
		}
	}

	private changePriceOrder = (priceOrder: priceOrder) => {
		this.setState({ priceOrder: priceOrder });
	}

	private setTimespan = (timespan:number) => {
		this.props.getCoins(this.props.gameId ? Number(this.props.gameId) : 1, timespan)
		this.setState({timeSpan: timespan})
	}

	private refetchCoinData = () => {
		this.getCoinData()
	}

	render() {
		const { gameId, error, game, coinsAndPrices } = this.props;
		const { priceOrder } = this.state;
		if (error) {
			return <p style={{ color: 'red' }}>{error}</p>
		}

		return (
			<div className="Game-container">
				<div className="Chat-container"/>
				<div className={"GameDetails-container"}>
					<HeaderBar
						game={game.data}
						history={this.props.history}
						gameId={gameId}
					/>
					<InfoBar
						coins={coinsAndPrices}  // Raziq: Typescript says this is required. Hope this is correct
						gameId={gameId ? gameId : '1'}
						gameProfile={game.gameProfile}
						changePriceOrder={this.changePriceOrder}
						changeTimeSpan={this.setTimespan}
					/>
					<Cointable
						gameId={gameId ? gameId : '1'}
						coins={coinsAndPrices}
						priceOrder={priceOrder}
						refetchCoinData={this.refetchCoinData}
					/>
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
