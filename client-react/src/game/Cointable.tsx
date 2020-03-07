import * as React from 'react';
import { Row, Container, Col } from 'react-bootstrap';
import CSS from 'csstype';
import moment from 'moment';

class Cointable extends React.Component {

	render() {
		return (
			<div className="Cointable">
				<Container>
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
				</Container>
			</div>
		)
	}
}

export default Cointable