import * as React from 'react'
import {Pagination as ReactPagination} from 'react-bootstrap'

interface PaginationProps {
    currentPage: number,
    maxItemsPerPage: number,
    totalItems: number,
    handlePageChange: (pageNumber: number) => void,
}

interface PaginationState {
    currentPage: number,
}

export default class Pagination extends React.Component <PaginationProps, PaginationState> {
    constructor(props: PaginationProps) {
        super(props);

        this.state = {
            currentPage: this.props.currentPage,
        };
        this.handlePageClick = this.handlePageClick.bind(this)
    }

    handlePageClick(event: any) {
        if (!event.currentTarget.text) {    // Active page number was clicked
            return;
        }
        let newPageNumber = Number(event.currentTarget.text);
        this.setPageNumber(newPageNumber)
    }

    setPageNumber(newPageNumber: number) {
        this.setState({currentPage: newPageNumber})
        this.props.handlePageChange(newPageNumber)
    }

    paginationItems() {
        let paginationItems = [];
        let totalPages = Math.ceil( this.props.totalItems / this.props.maxItemsPerPage);
        for (let i = 1; i <= totalPages; i++) {
            paginationItems.push((
                <ReactPagination.Item
                    active={this.state.currentPage === i}
                    onClick={this.handlePageClick}
                >{i}
                </ReactPagination.Item>
            ));
        }
        return paginationItems;
    }

    render() {
        return (
            <div>
                <ReactPagination>
                    {this.paginationItems()}
                </ReactPagination>
            </div>
        )
    }
}
