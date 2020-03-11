import * as React from "react";

interface CointableCoinProps {
	coin: { id: string, name: string };
}

class CointableCoin extends React.Component<CointableCoinProps> {

	render() {
		const { name } = this.props.coin;
		return (
			<tr>
				<td>{name}</td>
				<td>$1.05</td>
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