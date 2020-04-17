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
}

const styles: { [name: string]: CSS.Properties } = {
	main: {
		paddingTop: '1em',
	},
};

type coinWithPrice = { id: string, name: string, symbol: string, number: string, price: string };

class Cointable extends React.Component<CointableProps> {

private newCoinRows = (coins: CoinsAndPrices) => {
		let rows: JSX.Element[] = [];
		coins.forEach(cnp => {
			let coin = cnp.coin
			let price = cnp.prices
			rows.push(
				<CointableCoin
				  gameId={this.props.gameId}
					name={coin.name}
					key={coin.id}
					number={coin.number}
					price={Number(price[0].price)}
					percent={Number(price[0].price_change_day_pct)}
				/>
			)
		})
		return rows;
}

	private createCoinRows = (coins: CoinsAndPrices) => {
		let rows: JSX.Element[] = [];
		const { currentPrices } = this.props;
		let coinsWithPrices: Array<coinWithPrice> = [];
		if (coins.length > 0) {
			coins.forEach(coin => {
				for (let i = 0; i < currentPrices.length; i++) {
					if (currentPrices[i].coin.id === Number(coin.coin.id)) {
						coinsWithPrices.push({ ...coin.coin, price: coin.prices[0].price.toString() });
						break;
					}
				}

			})

			if (this.props.priceOrder === priceOrder.MINIMUM) {
				coinsWithPrices.sort(this.sortMin);
			} else {
				coinsWithPrices.sort(this.sortMax);
			}

			coinsWithPrices.forEach(coin => {
				rows.push(
					<CointableCoin
						coin={coin}
						key={coin.id}
						number={coin.number}
						price={coin.price}
					/>
				)
			})
		}

		return rows;
	}

	private sortMin = (coinA: coinWithPrice, coinB: coinWithPrice) => {
		const priceA = Number(coinA.price);
		const priceB = Number(coinB.price);
		if (priceA > priceB) return 1;
		if (priceA < priceB) return -1;
		return 0;
	}

	private sortMax = (coinA: coinWithPrice, coinB: coinWithPrice) => {
		const priceA = Number(coinA.price);
		const priceB = Number(coinB.price);
		if (priceA < priceB) return 1;
		if (priceA > priceB) return -1;
		return 0;
	}

	render() {
		const coinRows = this.newCoinRows(this.props.coins);
		return (
			<div className="Cointable" style={styles.main}>
				<Table bordered>
					<thead>
						<tr>
							<th>Coin</th>
							<th>Price</th>
							<th>Graph</th>
							<th>% Change</th>
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
