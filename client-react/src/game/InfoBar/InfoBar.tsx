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
	},
	coins: Array<{
		id: string;
		name: string;
		symbol: string;
		number: number;
	}>,
}

class InfoBar extends React.Component<InfoBarProps> {

	// TODO - get price of coins to calculate current net worth
	// also will probably have to worry about casting
	private getNetWorth = () => {
		let cash_d: number = Number(this.props.gameProfile.cash) ? Number(this.props.gameProfile.cash) : 0.0
		this.props.coins.forEach(coin => {
			cash_d = cash_d + 1 + Number(coin.number);
			console.log(cash_d)
		})
		return cash_d;
	}

	render() {
		const { gameProfile } = this.props;
		return (
			<div className="InfoBar" style={styles.main}>
				{/* Game info row */}
				<Row>
					<Col>
						<Row>
							<span>Cash: ${gameProfile.cash}</span>
						</Row>
						<Row>
							<span>Net worth: ${this.getNetWorth()}</span>
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