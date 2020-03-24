import * as React from 'react';
import Actions from '../../redux/actions';
import { Row, Col, Button, ButtonGroup } from 'react-bootstrap';
import CSS from 'csstype';
import { connect } from 'react-redux';
import { price } from '../Game';

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
	liquify: () => void,
	changePrice: (price: price) => void,
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
		this.props.changePrice(price);
	}

	private liquify = () => {
		this.props.liquify();
	}

	// TODO - get price of coins to calculate current net worth
	// also will probably have to worry about casting
	private getNetWorth = () => {
		let cash_d: number = Number(this.props.gameProfile.cash) ? Number(this.props.gameProfile.cash) : 0.0
		this.props.coins.forEach(coin => {
			cash_d = cash_d + 1 + Number(coin.number);
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
						<Button variant="primary" onClick={this.liquify}>Liquify</Button>
					</Col>

					<Col>
						<div style={{ alignSelf: 'center' }}>Time span:  </div>
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