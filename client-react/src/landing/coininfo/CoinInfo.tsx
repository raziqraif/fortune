import * as React from 'react';
import { Table } from 'react-bootstrap';
import Actions from '../../redux/actions';
import { RootState } from '../../redux/reducers';
import { connect } from 'react-redux';

interface CoinInfoProps {
  allCoins: Array<{ id: string, name: string }>;
  getAllCoins: () => {};
}

class CoinInfo extends React.Component<CoinInfoProps> {
  constructor(props: CoinInfoProps) {
      super(props);
  }

  componentDidMount() {
      this.props.getAllCoins();
  }

private dynamicRowRender(num:number) {
  let rows = [];
  rows = this.props.allCoins.map(coin => <tr>
                                         <td>{coin.name}</td>
                                         <td>Price</td>
                                         <td>Graph</td>
                                         <td>Change</td>
                                         </tr> );

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
              {this.dynamicRowRender(5)}
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
