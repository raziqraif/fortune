import * as React from 'react';
import { Table } from 'react-bootstrap';
import CSS from 'csstype';
import CointableCoin from './CointableCoin';
import { currentPricesType } from '../../redux/reducers/CoinReducer';
import { connect } from 'react-redux';
import { RootState } from '../../redux/reducers';

interface CointableProps {
	coins: Array<{ id: string, name: string }>;
	currentPrices: currentPricesType;
}

const styles: { [name: string]: CSS.Properties } = {
	main: {
		paddingTop: '1em',
	},
};

class Cointable extends React.Component<CointableProps> {

	private createCoinRows = (coins: Array<{ id: string, name: string }>) => {
		let rows: JSX.Element[] = [];
		const { currentPrices } = this.props;
		coins.forEach(coin => {
			let price = '';
			for (let i = 0; i < currentPrices.length; i++) {
				if (currentPrices[i].coin.id === Number(coin.id)) {
					price = currentPrices[i].price;
					break;
				}
			}
			rows.push(
				<CointableCoin
					coin={coin}
					key={coin.id}
					price={price}
				/>
			)
		})
		return rows;
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
