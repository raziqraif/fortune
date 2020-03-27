import * as React from 'react';
import { Sparklines, SparklinesLine } from 'react-sparklines';

interface CoinGraphProps {
  id: Number;
  currentPrices: currentPricesType;
}

export default class CoinGraph extends React.Component<CoinGraphProps> {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    }
  }

  static getDerivedStateFromProps(props,state){
    let nData = state.data
    if(props.currentPrices.length > 0) {
      nData.push(props.currentPrices[Number(props.id)-1].price)
    }
    return{ data: nData }
  }

    render() {
        return (
          <Sparklines data={this.state.data}>
            <SparklinesLine color="blue" />
          </Sparklines>
        )
    }//render()
}//class CoinGraph
