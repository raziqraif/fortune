import * as React from 'react';
import { RootState } from '../redux/reducers';
import { Container } from 'react-bootstrap';
import Actions from '../redux/actions';
import { connect } from 'react-redux';
import { GameType } from '../redux/actions/Game';
import HeaderBar from './HeaderBar/HeaderBar';
import InfoBar from './InfoBar/InfoBar';
import { CoinsAndPrices } from '../redux/actions/Coins';
import Cointable from './CoinTable/Cointable';

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

	constructor(props: GameProps) {
		super(props);

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
		const id = parseInt(gameId);
		if (isNaN(id)) {
			this.props.history.push('/'); // non-numerical ID
		} else {
			this.props.getGame(id); // private game
		}
	}

	private getCoinData() {
		const { gameId } = this.props;
		const id = parseInt(gameId);
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
		this.props.getCoins(this.props.gameId,timespan)
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
			<div className="Game">
				<Container fluid>
					<HeaderBar
						game={game.data}
						history={this.props.history}
						gameId={gameId}
					/>
					<InfoBar
						gameId={gameId ? gameId : '1'}
						gameProfile={game.gameProfile}
						changePriceOrder={this.changePriceOrder}
						changeTimeSpan={this.setTimespan}
					/>
					<Cointable
						gameId={gameId}
						coins={coinsAndPrices}
						priceOrder={priceOrder}
						refetchCoinData={this.refetchCoinData}
					/>
				</Container>
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
