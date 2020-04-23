import * as React from 'react';
import { Table } from 'react-bootstrap';
import Actions from '../../redux/actions';
import { RootState } from '../../redux/reducers';
import { connect } from 'react-redux';

import CoinGraph from './coingraph/CoinGraph'
import { CoinsAndPrices, Ticker } from '../../redux/actions/Coins';

interface CoinInfoProps {
  allCoins: CoinsAndPrices;
	getCoins: (
		gameId: number,
		timeSpan?: number,
		sortBy?: number,
		pageNum?: number,
		numPerPage?: number
	) => void;
}

export class CoinInfo extends React.Component<CoinInfoProps> {

  componentDidMount() {
      this.props.getCoins(1, 1, 1, 1, 10);
  }

  private showPrice(id:number) {
    const { allCoins } = this.props;
    if(allCoins) {
      for (let i = 0; i < allCoins.length; i++) {
        if (allCoins[i].coin.id === id)
          return <div> ${Number(allCoins[i].prices[0].price).toFixed(2)}</div>
      }
      return <div>Retrieving...</div>
    } else {
      return <div>Error displaying price</div>
    }
  }
  private showChange(id:number) {
    const { allCoins } = this.props;
    if(allCoins) {
      for (let i = 0; i < allCoins.length; i++) {
        if (allCoins[i].coin.id === id) {
          var style = {color:'green'}
          var change = Number(allCoins[i].prices[0].price_change_day_pct) * 100
          if (change < 0) { style = {color:'red'} }
          if (!isNaN(change)){
            return <div style={style}>{Number(change).toFixed(2)}%</div>
          } else {
            return <div>Fetching...</div>
          }
        }
      }
      return <div>Retrieving...</div>
    } else {
      return <div>Error displaying price changes</div>
    }
  }
  private getChange(id:Number) {
    const { allCoins } = this.props;
    if(allCoins) {
      for (let i = 0; i < allCoins.length; i++) {
        if(allCoins[i].coin.id === id){
          return parseFloat(allCoins[i].prices[0].price_change_day_pct)
        }
      }
    }
    return 0
  }

  private getPrice(id:Number) {
    const { allCoins } = this.props;
    if(allCoins.length > 0) {
      for (let i = 0; i < allCoins.length; i++) {
        if(Number(allCoins[i].coin.id) === id){
          return allCoins[i].prices[0].price;
        }
      }
    }
    return 0
  }

  private parseTickers(id:Number) {
    let oneCoinTickers: Ticker
    this.props.allCoins.forEach(coinAndPrices => {
      if(Number(coinAndPrices.coin.id) === id){
        oneCoinTickers = coinAndPrices.prices
      }
    });

    return oneCoinTickers;
  }

private dynamicRowRender() {
  let rows: any = [];
  if (this.props.allCoins) {
    console.log(this.props.allCoins);
    rows = this.props.allCoins.map(coin => <tr key={coin.coin.id}>
                                           <td>{coin.coin.name} ({coin.coin.symbol})</td>
                                           <td>{this.showPrice(parseInt(coin.coin.id))}</td>
                                           <td><div><CoinGraph id={parseInt(coin.coin.id)}
                                                                              change={this.getChange(parseInt(coin.coin.id))}
                                                                              oneDayTickers={this.parseTickers(parseInt(coin.coin.id))}/>
                                                                              </div></td>
                                           <td>{this.showChange(parseInt(coin.coin.id))}</td>
                                           </tr> );
    rows = rows.slice(0,10) //only show first 10 coins - in reality need to filter through rows for certain coins
  }
  if(rows.length === 0){
    rows = <tr key={0}><td>No coins available to display</td></tr>
  }
  return rows
}

    render() {
        return (
            <Table responsive size="sm">
              <thead>
                <tr>
                  <th>Coin</th>
                  <th>Price</th>
                  <th><div>History</div></th>
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

});
const mapDispatchToProps = {
    getCoins: Actions.coins.getAllCoinsForGame,
};
export default connect(mapStateToProps, mapDispatchToProps)(CoinInfo);
