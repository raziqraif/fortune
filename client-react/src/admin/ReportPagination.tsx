import React, { Component } from 'react';
import { Modal, Button, DropdownButton, Dropdown, Form } from 'react-bootstrap';
import Pagination from '../pagination';
import { ReportsType, ReportType } from '../redux/reducers/AdminReducer';
import ReportCard from './ReportCard';
import { RootState } from '../redux/reducers';
import { connect } from 'react-redux';
import actions from '../redux/actions';

interface ReportPaginationProps {
    reports: ReportsType;
    getReports: (page: number, numPerPage?: number) => void;
    updateReport: (
        reportId: number,
        selectedAction: 'None' | 'Warning' | 'Ban',
        warningMessage?: string
    ) => void;
    totalItems: number;
    reportsError: string;
}

interface ReportPaginationState {
    page: number;
    activeReport?: ReportType;
    modalOpen: boolean;
    selectedAction: 'None' | 'Warning' | 'Ban';
    warningMessage: string;
}

class ReportPagination extends Component<ReportPaginationProps, ReportPaginationState> {
    constructor(props: ReportPaginationProps) {
        super(props);
        this.state = {
            page: 1,
            activeReport: undefined,
            modalOpen: false,
            selectedAction: 'None',
            warningMessage: '',
        }
    }

    componentDidMount() {
        this.props.getReports(1);
    }

    changePage = (pageNum: number) => {
        this.props.getReports(pageNum)
        this.setState({page: pageNum})
    }

    openReportModal = (report: ReportType) => (event: any) => {
        this.setState({activeReport: report, modalOpen: true});
    }

    closeReportModal = () => {
        this.setState({activeReport: undefined, modalOpen: false});
    }

    setSelectedAction = (selectedAction: 'None' | 'Warning' | 'Ban') => {
        this.setState({ selectedAction, warningMessage: '' });
    }

    changeWarningMessage = (event: any) => {
        this.setState({ warningMessage: event.currentTarget.value });
    }

    updateReport = (event: any) => {
        const { activeReport, selectedAction, warningMessage } = this.state;
        if (!activeReport) return;
        if (selectedAction === 'Warning') {
            this.props.updateReport(activeReport.id, selectedAction, warningMessage.trim());
            this.setState({ warningMessage: '' });
        }
        else {
            this.props.updateReport(activeReport.id, selectedAction);
        }
        this.closeReportModal();
        this.props.getReports(this.state.page);
    }

    render() {
        return (
            <div className="container">
                <Modal show={this.state.modalOpen} onHide={this.closeReportModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Take Action</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Reported text: "{this.state.activeReport?.flaggedMessage}"</Modal.Body>
                    <Modal.Footer>
                        <Form.Control
                            type="input"
                            placeholder="Warning Message"
                            name="warningMessage"
                            value={this.state.warningMessage}
                            onChange={this.changeWarningMessage}
                            className="col-lg-12"
                            disabled={this.state.selectedAction !== 'Warning'}
                        />
                        <DropdownButton id="action-to-user" title={this.state.selectedAction}>
                            <Dropdown.Item onClick={(e: any) => this.setSelectedAction('None')}>
                                None
                            </Dropdown.Item>
                            <Dropdown.Item onClick={(e: any) => this.setSelectedAction('Warning')}>
                                Warning
                            </Dropdown.Item>
                            <Dropdown.Item onClick={(e: any) => this.setSelectedAction('Ban')}>
                                Ban
                            </Dropdown.Item>
                        </DropdownButton>
                        {this.state.selectedAction === 'None'
                            ? <Button
                                variant="primary"
                                onClick={this.updateReport}
                            >
                                Dismiss Issue
                            </Button>
                            : <Button
                                variant={
                                    this.state.selectedAction === 'Warning'
                                        ? 'warning'
                                        : 'danger'
                                }
                                onClick={this.updateReport}
                            >
                                Issue {this.state.selectedAction}
                            </Button>
                        }
                    </Modal.Footer>
                </Modal>
                {this.props.reportsError && <p style={{color: 'red'}}>
                    {this.props.reportsError}
                </p>}
                <h4 style={{paddingRight: 10}}>User Reports</h4>
                <div className="row col-lg-12" style={{marginBottom: 10}}>
                    {this.renderReportCards()}
                </div>
                <Pagination
                    currentPage={this.state.page}
                    pageSize={9}
                    totalItems={this.props.totalItems}
                    handlePageChange={this.changePage}
                />
            </div>
        )
    }

    renderReportCards() {
        if (this.props.reports) {
            return (
                <>
                    {this.props.reports.map((report) => 
                        <ReportCard key={report.id} report={report} onClick={this.openReportModal(report)}/>
                    )}
                </>
            )
        }
    }
}

const mapStateToProps = (state: RootState) => ({
    reports: state.admin.reports,
    totalItems: state.admin.numberOfReports,
    reportsError: state.admin.reportsErrorMessage,
})

const mapDispatchToProps = {
    getReports: actions.admin.getReports,
    updateReport: actions.admin.updateReport,
}

export default connect(mapStateToProps, mapDispatchToProps)(ReportPagination);