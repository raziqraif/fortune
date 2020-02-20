import * as React from 'react';
import { Button, Form } from 'react-bootstrap';
import CSS from 'csstype';

interface CreateGameProps {
    allCoins: Array<{ name: string }>
}

interface CreateGameState {
    [key: string]: any;
    coinFilter: string,
    coinsActive: Array<{ name: string }>,
    endsOn: Date,
    startingCash: number,
    title: string,
}

const checkbox: CSS.Properties = {
    paddingLeft: '1.5rem'
}

const tempCoins = [
    {
        name: "Bitcoin"
    },
    {
        name: "Etherium"
    },
    {
        name: "Coin 3"
    },
    {
        name: "Coin 4"
    },
    {
        name: "Coin 5"
    },
    {
        name: "Coin 6"
    },
]

export default class CreateGame extends React.Component<CreateGameProps, CreateGameState>  {
    constructor(props: any) {
        super(props);

        this.state = {
            coinFilter: '',
            coinsActive: tempCoins,
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

    private filteredCoins = () => tempCoins.filter((coin: { name: string }) => 
        coin.name.toLowerCase().includes(this.state.coinFilter.toLowerCase()));
    
    private isCoinInActiveList = (name: string) => {
        return this.state.coinsActive.some(coin => coin.name === name);
    }

    private handleCheckboxChange = (name: string) => (event: any) => {
        this.changeCoinStatusOnActiveList(name);
    }

    private changeCoinStatusOnActiveList = (name: string) => {
        let coinsActive = this.state.coinsActive;
        if (this.isCoinInActiveList(name)) {
            coinsActive = coinsActive.filter(coin => coin.name !== name);
            this.setState({ coinsActive });
        } else {
            coinsActive.push({ name });
            this.setState({ coinsActive });
        }
    }

    private selectAllCoins = () => {
        this.setState({ coinsActive: tempCoins });
    }

    private deselectAllCoins = () => {
        this.setState({ coinsActive: [] });
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
                        <Form.Control type="number" placeholder="Enter starting cash" name="startingCash" value={this.state.startingCash} onChange={this.handleChange}/>
                    </Form.Group>
                    <Form.Group controlId="endsOn" className="col-sm-4">
                        <Form.Label>Ends At</Form.Label>
                        <Form.Control type="date" placeholder="Date and time game ends" name="endsOn"/>
                    </Form.Group>
                </Form.Row>

                <Form.Row className="mb-3">
                    <Form.Group className="col-sm-6">
                        <Form.Label>Coins available to your players</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Filter coins"
                            name="coinFilter"
                            value={this.state.coinFilter}
                            onChange={this.handleChange}
                        />
                        {this.filteredCoins().map((coin: { name: string }) => {
                            return <Form.Check
                                style={checkbox}
                                key={coin.name}
                                type='checkbox'
                                label={coin.name}
                                checked={this.isCoinInActiveList(coin.name)}
                                onChange={this.handleCheckboxChange(coin.name)}
                            />
                        })}
                    </Form.Group>
                    <Form.Group className="col-sm-6">
                        <Form.Label className="col-sm-12">Selected Coins</Form.Label>
                        <Button onClick={this.selectAllCoins} className="btn-success">Select All</Button>
                        <Button onClick={this.deselectAllCoins} className="btn-warning">Deselect All</Button>
                        {this.state.coinsActive.map((coin: { name: string }) => {
                            return <Form.Check
                                style={checkbox}
                                key={coin.name}
                                type='checkbox'
                                label={coin.name}
                                checked={this.isCoinInActiveList(coin.name)}
                                onChange={this.handleCheckboxChange(coin.name)}
                            />
                        })}
                    </Form.Group>
                </Form.Row>
                
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        )
    }
}