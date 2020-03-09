import * as React from 'react';
import { Row, Col, Button, ButtonGroup } from 'react-bootstrap';
import CSS from 'csstype';

const styles: { [name: string]: CSS.Properties } = {
	main: {
		paddingTop: '1em',
	},
};

interface InfoBarProps {
	gameProfile: {
		cash: string,
	}
}

class InfoBar extends React.Component<InfoBarProps> {


	render() {
		return (
			<div className="InfoBar" style={styles.main}>
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
						<div style={{ alignSelf: 'center' }}>Time span:  </div>
						<ButtonGroup aria-label="Time Span">
							<Button variant="secondary">Hour</Button>
							<Button variant="secondary">Day</Button>
							<Button variant="secondary">Week</Button>
							<Button variant="secondary">Month</Button>
							<Button variant="secondary">Year</Button>
						</ButtonGroup>
					</Col>

					<Col>
						<div style={{ alignSelf: 'center' }}>Price:  </div>
						<ButtonGroup aria-label="Price">
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