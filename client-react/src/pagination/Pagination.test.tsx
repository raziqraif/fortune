import React from 'react';
import {render, fireEvent, screen, getByPlaceholderText} from '@testing-library/react';

import Pagination from './Pagination';
import assert from "assert";
import {deeplyRenderComponentWithRedux} from "../test-utils";
import CreateGame from "../game/create/CreateGame";


test('Should render pagination', () => {
    const {getByText} = render(<Pagination pageSize={10}
                                           totalItems={105}
                                           currentPage={1}
                                           handlePageChange={()=>{}}
                                           />);
    expect(getByText('1')).toBeInTheDocument();
    expect(getByText('2')).toBeInTheDocument();
    expect(getByText('10')).toBeInTheDocument();
});
