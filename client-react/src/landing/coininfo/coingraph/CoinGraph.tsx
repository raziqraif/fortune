import * as React from 'react';
import Chart from 'react-apexcharts'

export default class CoinGraph extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      options: {
        chart: {
          zoom: {
            enabled: false
          },
          toolbar: {
            show: false
          },
          id: "history",
        },//chart

        tooltip: {
          enabled: false
        },
        xaxis: {
          labels:{
            show:false,
          },//labels
        },//xaxis
        yaxis: {
          labels:{
            show: false
          },//labels
          min: function(min) { return min},
          max: 100,
        },//yaxis
        grid: {
          show:false
        }
      },//options
      series: [
        {
          data: [10, 40, 55, 20, 49, 0, 70, 91]
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
            height="100%"
            width="300"/>
          </div>
        )
    }//render()
}//class CoinGraph
