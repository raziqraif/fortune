import * as React from "react";
import { Button, InputGroup, FormControl } from 'react-bootstrap';

interface CointableCoinProps {
	coin: { id: string, name: string };
	price: string;
}

interface CointableCoinState {
	amount: string;
}

enum transactionType {
	BUY,
	SELL
}

class CointableCoin extends React.Component<CointableCoinProps, CointableCoinState> {

	constructor(props: CointableCoinProps) {
		super(props);
		this.state = {
			amount: ''
		}
	}

	private handleChange = (event: any) => {
		this.setState({ amount: event.currentTarget.value });
	}

	private transaction = (type: transactionType) => {
		const amount = Number(this.state.amount);
		if (!amount || amount <= 0) return;
		console.log(amount);
	}

	render() {
		const { name } = this.props.coin;
		const { price } = this.props;
		return (
			<tr>
				<td>{name}</td>
				<td>{price}</td>
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
				<td><Button variant="outline-primary" onClick={() => this.transaction(transactionType.BUY)}>Buy</Button></td>
				<td><Button variant="outline-danger" onClick={() => this.transaction(transactionType.SELL)}>Sell</Button></td>
				<td>1.05</td>
			</tr>
		)
	}
}

export default CointableCoin