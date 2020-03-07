import * as React from 'react';
import { Row, Container, Col } from 'react-bootstrap';
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
				<Row>
					<Col>
						<span>Coin</span>
					</Col>
					<Col>
						<span>Price</span>
					</Col>
					<Col>
						<span>Graph</span>
					</Col>
					<Col>
						<span>Change</span>
					</Col>
					<Col>
						<span>Trade Amount</span>
					</Col>
					<Col>
						<span>Buy</span>
					</Col>
					<Col>
						<span>Sell</span>
					</Col>
					<Col>
						<span>Your Amount</span>
					</Col>
				</Row>
				{
					coins.map(coin => (
						<CointableCoin
							coin={coin}
							key={coin.id}
						/>
					))
				}

			</div>
		)
	}
}

export default Cointable