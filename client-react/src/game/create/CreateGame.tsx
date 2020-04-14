import * as React from 'react';
import { Button, Form } from 'react-bootstrap';
import CoinSelector from './coinselector/CoinSelector';
import Actions from '../../redux/actions';
import { RootState } from '../../redux/reducers';
import { connect } from 'react-redux';
import Datepicker from "../../datepicker";

interface CreateGameProps {
    allCoins: Array<{ id: string, name: string }>,
    createGame: (
        activeCoins: Array<{ id: string, name: string }>,
        endsOn: Date,
        startingCash: string,
        title: string
    ) => void;
    error: string;
    loading: boolean;
    getAllCoins: () => {};
}

interface CreateGameState {
    [key: string]: any;
    coinFilter: string,
    activeCoins: Array<{ id: string, name: string }>,
    endsOn: Date,
    startingCash: string,
    title: string,
}

class CreateGame extends React.Component<CreateGameProps, CreateGameState>  {
    constructor(props: any) {
        super(props);

        this.state = {
            coinFilter: '',
            activeCoins: this.props.allCoins,
            endsOn: new Date(),
            startingCash: '10000',
            title: '',
        }
    }

    componentDidMount() {
        this.props.getAllCoins();
    }
    
    private submitForm = (event: any) => {
        event.preventDefault();
        this.props.createGame(
            this.state.activeCoins,
            this.state.endsOn,
            this.state.startingCash,
            this.state.title
        )
    };

    private handleChange = (event: any) => {
        this.setState({ [event.currentTarget.name]: event.currentTarget.value });
    };

    private handleDateChange = (date: Date) => {
        this.setState({endsOn: date})
    };

    private setActiveCoins = (activeCoins: Array<{ id: string, name: string }>) => {
        this.setState({ activeCoins });
    };

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
                        <br/>
                        <Datepicker onChange={this.handleDateChange} />
                    </Form.Group>
                </Form.Row>

                <CoinSelector
                    activeCoins={this.state.activeCoins}
                    allCoins={this.props.allCoins}
                    setActiveCoins={this.setActiveCoins}
                />
                <p style={{color: 'red'}}>{this.props.error}</p>
                <Button disabled={this.props.loading} variant="primary" type="submit">
                {this.props.loading ? 'Loading...' : 'Submit'}
                </Button>
            </Form>
        )
    }
}

const mapStateToProps = (state: RootState) => ({
    allCoins: state.coins.simpleCoins,
    error: state.game.createGameErrorMessage,
    loading: state.game.createGameLoading,
});
const mapDispatchToProps = {
    createGame: Actions.game.createGame,
    getAllCoins: Actions.coins.getAllCoins,
};
export default connect(mapStateToProps, mapDispatchToProps)(CreateGame);