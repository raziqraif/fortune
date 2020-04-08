import React from 'react'
import { Modal } from 'react-bootstrap'
import Actions from '../redux/actions'
import CreatePriceAlertForm from './CreatePriceAlertForm';
import { connect } from 'react-redux';
import { PriceAlertType } from '../redux/actions/Notifications';

interface CreatePriceAlertModalProps {
    open: boolean;
    close: () => void;
    createPriceAlert: (coinId: string, strikePrice: string, type: PriceAlertType) => void;
}

class CreatePriceAlertModal extends React.Component<CreatePriceAlertModalProps> {

    submit = (coinId: string, strikePrice: string, type: PriceAlertType) => {
        this.props.createPriceAlert(coinId, strikePrice, type);
        this.props.close();
    }

    render() {
        return (
            <Modal centered size='lg' show={this.props.open} onHide={this.props.close}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Price Alert</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <CreatePriceAlertForm submit={this.submit}/>
                </Modal.Body>
            </Modal>
        )
    }
}

export default connect(null, {
    createPriceAlert: Actions.notifications.createPriceAlert,
})(CreatePriceAlertModal);