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
}

class CoinInfo extends React.Component<CoinInfoProps> {
  constructor(props: CoinInfoProps) {
      super(props);
  }

  componentDidMount() {
      this.props.getAllCoins();
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
          return <div>{Number(currentPrices[i].price_change_day_pct * 100).toFixed(2)}%</div>
        }
      }
      return <div>Retrieving...</div>
    } else {
      return <div>Error displaying price changes</div>
    }
  }

private dynamicRowRender() {
  let rows = [];
  rows = this.props.allCoins.map(coin => <tr>
                                         <td>{coin.name} ({coin.symbol})</td>
                                         <td>{this.showPrice(coin.id)}</td>
                                         <td><div align="center"><CoinGraph id={coin.id} currentPrices={this.props.currentPrices}/></div></td>
                                         <td>{this.showChange(coin.id)}</td>
                                         </tr> );
  rows = rows.slice(0,10) //only show first 10 coins - in reality need to filter through rows for certain coins
  return rows
}

    render() {
        return (
            <Table responsive size="sm">
              <thead>
                <th>Coin</th>
                <th>Price</th>
                <th><div align="center">History</div></th>
                <th>24hr % Change</th>
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
});
const mapDispatchToProps = {
    getAllCoins: Actions.coins.getAllCoins,
};
export default connect(mapStateToProps, mapDispatchToProps)(CoinInfo);
