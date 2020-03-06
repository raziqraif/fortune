import * as React from "react"
import { Form, Button } from "react-bootstrap"
import CSS from 'csstype';

interface CoinSelectorProps {
    allCoins: Array<{ id: string, name: string }>;
    activeCoins: Array<{ id: string, name: string }>;
    setActiveCoins: (activeCoins: Array<{ id: string, name: string }>) => void;
}

interface CoinSelectorState {
    filter: string;
}

const checkbox: CSS.Properties = {
    paddingLeft: '1.5rem'
};

export default class CoinSelector extends React.Component<CoinSelectorProps, CoinSelectorState> {
    constructor(props: CoinSelectorProps) {
        super(props);
        this.state = {
            filter: '',
        }
    }
    private handleFilterChange = (event: any) => {
        this.setState({ filter: event.currentTarget.value });
    };

    private selectAllCoins = () => {
        this.props.setActiveCoins(this.props.allCoins);
    };

    private deselectAllCoins = () => {
        this.props.setActiveCoins([]);
    };

    private filteredCoins = () => this.props.allCoins.filter((coin: { name: string }) => 
        coin.name.toLowerCase().includes(this.state.filter.toLowerCase()));
    
    
    private isCoinInActiveList = (name: string) => {
        return this.props.activeCoins.some(coin => coin.name === name);
    };

    private handleCheckboxChange = (name: string) => (event: any) => {
        this.changeCoinStatusOnActiveList(name);
    };

    private changeCoinStatusOnActiveList = (name: string) => {
        let activeCoins = this.props.activeCoins;
        if (this.isCoinInActiveList(name)) {
            activeCoins = activeCoins.filter(coin => coin.name !== name);
            this.props.setActiveCoins(activeCoins);
        } else {
            const addedCoin = this.props.allCoins.find(coin => coin.name === name);
            if (addedCoin) {
                activeCoins.push(addedCoin);
                this.props.setActiveCoins(activeCoins);
            }
        }
    };

    render() {
        return (
            <Form.Row className="mb-3">
                <Form.Group className="col-sm-6">
                    <Form.Label>Coins available to your players</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Filter coins"
                        name="coinFilter"
                        value={this.state.filter}
                        onChange={this.handleFilterChange}
                    />
                    {this.filteredCoins().map((coin: { name: string }) => {
                        return <Form.Check
                            style={checkbox}
                            key={coin.name}
                            type='checkbox'
                            label={coin.name}
                            checked={this.isCoinInActiveList(coin.name)}
                            onChange={this.handleCheckboxChange(coin.name)}
                            placeholder={"available-coin"}
                        />
                    })}
                </Form.Group>
                <Form.Group className="col-sm-6">
                    <Form.Label className="col-sm-12">Selected Coins</Form.Label>
                    <Button onClick={this.selectAllCoins} disabled={!!this.state.filter} className="btn-success">Select All</Button>
                    <Button onClick={this.deselectAllCoins} className="btn-warning">Deselect All</Button>
                    {this.props.activeCoins.map((coin: { name: string }) => {
                        return <Form.Check
                            style={checkbox}
                            key={coin.name}
                            type='checkbox'
                            label={coin.name}
                            checked={this.isCoinInActiveList(coin.name)}
                            onChange={this.handleCheckboxChange(coin.name)}
                            placeholder={"active-coin"}
                        />
                    })}
                </Form.Group>
            </Form.Row>
        )
    }
}