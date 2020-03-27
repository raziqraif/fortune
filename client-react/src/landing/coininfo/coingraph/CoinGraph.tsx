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
      data: [],
      color: 'green',
    }
  }

  static getDerivedStateFromProps(props,state){
    let nData = state.data
    let nColor = state.color
    if(props.currentPrices.length > 0) {
      nData.push(props.currentPrices[Number(props.id)-1].price)
      nColor = (Number(props.currentPrices[Number(props.id)-1].price_change_day_pct) < 0) ? 'red' : 'green'
    }
    return{ data: nData,
            color: nColor }
  }

    render() {
        return (
          <Sparklines data={this.state.data}>
            <SparklinesLine color={this.state.color} />
          </Sparklines>
        )
    }//render()
}//class CoinGraph
