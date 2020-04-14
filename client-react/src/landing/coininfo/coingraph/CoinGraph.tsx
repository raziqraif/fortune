import * as React from 'react';
import { Sparklines, SparklinesLine } from 'react-sparklines';

interface CoinGraphProps {
  id: Number;
  change: Number;
  oneDayTickers: Array<{tickers: currentPricesType}>;
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
    let erroneous = false;
    if(props.oneDayTickers.length > 0 && Number(state.data.length) === 0) {
      props.oneDayTickers.forEach(ticker => {
        if(!ticker.price || ticker.price === 0 || ticker.coin.symbol === "CO3") { erroneous = true }
          nData.push(ticker.price)
      });
    }
    nColor = (props.change < 0) ? 'red' : 'green'
    if (erroneous) { nData = [] }
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
