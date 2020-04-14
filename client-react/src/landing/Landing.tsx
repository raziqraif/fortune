import * as React from 'react';
import CoinInfo from './coininfo/CoinInfo';
import { Jumbotron } from 'react-bootstrap';


export default class Landing extends React.Component {
    render() {
        return (
            <div>
            <Jumbotron>
              <h1> Fortune: A Cryptocurrency Trading Game </h1>

            </Jumbotron>

            {/* <CoinInfo/> */}
            </div>

        )
    }
}
