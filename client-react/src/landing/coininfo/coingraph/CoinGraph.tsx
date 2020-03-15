import * as React from 'react';
import { Sparklines, SparklinesLine } from 'react-sparklines';

export default class CoinGraph extends React.Component {
  constructor(props) {
    super(props);

  }

    render() {
        return (
          <Sparklines data={[5, 12, 30, 0, 50, 5, 20]}>
            <SparklinesLine color="blue" />
          </Sparklines>
        )
    }//render()
}//class CoinGraph
