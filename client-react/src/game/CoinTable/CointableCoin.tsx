import * as React from "react";
import { Button, InputGroup, FormControl, Modal, Row } from 'react-bootstrap';
import CSS from 'csstype';
import { connect } from "react-redux";
import { RootState } from "../../redux/reducers";
import Actions from '../../redux/actions';

interface CointableCoinProps {
	coin: { id: string, name: string };
	price: string;
	number: string;
	error: string;
	transaction: (amount: string, type: string) => void;
	clearErrorMessages: () => void;
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
		}
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
			confirmMes += " " + this.props.coin.name + "?";
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
		this.props.transaction(amount, type);
	}

	render() {
		const { name } = this.props.coin;
		const { price, number } = this.props;
		const { showConfirm, errMes, confirmMes } = this.state;
		const price_f = price.substring(0, price.indexOf('.') + 3); // 2 digits after decimal
		return (
			<tr>
				<td>{name}</td>
				<td>${price_f}</td>
				<td>^^_^_^^^____^_^_^_</td>
				<td>+.4%</td>
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
				<td>{number}</td>

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