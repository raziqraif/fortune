import * as React from 'react';
import Actions from '../../redux/actions';
import { Row, Col, Button, ButtonGroup } from 'react-bootstrap';
import CSS from 'csstype';
import { connect } from 'react-redux';
import { RootState } from '../../redux/reducers';

const styles: { [name: string]: CSS.Properties } = {
	main: {
		paddingTop: '1em',
	},
};

interface InfoBarProps {
	cash: string,
	netWorth: string
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
		}
	}

	private changeTimeSpan = (timeSpan: timeSpan) => {
		this.setState({ timeSpan });
	}

	private liquify = () => {
		this.props.liquify();
	}

	render() {
		let { cash, netWorth } = this.props;
		// format cash values to have 2 numbers past decimal
		cash = Number(cash).toFixed(2);
		netWorth = Number(netWorth).toFixed(2);
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
				</Row>
			</div>
		)
	}
}

const mapStateToProps = (state: RootState) => ({
	netWorth: state.game.game.gameProfile.netWorth,
	cash: state.game.game.gameProfile.cash,
})
const mapDispatchToProps = {
	liquify: Actions.game.liquify,
};

// no mapStateToProps, so pass null as first arg
export default connect(mapStateToProps, mapDispatchToProps)(InfoBar);
