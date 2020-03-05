import * as React from 'react';
import { Table } from 'react-bootstrap';

export default class CoinInfo extends React.Component {
    render() {
        return (
            <Table bordered>
              <thead>
                <th>Name</th>
                <th>Price</th>
                <th>something else idk</th>
              </thead>

              <tbody>
                <tr>
                  <td>Bitcoin</td>
                  <td>2billion dolars</td>
                  <td>thingy</td>
                </tr>
                <tr>
                  <td>hardcoding is bad</td>
                  <td>stonks</td>
                  <td> m0duLaR pRoGrAmMiNg </td>
                </tr>
              </tbody>
            </Table>
        )
    }
}
