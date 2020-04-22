import * as React from "react";
import { Button, InputGroup, FormControl, Modal, Row } from 'react-bootstrap';
import CSS from 'csstype';
import { connect } from "react-redux";
import { RootState } from "../../redux/reducers";
import Actions from '../../redux/actions';

import CoinGraph from '../../landing/coininfo/coingraph'

interface CointableCoinProps {
	gameId: string;
	coin: { id: string, name: string };
	name: string;
	coinId: string;
	key: string;
	price: string;
	percent: string;
	number: string;
	error: string;
	transaction: (gameId: string, coinId: string, amount: string) => void;
	clearErrorMessages: () => void;
	tickers: Ticker;
	refetchCoinData: () => void;
}

interface CointableCoinState {
	amount: string;
	showConfirm: boolean;
	errMes: string;
	confirmMes: string;
	type: string;
}

enum transactionType {
	BUY,
	SELL
}

const styles: { [name: string]: CSS.Properties } = {
	errMes: {
		justifyContent: 'center',
		color: 'red',
	},

};

class CointableCoin extends React.Component<CointableCoinProps, CointableCoinState> {

	constructor(props: CointableCoinProps) {
		super(props);
		this.state = {
			amount: '',
			showConfirm: false,
			errMes: '',
			confirmMes: '',
			type: 'buy',
			amount_owned: '',
		}
	}
	static getDerivedStateFromProps(props, state) {
		return ({...state, amount_owned: props.number})
	}

	private handleChange = (event: any) => {
		this.setState({ amount: event.currentTarget.value });
	}

	private transactionDialogue = (type: transactionType) => {
		const amount = Number(this.state.amount);
		this.toggleConfirm();
		if (!amount || amount <= 0) { // invalid input
			this.setState({ errMes: 'Please enter a valid amount.' });
		} else {
			// build dialogue
			let confirmMes = "Are you sure you want to ";
			confirmMes += type === transactionType.BUY ? "buy" : "sell";
			confirmMes += " " + amount;
			confirmMes += " " + this.props.name + "?";
			this.setState({ confirmMes });
		}

		if (type === transactionType.BUY) {
			this.setState({ type: 'buy' });
		} else {
			this.setState({ type: 'sell' });
		}
	}

	private toggleConfirm = () => {
		const { showConfirm } = this.state;
		this.setState({ showConfirm: !showConfirm });

		// closing modal, so clear messages
		if (!showConfirm) {
			this.setState({ errMes: '' });
			this.setState({ confirmMes: '' });
			this.props.clearErrorMessages();
		}
	}

	private transaction = () => {
		const { amount, type } = this.state;
		var sentAmount: string;
		if (type === 'buy') {
			sentAmount = amount;
		}
		else {
			sentAmount = (-1 * Number(amount)).toString();
		}
		this.props.transaction(this.props.gameId, this.props.coinId, sentAmount).then(this.props.refetchCoinData());
		this.toggleConfirm();
	}

	render() {
		const name  = this.props.name;
		const price = this.props.price;
		var amount_owned = (parseFloat(this.state.amount_owned) === 0) ? '0' : parseFloat(this.state.amount_owned).toFixed(5)
		const percent = this.props.percent;
		const { showConfirm, errMes, confirmMes } = this.state;
		const price_f = Number(price).toFixed(2);
		const percent_f = Number(percent * 100).toFixed(3);
		var style = ((percent > 0) ? {color:'green'} : {color:'red'})
		var percent_div = (!isNaN(percent)) ? <div style={style}>{percent_f}%</div> : <div>Fetching...</div>
		return (
			<tr>
				<td>{name}</td>
				<td>${price_f}</td>
				<td width='300%'><CoinGraph id={this.props.coinId} change={percent} oneDayTickers={this.props.tickers}/></td>
				<td>{percent_div}</td>
				<td>
					<InputGroup className="mb-1">
						<FormControl
							placeholder=""
							aria-label=""
							aria-describedby="basic-addon1"
							value={this.state.amount}
							onChange={this.handleChange}
						/>
					</InputGroup>
				</td>
				<td><Button variant="outline-primary" onClick={() => this.transactionDialogue(transactionType.BUY)}>Buy</Button></td>
				<td><Button variant="outline-danger" onClick={() => this.transactionDialogue(transactionType.SELL)}>Sell</Button></td>
				<td>{amount_owned}</td>

				{/* confirmation modal */}
				<Modal show={showConfirm} onHide={this.toggleConfirm}>
					<Modal.Header closeButton>
						<Modal.Title>Confirm Transaction</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Row style={{ justifyContent: 'center' }}>{confirmMes}</Row>
						{
							errMes &&
							<Row style={styles.errMes}>{errMes}</Row>
						}
						{
							this.props.error &&
							<Row style={styles.errMes}>{this.props.error}</Row>
						}
					</Modal.Body>
					<Modal.Footer style={{ justifyContent: 'center' }}>
						{/* Only show confirm button if there are no errors */}
						{
							!errMes &&
							<Button variant="primary" onClick={this.transaction}>Confirm</Button>
						}
						<Button variant="secondary" onClick={this.toggleConfirm}>Cancel</Button>
					</Modal.Footer>
				</Modal>
			</tr>
		)
	}
}

const mapStateToProps = (state: RootState) => ({
    error: state.game.transactionErrorMessage,
});
const mapDispatchToProps = {
	transaction: Actions.game.transaction,
	clearErrorMessages: Actions.game.clearErrorMessages,
};

export default connect(mapStateToProps, mapDispatchToProps)(CointableCoin);