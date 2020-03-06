import * as React from 'react';
import { Table } from 'react-bootstrap';

export default class CoinInfo extends React.Component {

private dynamicRowRender(num:number) {
  let rows = [];
  for (let index = 0; index < num; index++) {
    rows.push(      <tr>
                      <td>hardcoding is bad</td>
                      <td>stonks</td>
                      <td> m0duLaR pRoGrAmMiNg </td>
                    </tr>)

  }

  return rows
}

    render() {
        return (
            <Table bordered>
              <thead>
                <th>Name</th>
                <th>Price</th>
                <th>something else idk</th>
              </thead>

              <tbody>
              {this.dynamicRowRender(5)}
              </tbody>
            </Table>
        )
    }
}
