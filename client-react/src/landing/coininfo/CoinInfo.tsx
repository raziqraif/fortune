import * as React from 'react';
import { Table } from 'react-bootstrap';
import Actions from '../../redux/actions';
import { RootState } from '../../redux/reducers';
import { connect } from 'react-redux';

interface CoinInfoProps {
  allCoins: Array<{ id: string, name: string, symbol:string}>;
  getAllCoins: () => {};
}

class CoinInfo extends React.Component<CoinInfoProps> {
  constructor(props: CoinInfoProps) {
      super(props);
  }

  componentDidMount() {
      this.props.getAllCoins();
  }

private dynamicRowRender() {
  let rows = [];
  rows = this.props.allCoins.map(coin => <tr>
                                         <td>{coin.name} ({coin.symbol})</td>
                                         <td>Price</td>
                                         <td>Graph</td>
                                         <td>Change</td>
                                         </tr> );
  rows = rows.slice(0,10) //only show first 10 coins - in reality need to filter through rows for certain coins
  return rows
}

    render() {
        return (
            <Table bordered>
              <thead>
                <th>Coin</th>
                <th>Price</th>
                <th>History</th>
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
