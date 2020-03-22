import * as React from 'react';
import { Table } from 'react-bootstrap';
import Actions from '../../redux/actions';
import { RootState } from '../../redux/reducers';
import { connect } from 'react-redux';
import io from 'socket.io-client'

import CoinGraph from './coingraph/CoinGraph'

interface CoinInfoProps {
  allCoins: Array<{ id: string, name: string, symbol:string}>;
  getAllCoins: () => {};
}

class CoinInfo extends React.Component<CoinInfoProps> {
  constructor(props: CoinInfoProps) {
      super(props);
      this.state ={
        data:{},
      }
  }

  componentDidMount() {
      this.props.getAllCoins();
      const socket = io('http://localhost:5000').connect();
      socket.on('message', function(data:any){
        this.setState({data:data});
        console.log('yuh', this.state.data);
      }.bind(this));
  }

  private showPrice(num:number) {
    if(this.state.data[num]){
      return this.state.data[num].price
    } else {
      return <div>Retrieving...</div>
    }
  }

private dynamicRowRender() {
  let rows = [];
  rows = this.props.allCoins.map(coin => <tr>
                                         <td>{coin.name} ({coin.symbol})</td>
                                         <td>Price: {this.showPrice(0)}</td>
                                         <td><div align="center"><CoinGraph/></div></td>
                                         <td>Change</td>
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
});
const mapDispatchToProps = {
    getAllCoins: Actions.coins.getAllCoins,
};
export default connect(mapStateToProps, mapDispatchToProps)(CoinInfo);
