import * as React from 'react';
import { Sparklines, SparklinesLine } from 'react-sparklines';

interface CoinGraphProps {
  id: Number;
  change: Number;
  oneDayTickers: Ticker;
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
    let nData = []
    let nColor = state.color
    let erroneous = false;
    if(props.oneDayTickers.length > 0) {
      props.oneDayTickers.forEach(ticker => {
        if(!ticker.price || ticker.price <= 0 ) { erroneous = true }
        nData.push(ticker.price)
      });
    }
    nColor = (props.change < 0) ? 'red' : 'green'
    if (erroneous) { nData = [] }
    nData.reverse();
    return{ data: nData,
            color: nColor }
  }

    render() {
      //no limit since time span changes depending on selected timespan. tickers are shifted instead.
        return (
          <Sparklines data={this.state.data}>
            <SparklinesLine color={this.state.color} />
          </Sparklines>
        )
    }//render()
}//class CoinGraph
