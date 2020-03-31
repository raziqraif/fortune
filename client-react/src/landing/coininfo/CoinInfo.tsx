import * as React from 'react';
import { Table } from 'react-bootstrap';
import Actions from '../../redux/actions';
import { RootState } from '../../redux/reducers';
import { currentPricesType } from '../../redux/reducers/CoinReducer';
import { connect } from 'react-redux';

import CoinGraph from './coingraph/CoinGraph'

interface CoinInfoProps {
  allCoins: Array<{ id: string, name: string, symbol:string}>;
  getAllCoins: () => {};
  currentPrices: currentPricesType;
  oneDayTickers: Array<{tickers: currentPricesType}>;
  get24hrTickers: () => {};
}

class CoinInfo extends React.Component<CoinInfoProps> {

  componentDidMount() {
      this.props.getAllCoins();
      this.props.get24hrTickers();
  }

  private showPrice(id:number) {
    const { currentPrices } = this.props;
    if(currentPrices) {
      for (let i = 0; i < currentPrices.length; i++) {
        if(currentPrices[i].coin.id === id) {
          return <div> ${Number(currentPrices[i].price).toFixed(2)}</div>
        }
      }
      return <div>Retrieving...</div>
    } else {
      return <div>Error displaying price</div>
    }
  }
  private showChange(id:number) {
    const { currentPrices } = this.props;
    if(currentPrices) {
      for (let i = 0; i < currentPrices.length; i++) {
        if(currentPrices[i].coin.id === id){
          var style = {color:'green'}
          var change = Number(currentPrices[i].price_change_day_pct) * 100
          if (change < 0) { style = {color:'red'} }
          return <div style={style}>{Number(change).toFixed(2)}%</div>
        }
      }
      return <div>Retrieving...</div>
    } else {
      return <div>Error displaying price changes</div>
    }
  }
  private getChange(id:Number) {
    const { currentPrices } = this.props;
    if(currentPrices) {
      for (let i = 0; i < currentPrices.length; i++) {
        if(currentPrices[i].coin.id === id){
          return currentPrices[i].price_change_day_pct
        }
      }
    }
    return 0
  }

  private getPrice(id:Number) {
    const { currentPrices } = this.props;
    if(currentPrices.length > 0) {
      for (let i = 0; i < currentPrices.length; i++) {
        if(Number(currentPrices[i].coin.id) === id){
          return currentPrices[i].price
        }
      }
    }
    return 0
  }

  private parseTickers(id:Number) {
    let oneCoinTickers: Array<{tickers: currentPricesType}> = [];
    this.props.oneDayTickers.forEach(ticker => {
      if(Number(ticker.coin.id) === id){
        oneCoinTickers.push(ticker)
      }
    });

    return oneCoinTickers;
  }


  private compareCoinPrices(coin1, coin2) {
    return this.getPrice(coin2.id) - this.getPrice(coin1.id);
  }

private dynamicRowRender() {
  let rows = [];
  let sortedCoins = this.props.allCoins
  sortedCoins.sort(this.compareCoinPrices.bind(this))
  rows = sortedCoins.map(coin => <tr key={coin.id}>
                                         <td>{coin.name} ({coin.symbol})</td>
                                         <td>{this.showPrice(coin.id)}</td>
                                         <td><div align="center"><CoinGraph id={coin.id}
                                                                            change={this.getChange(coin.id)}
                                                                            oneDayTickers={this.parseTickers(coin.id)}/>
                                                                            </div></td>
                                         <td>{this.showChange(coin.id)}</td>
                                         </tr> );
  rows = rows.slice(0,10) //only show first 10 coins - in reality need to filter through rows for certain coins
  return rows
}

    render() {
        return (
            <Table responsive size="sm">
              <thead>
                <tr>
                  <th>Coin</th>
                  <th>Price</th>
                  <th><div align="center">History</div></th>
                  <th>24hr % Change</th>
                </tr>
              </thead>

              <tbody>
              {this.dynamicRowRender()}
              </tbody>
            </Table>
        )
    }//render()
}//class CoinInfo

const mapStateToProps = (state: RootState) => ({
    allCoins: state.coins.coins,
    currentPrices: state.coins.currentPrices,
    oneDayTickers: state.coins.oneDayTickers,

});
const mapDispatchToProps = {
    getAllCoins: Actions.coins.getAllCoins,
    get24hrTickers: Actions.coins.get24hrTickers,
};
export default connect(mapStateToProps, mapDispatchToProps)(CoinInfo);
