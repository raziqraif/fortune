import * as React from 'react';
import { Sparklines, SparklinesLine } from 'react-sparklines';

export default class CoinGraph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [5, 12, 30, 0, 50, 5, 20]
    }
  }
/*             START RANDOM DATA GENERATOR                     */
  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      500
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    var s = Math.random()*100;
    this.state.data.push(Math.floor(s));
    var newData = this.state.data;
    newData.shift();
    this.setState({data:newData});
  }

  /*            END DATA GENERATOR                     */

    render() {
        return (
          <Sparklines data={this.state.data}>
            <SparklinesLine color="blue" />
          </Sparklines>
        )
    }//render()
}//class CoinGraph
