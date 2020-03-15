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
          axisBorder: {
            show: false,
          },
          labels:{
            show:false,
          },//labels
        },//xaxis
        yaxis: {
          labels:{
            show: false
          },//labels
          min: function(min) { return min}, // Most realistically, the price min will never equal 0
                                            // therefore, need a function to adjust min
        //  max: 100,
        },//yaxis
        grid: {
          show:false
        }
      },//options
      series: [
        {
          data: [10, 40, 12, 0, 49, 0, 70, 91]
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
            height="50%"
            width="50%"/>
          </div>
        )
    }//render()
}//class CoinGraph
