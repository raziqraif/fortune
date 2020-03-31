import * as React from 'react';
import Actions from '../../redux/actions';
import { Row, Col, Button, ButtonGroup } from 'react-bootstrap';
import CSS from 'csstype';
import { connect } from 'react-redux';

const styles: { [name: string]: CSS.Properties } = {
	main: {
		paddingTop: '1em',
	},
};

interface InfoBarProps {
	gameProfile: {
		cash: string,
		netWorth: string
	},
	coins: Array<{
		id: string;
		name: string;
		symbol: string;
		number: number;
	}>,
	liquify: () => void,
}

interface InfoBarState {
	timeSpan: timeSpan,
	price: price,
}

enum timeSpan {
	HOUR,
	DAY,
	WEEK,
	MONTH,
	YEAR,
}

enum price {
	MINIMUM,
	MAXIMUM,
}

class InfoBar extends React.Component<InfoBarProps, InfoBarState> {

	constructor(props: InfoBarProps) {
		super(props);
		this.state = {
			timeSpan: timeSpan.HOUR,
			price: price.MINIMUM,
		}
	}

	private changeTimeSpan = (timeSpan: timeSpan) => {
		this.setState({ timeSpan });
	}

	private changePrice = (price: price) => {
		this.setState({ price });
	}

	private liquify = () => {
		this.props.liquify();
	}

	render() {
		let { cash, netWorth } = this.props.gameProfile;
		// format cash values to have 2 numbers past decimal
		const cashDecimalIndex = cash.indexOf('.');
		const netWorthDecimalIndex = netWorth.indexOf('.');
		if (cashDecimalIndex === -1) {
			cash = cash + '.00'
		} else {
			cash = cash.substring(0, cashDecimalIndex + 3)
		}

		if (netWorthDecimalIndex === -1) {
			netWorth = netWorth + '.00'
		} else {
			netWorth = netWorth.substring(0, netWorthDecimalIndex + 3)
		}
		
		return (
			<div className="InfoBar" style={styles.main}>
				{/* Game info row */}
				<Row>
					<Col>
						<Row>
							Cash: ${cash}
						</Row>
						<Row>
							Net worth: ${netWorth}
						</Row>
					</Col>

					<Col>
						<Button variant="primary" onClick={this.liquify}>Liquify</Button>
					</Col>

					<Col>
						Time span:
						<ButtonGroup aria-label="Time Span">
							<Button variant="secondary" onClick={() => this.changeTimeSpan(timeSpan.HOUR)}>Hour</Button>
							<Button variant="secondary" onClick={() => this.changeTimeSpan(timeSpan.DAY)}>Day</Button>
							<Button variant="secondary" onClick={() => this.changeTimeSpan(timeSpan.WEEK)}>Week</Button>
							<Button variant="secondary" onClick={() => this.changeTimeSpan(timeSpan.MONTH)}>Month</Button>
							<Button variant="secondary" onClick={() => this.changeTimeSpan(timeSpan.YEAR)}>Year</Button>
						</ButtonGroup>
					</Col>

					<Col>
						<div style={{ alignSelf: 'center' }}>Price:  </div>
						<ButtonGroup aria-label="Price">
							<Button variant="secondary" onClick={() => this.changePrice(price.MINIMUM)}>Minimum</Button>
							<Button variant="secondary" onClick={() => this.changePrice(price.MAXIMUM)}>Maximum</Button>
						</ButtonGroup>
					</Col>
				</Row>
			</div>
		)
	}
}

const mapDispatchToProps = {
    liquify: Actions.game.liquify,
};

// no mapStateToProps, so pass null as first arg
export default connect(null, mapDispatchToProps)(InfoBar);