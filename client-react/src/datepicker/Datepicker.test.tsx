import React from 'react';
import {render} from '@testing-library/react';
import Datepicker from './Datepicker';


test('Datepicker', () => {
    const {getByPlaceholderText} = render(<Datepicker onChange={(date: Date) => {}} data-testid="datepicker"/>);
    let dpicker = getByPlaceholderText("Set date and time")
    expect(dpicker).toBeInTheDocument()
});

// TODO: Finish the test
