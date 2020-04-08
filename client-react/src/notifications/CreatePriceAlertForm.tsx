import React from 'react';
import { connect } from 'react-redux';
import Actions from '../redux/actions'
import {
    Form,
    Dropdown,
    ToggleButton,
    ToggleButtonGroup,
} from 'react-bootstrap';
import { Coin } from '../redux/reducers/CoinReducer';
import { RootState } from '../redux/reducers';

enum PriceAlertType {
    ABOVE,
    BELOW,
}

interface CreatePriceAlertFormState {
    coin: Coin;
    strikePrice: string;
    type: PriceAlertType;
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
                id: '0',
                name: 'Blacoin'
            },
            strikePrice: '',
            type: PriceAlertType.ABOVE,
        }
    }

    async componentDidMount() {
        await this.props.getAllCoins();
    }

    renderDropdownCoins() {
        return this.props.coins.map(coin => {
            return <Dropdown.Item id={coin.id} onSelect={() => this.setState({coin: coin})}>{coin.name}</Dropdown.Item>
        })
    }

    submit() {
        console.log(this.state.coin)
        console.log(this.state.strikePrice)
        console.log(this.state.type)
        this.props.onClose();
    }

    render() {
        return (
            <Form onSubmit={() => this.submit()}>
                <Form.Group>
                    <Form.Label>Strike Price</Form.Label>
                    <Form.Control onChange={(strikePrice: any) => this.setState({strikePrice})}/>
                </Form.Group>
                <Form.Group>
                    <Dropdown>
                        {/* Why does this need an id? */}
                        <Dropdown.Toggle id='coin-dropdown'>
                            Select coin
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {this.renderDropdownCoins()}
                        </Dropdown.Menu>
                    </Dropdown>
                </Form.Group>
                <Form.Group>
                    <ToggleButtonGroup type='radio' name='above-below'>
                        <p>Notify me when the price of {this.state.coin.name} is:</p>
                        <ToggleButton value='hi' onSelect={() => this.setState({type: PriceAlertType.ABOVE})}>above this price</ToggleButton>
                        <ToggleButton value='hi' onSelect={() => this.setState({type: PriceAlertType.ABOVE})}>below this price</ToggleButton>
                    </ToggleButtonGroup>
                </Form.Group>
            </Form>
        )
    }
}

export default connect((state: RootState) => ({
    coins: state.coins.coins,
}), {
    getAllCoins: Actions.coins.getAllCoins,
})(CreatePriceAlertModal);