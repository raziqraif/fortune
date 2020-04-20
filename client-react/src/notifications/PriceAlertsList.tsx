import React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../redux/reducers';
import { ListGroup } from 'react-bootstrap';
import Actions from '../redux/actions';
import { PriceAlert } from '../redux/reducers/NotificationsReducer';
import { Coin } from '../redux/reducers/CoinReducer';

interface PriceAlertsListProps {
    priceAlerts: Array<PriceAlert>;
    getPriceAlerts: () => void;
    fetchAuthToken: () => void;
    getCoins: () => void;
    coins: Array<Coin>;
}

class PriceAlertsList extends React.Component<PriceAlertsListProps> {
    async componentDidMount() {
        await this.props.fetchAuthToken();
        await this.props.getPriceAlerts();
        await this.props.getCoins();
    }

    getCoinNameById(id: number|string) {
        return this.props.coins.map(coin => {
            console.log(coin, id)
            if (coin.id === id) {
                return coin.name
            }
        })
    }

    renderPriceAlerts() {
        return this.props.priceAlerts.map(priceAlert => {
            return <ListGroup.Item key={priceAlert.id}>
                <p>Strike price ({priceAlert.above ? 'above' : 'below'}): ${priceAlert.strikePrice}</p>
                <p>Coin: {this.getCoinNameById(priceAlert.coinId)}</p>
                {priceAlert.hit ? <p><i>Hit</i></p> : <p><i>Pending</i></p>}
            </ListGroup.Item>
        })
    }

    render() {
        return (
            <ListGroup>
                {this.renderPriceAlerts()}
            </ListGroup>
        )
    }
}

export default connect((state: RootState) => ({
    priceAlerts: state.notifications.priceAlerts,
    coins: state.coins.simpleCoins,
}), {
    getPriceAlerts: Actions.notifications.getPriceAlerts,
    fetchAuthToken: Actions.auth.fetchAuthToken,
    getCoins: Actions.coins.getAllCoins,
})(PriceAlertsList)