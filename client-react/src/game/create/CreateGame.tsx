import * as React from 'react';
import { Button, Form } from 'react-bootstrap';
import CoinSelector from './coinselector/CoinSelector';

interface CreateGameProps {
    allCoins: Array<{ id: string, name: string }>
}

interface CreateGameState {
    [key: string]: any;
    coinFilter: string,
    activeCoins: Array<{ id: string, name: string }>,
    endsOn: Date,
    startingCash: number,
    title: string,
}


const tempCoins = [
    {
        id: "1",
        name: "Bitcoin"
    },
    {
        id: "2",
        name: "Etherium"
    },
    {
        id: "3",
        name: "Coin 3"
    },
    {
        id: "4",
        name: "Coin 4"
    },
    {
        id: "5",
        name: "Coin 5"
    },
    {
        id: "6",
        name: "Coin 6"
    },
]

export default class CreateGame extends React.Component<CreateGameProps, CreateGameState>  {
    constructor(props: any) {
        super(props);

        this.state = {
            coinFilter: '',
            activeCoins: tempCoins,
            endsOn: new Date(),
            startingCash: 10000,
            title: '',
        }
    }
    
    private submitForm = (event: any) => {
        event.preventDefault();
        console.log(this.state);
    };

    private handleChange = (event: any) => {
        this.setState({ [event.currentTarget.name]: event.currentTarget.value });
    };

    private setActiveCoins = (activeCoins: Array<{ id: string, name: string }>) => {
        this.setState({ activeCoins });
    }

    render() {
        return (
            <Form onSubmit={this.submitForm} >
                <h1>Create Game</h1>
                <Form.Row>
                    <Form.Group controlId="title" className="col-sm-4">
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" placeholder="Enter game title" name="title" value={this.state.title} onChange={this.handleChange}/>
                    </Form.Group>
                    <Form.Group controlId="cash" className="col-sm-4">
                        <Form.Label>Starting Cash</Form.Label>
                        <Form.Control type="number" placeholder="Enter starting cash" name="startingCash" value={this.state.startingCash.toString()} onChange={this.handleChange}/>
                    </Form.Group>
                    <Form.Group controlId="endsOn" className="col-sm-4">
                        <Form.Label>Ends At</Form.Label>
                        <Form.Control type="date" placeholder="Date and time game ends" name="endsOn"/>
                    </Form.Group>
                </Form.Row>

                <CoinSelector
                    activeCoins={this.state.activeCoins}
                    allCoins={tempCoins}
                    setActiveCoins={this.setActiveCoins}
                />
                
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        )
    }
}