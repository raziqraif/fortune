import React, { Component } from 'react';
import { ReportType } from '../redux/reducers/AdminReducer';
import { Card, Button } from 'react-bootstrap';

interface ReportCardProps {
    report: ReportType;
    onClick: (event: any) => void;
}

export default class ReportCard extends Component<ReportCardProps> {
    render() {
        const createdAt = this.props.report.createdAt.toLocaleString(); 
        return (
            <Card body className="col-lg-4">
                <Card.Title>Game: {this.props.report.game.title}</Card.Title>
                <Card.Subtitle>Reported at: {createdAt}</Card.Subtitle>
                <Card.Text>Reported Text: "{this.props.report.flaggedMessage}"</Card.Text>
                {this.props.report.resolved
                    ? <Card.Text>Action taken: {this.props.report.takenAction}</Card.Text>
                    : <Button variant="primary" onClick={this.props.onClick}>
                        Take Action
                    </Button>
                }
            </Card>
        );
    }
}