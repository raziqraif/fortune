import * as React from "react";

interface CointableCoinProps {
	coin: { id: string, name: string };
	price: string;
}

class CointableCoin extends React.Component<CointableCoinProps> {

	render() {
		const { name } = this.props.coin;
		const { price } = this.props;
		return (
			<tr>
				<td>{name}</td>
				<td>{price}</td>
				<td>^^_^_^^^____^_^_^_</td>
				<td>+.4%</td>
				<td>____</td>
				<td>Buy</td>
				<td>Sell</td>
				<td>1.05</td>
			</tr>
		)
	}
}

export default CointableCoin