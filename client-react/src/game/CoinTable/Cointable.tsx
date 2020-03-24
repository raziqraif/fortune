import * as React from 'react';
import { Table } from 'react-bootstrap';
import CSS from 'csstype';
import CointableCoin from './CointableCoin';
import { currentPricesType } from '../../redux/reducers/CoinReducer';
import { connect } from 'react-redux';
import { RootState } from '../../redux/reducers';
import { priceOrder } from '../Game';

interface CointableProps {
	coins: Array<{
		id: string;
		name: string;
		symbol: string;
		number: string;
	}>;
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

	private createCoinRows = (coins: Array<{
		id: string;
		name: string;
		symbol: string;
		number: string;
	}>) => {
		let rows: JSX.Element[] = [];
		const { currentPrices } = this.props;
		let coinsWithPrices: Array<coinWithPrice> = [];
		coins.forEach(coin => {
			for (let i = 0; i < currentPrices.length; i++) {
				if (currentPrices[i].coin.id === Number(coin.id)) {
					coinsWithPrices.push({ ...coin, price: currentPrices[i].price });
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
		const coinRows = this.createCoinRows(this.props.coins);
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
