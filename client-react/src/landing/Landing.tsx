import * as React from 'react';
import CoinInfo from './coininfo/CoinInfo';
import { Jumbotron } from 'react-bootstrap';


export default class Landing extends React.Component {
    render() {
        return (
            <div>
            <Jumbotron>
              <h1> Welcome to Fortune! </h1>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Bibendum enim facilisis gravida neque convallis a. Fermentum leo vel orci porta non pulvinar. Eget duis at tellus at urna condimentum mattis. Euismod quis viverra nibh cras pulvinar mattis nunc sed. Pretium viverra suspendisse potenti nullam ac tortor vitae purus. Convallis aenean et tortor at risus viverra. Facilisis gravida neque convallis a cras semper auctor. Neque aliquam vestibulum morbi blandit cursus risus. Quisque non tellus orci ac auctor augue. Consectetur a erat nam at. Facilisis magna etiam tempor orci eu. Sit amet mattis vulputate enim nulla aliquet. Integer feugiat scelerisque varius morbi. Nec sagittis aliquam malesuada bibendum arcu vitae.</p>
            </Jumbotron>

            <CoinInfo/>
            </div>

        )
    }
}
