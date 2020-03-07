import * as React from 'react';
import { Container, Row, Col, Button, ButtonGroup } from 'react-bootstrap';
import CSS from 'csstype';
import moment from 'moment';

class InfoBar extends React.Component {

	render() {
		return (
			<div className="InfoBar">
				{/* Game info row */}
				<Row>
					<Col>
						<Row>
							<span>Cash: $45990</span>
						</Row>
						<Row>
							<span>Net worth: $60592</span>
						</Row>
					</Col>

					<Col>
						<Button variant="primary">Liquefy</Button>
					</Col>

					<Col>
						<ButtonGroup aria-label="Time Span">
							<div>Time span:  </div>
							<Button variant="secondary">Hour</Button>
							<Button variant="secondary">Day</Button>
							<Button variant="secondary">Week</Button>
							<Button variant="secondary">Month</Button>
							<Button variant="secondary">Year</Button>
						</ButtonGroup>
					</Col>

					<Col>
						<ButtonGroup aria-label="Price">
							<div>Price:  </div>
							<Button variant="secondary">Minimum</Button>
							<Button variant="secondary">Maximum</Button>
						</ButtonGroup>
					</Col>
				</Row>
			</div>
		)
	}
}

export default InfoBar;