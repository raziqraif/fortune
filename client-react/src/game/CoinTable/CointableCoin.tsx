import * as React from "react";
import { Row, Col } from 'react-bootstrap';

interface CointableCoinProps {
	coin: { id: string, name: string };
}

class CointableCoin extends React.Component<CointableCoinProps> {

	render() {
		const { name } = this.props.coin;
		return (
			<div className="Coin">
				<Row>
					<Col>
						<span>{name}</span>
					</Col>
					<Col>
						<span>$100</span>
					</Col>
					<Col>
						<span>^^_^_^^^___^^</span>
					</Col>
					<Col>
						<span>+.4%</span>
					</Col>
					<Col>
						<span>_______</span>
					</Col>
					<Col>
						<span>Buy</span>
					</Col>
					<Col>
						<span>Sell</span>
					</Col>
					<Col>
						<span>1.05</span>
					</Col>
				</Row>
			</div>
		)
	}
}

export default CointableCoin