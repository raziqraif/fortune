import * as React from "react";

interface CointableCoinProps {
	coin: { id: string, name: string };
}

class CointableCoin extends React.Component<CointableCoinProps> {


    
    render() {
        const { name } = this.props.coin;
        return (
            <div className="Coin">
                {name}
            </div>
        )
    }
}

export default CointableCoin