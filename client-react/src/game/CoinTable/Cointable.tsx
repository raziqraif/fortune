import * as React from 'react';
import { Table } from 'react-bootstrap';
import CSS from 'csstype';
import CointableCoin from './CointableCoin';
import { currentPricesType } from '../../redux/reducers/CoinReducer';
import { connect } from 'react-redux';
import { RootState } from '../../redux/reducers';
import { priceOrder } from '../Game';
import { CoinsAndPrices } from '../../redux/actions/Coins';

interface CointableProps {
	gameId:string
	coins: CoinsAndPrices;
	currentPrices: currentPricesType;
	priceOrder: priceOrder;
	refetchCoinData: () => void;
}

const styles: { [name: string]: CSS.Properties } = {
	main: {
		paddingTop: '1em',
	},
};

type coinWithPrice = { id: string, name: string, symbol: string, number: string, price: string };

class Cointable extends React.Component<CointableProps> {

private createCoinRows = (coins: CoinsAndPrices) => {
		let rows: JSX.Element[] = [];
		if(coins){
			if (this.props.priceOrder === priceOrder.MINIMUM) {
				coins.sort(this.sortMin);
			} else {
				coins.sort(this.sortMax);
			}
			coins.forEach(cnp => { //cnp - "coins n prices"
				let coin = cnp.coin
				let price = cnp.prices
				rows.push(
					<CointableCoin
					  gameId={this.props.gameId}
						name={coin.name}
						coinId={coin.id}
						number={coin.number}
						key={coin.id}
						price={Number(price[0].price)}
						percent={Number(price[0].price_change_day_pct)}
						tickers={this.parseTickers(coin.id)}
						refetchCoinData={this.props.refetchCoinData}
					/>
				)
			})
		}
		return rows;
}


	private sortMin = (coinA: coinAndPrices, coinB: coinAndPrices) => {
		const priceA = Number(coinA.prices[0].price);
		const priceB = Number(coinB.prices[0].price);
		if (priceA > priceB) return 1;
		if (priceA < priceB) return -1;
		return 0;
	}

	private sortMax = (coinA: coinAndPrices, coinB: coinAndPrices) => {
		const priceA = Number(coinA.prices[0].price);
		const priceB = Number(coinB.prices[0].price);
		if (priceA < priceB) return 1;
		if (priceA > priceB) return -1;
		return 0;
	}

	private parseTickers(id:Number) {
	let oneCoinTickers: Ticker
	this.props.coins.forEach(coinAndPrices => {
		if(Number(coinAndPrices.coin.id) === id){
			oneCoinTickers = coinAndPrices.prices
		}
	});
	oneCoinTickers.pop(); //pop oldest ticker to make graph appear that it is moving
	return oneCoinTickers;
}

	render() {
		const coinRows = this.createCoinRows(this.props.coins);
		return (
			<div className="Cointable" style={styles.main}>
				<Table bordered>
					<thead>
						<tr key={0}>
							<th>Coin</th>
							<th>Price</th>
							<th>Graph</th>
							<th>24 hr % Change</th>
							<th>Trade Amount</th>
							<th>Buy</th>
							<th>Sell</th>
							<th>Your Amount</th>
						</tr>
					</thead>
					<tbody>
						{coinRows}
					</tbody>
				</Table>
			</div>
		)
	}
}

const mapStateToProps = (state: RootState) => ({
	currentPrices: state.coins.currentPrices,
})
export default connect(mapStateToProps)(Cointable)
