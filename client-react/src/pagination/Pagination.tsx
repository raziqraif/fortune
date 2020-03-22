import * as React from 'react'
import {Pagination as ReactPagination} from 'react-bootstrap'

interface PaginationProps {
    currentPage: number,
    pageSize: number,
    totalItems: number,
    handlePageChange: (pageNumber: number) => void,   // This method is expected to re-render this component
}

export default class Pagination extends React.Component <PaginationProps> {
    constructor(props: PaginationProps) {
        super(props);
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
        // this.setState({currentPage: newPageNumber});
        this.props.handlePageChange(newPageNumber);
    }

    getPager() {
        // Based on the implementation here
        // https://jasonwatmore.com/post/2017/03/14/react-pagination-example-with-logic-like-google
        let currentPage = this.props.currentPage;
        let pageSize = this.props.pageSize;
        let totalItems = this.props.totalItems;

        // default to first page
        currentPage = currentPage || 1;

        // default page size is 10
        pageSize = pageSize || 10;

        // calculate total pages
        let totalPages = Math.ceil(totalItems / pageSize);

        let startPage: number;
        let endPage: number;
        if (totalPages <= 10) {
            // less than 10 total pages so show all
            startPage = 1;
            endPage = totalPages;
        } else {
            // more than 10 total pages so calculate start and end pages
            if (currentPage <= 6) {
                startPage = 1;
                endPage = 10;
            } else if (currentPage + 4 >= totalPages) {
                startPage = totalPages - 9;
                endPage = totalPages;
            } else {
                startPage = currentPage - 5;
                endPage = currentPage + 4;
            }
        }

        // calculate start and end item indexes
        let startIndex = (currentPage - 1) * pageSize;
        let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

        // create an array of pages to ng-repeat in the pager control
        let pages: number[] = [];
        for (let i = 0; i < (endPage + 1) - startPage; i++) {
            pages.push(startPage + i)
        }

        // return object with all pager properties required by the view
        return {
            totalItems: totalItems,
            currentPage: currentPage,
            pageSize: pageSize,
            totalPages: totalPages,
            startPage: startPage,
            endPage: endPage,
            startIndex: startIndex,
            endIndex: endIndex,
            pages: pages,
        };
    }

    paginationItems() {
        let paginationItems = [];
        let pager = this.getPager();

        if (pager.totalItems === 0) {
            return;
        }

        paginationItems.push(
            <ReactPagination.First
                onClick={() => {this.setPageNumber(1)}}
            />
        );
        paginationItems.push(
            <ReactPagination.Prev
                onClick={() => {this.setPageNumber(Math.max(1, pager.currentPage - 1))}}
            />
        );

        for (let i = 0; i < pager.pages.length; i++) {
            let pageNum = pager.pages[i];
            paginationItems.push((
                <ReactPagination.Item
                    active={pager.currentPage === pageNum}
                    onClick={this.handlePageClick}
                >{pageNum}
                </ReactPagination.Item>
            ));
        }

        paginationItems.push(
            <ReactPagination.Next
                onClick={() => {this.setPageNumber(Math.min(pager.totalPages, pager.currentPage + 1))}}
            />
        );
        paginationItems.push(
            <ReactPagination.Last
                onClick={() => {this.setPageNumber(pager.totalPages)}}
            />
        );
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
