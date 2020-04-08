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

interface CreatePriceAlertFormState {
    coin: Coin;
    strikePrice: string;
    type: string;
}

interface CreatePriceAlertProps {
    getAllCoins: () => void;
    coins: Array<Coin>;
    onClose: () => void;
}

class CreatePriceAlertModal extends React.Component<CreatePriceAlertProps, CreatePriceAlertFormState> {
    constructor(props: CreatePriceAlertProps) {
        super(props);
        this.state = {
            coin: {
                id: '-1',
                name: '',
            },
            strikePrice: '',
            type: 'above',
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
        if (!this.state.coin.name || this.state.coin.id === '-1') {
            alert('Please select a coin');
            return;
        }
        if (isNaN(parseFloat(this.state.strikePrice))) {
            alert('Please enter a valid number');
            return;
        }
        console.log(this.state.coin)
        console.log(this.state.strikePrice)
        console.log(this.state.type)
        this.props.onClose();
    }

    render() {
        return (
            <>
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
                    <ToggleButtonGroup type='radio' defaultValue='above' name='hi'>
                        <ToggleButton type='radio' name='radio' defaultChecked value='above' onSelect={() => this.setState({type: 'above'})}>above this price</ToggleButton>
                        <ToggleButton type='radio' name='radio' value='below' onSelect={() => this.setState({type: 'below'})}>below this price</ToggleButton>
                    </ToggleButtonGroup>
                </Form.Group>
                <Form.Group>
                    <Button onClick={() => this.submit()}>Submit</Button>
                </Form.Group>
            </Form>
            </>
        )
    }
}

export default connect((state: RootState) => ({
    coins: state.coins.coins,
}), {
    getAllCoins: Actions.coins.getAllCoins,
})(CreatePriceAlertModal);