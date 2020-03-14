import * as React from 'react';
import Chart from 'react-apexcharts'

export default class CoinGraph extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      options: {
        chart: {
          toolbar: {
            show: false
          },
          id: "history",
        },//chart
      },//options
      series: [
        {
          name: "series-1",
          data: [30, 40, 45, 50, 49, 60, 70, 91]
        }
      ]
    };//this.state
  }//constructor

    render() {
        return (
          <div>
            <Chart
            options={this.state.options}
            series={this.state.series}
            type="line"
            height="100"
            width="500"/>
          </div>
        )
    }//render()
}//class CoinGraph
