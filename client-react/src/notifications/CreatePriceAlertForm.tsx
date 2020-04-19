import React from 'react';
import { connect } from 'react-redux';
import Actions from '../redux/actions'
import {
    Form,
    Dropdown,
    ToggleButton,
    ToggleButtonGroup,
    Button,
    DropdownButton,
} from 'react-bootstrap';
import { Coin } from '../redux/reducers/CoinReducer';
import { RootState } from '../redux/reducers';
import { PriceAlertType } from '../redux/actions/Notifications';

interface CreatePriceAlertFormState {
    coin: Coin;
    strikePrice: string;
    type: PriceAlertType;
}

interface CreatePriceAlertProps {
    getAllCoins: () => void;
    coins: Array<Coin>;
    submit: (coinId: string, strikePrice: string, type: PriceAlertType) => void;
}

class CreatePriceAlertForm extends React.Component<CreatePriceAlertProps, CreatePriceAlertFormState> {
    constructor(props: CreatePriceAlertProps) {
        super(props);
        this.state = {
            coin: {
                id: '-1',
                name: '',
            },
            strikePrice: '',
            type: PriceAlertType.ABOVE,
        }
    }

    async componentDidMount() {
        await this.props.getAllCoins();
        this.setState({coin: this.props.coins[0]});
    }

    renderDropdownCoins() {
        return this.props.coins.map(coin => {
            return <Dropdown.Item eventKey={coin.id} key={coin.id} onSelect={() => this.setState({coin})}>{coin.name}</Dropdown.Item>
        })
    }

    submit() {
        if (isNaN(parseFloat(this.state.strikePrice))) {
            alert('Please enter a valid number for strike price');
            return;
        }
        this.props.submit(
            this.state.coin.id,
            this.state.strikePrice,
            this.state.type,
        )
    }

    render() {
        return (
            <Form onSubmit={() => this.submit()}>
                <Form.Group>
                    <Form.Label>Strike Price</Form.Label>
                    <Form.Control
                        value={this.state.strikePrice}
                        onChange={(event: React.FormEvent<HTMLInputElement>) => this.setState({strikePrice: event.currentTarget.value})}
                    />
                </Form.Group>
                <Form.Group>
                    <Dropdown>
                        {/* Why does this need an id? */}
                        <DropdownButton id='hi' title={this.state.coin.name}>
                            {this.renderDropdownCoins()}
                        </DropdownButton>
                    </Dropdown>
                </Form.Group>
                <Form.Group>
                    <Form.Label style={{paddingRight: 10}}>Notify me when the price of {this.state.coin.name} is:</Form.Label>
                    <ToggleButtonGroup type='radio' defaultValue={this.state.type} name='hi' onChange={(type: PriceAlertType) => this.setState({type})}>
                        <ToggleButton
                            type='radio'
                            name='radio'
                            defaultChecked
                            value={PriceAlertType.ABOVE}
                        >above this price</ToggleButton>
                        <ToggleButton
                            type='radio'
                            name='radio'
                            value={PriceAlertType.BELOW}
                        >below this price</ToggleButton>
                    </ToggleButtonGroup>
                </Form.Group>
                <Form.Group>
                    <Button onClick={() => this.submit()}>Submit</Button>
                </Form.Group>
            </Form>
        )
    }
}

export default connect((state: RootState) => ({
    coins: state.coins.simpleCoins,
}), {
    getAllCoins: Actions.coins.getAllCoins,
})(CreatePriceAlertForm);