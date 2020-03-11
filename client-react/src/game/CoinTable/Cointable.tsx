import * as React from 'react';
import { Table } from 'react-bootstrap';
import CSS from 'csstype';
import CointableCoin from './CointableCoin';

interface CointableProps {
	coins: Array<{ id: string, name: string }>;
}

const styles: { [name: string]: CSS.Properties } = {
	main: {
		paddingTop: '1em',
	},
};

class Cointable extends React.Component<CointableProps> {
	render() {
		const { coins } = this.props;
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
					{
						coins.map(coin => (
							<CointableCoin
								coin={coin}
								key={coin.id}
							/>
						))
					}
					</tbody>
				</Table>
			</div>
		)
	}
}

export default Cointable