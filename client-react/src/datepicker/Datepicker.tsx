import React from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import {Form} from "react-bootstrap";

// CSS Modules, react-datepicker-cssmodules.css
// import 'react-datepicker/dist/react-datepicker-cssmodules.css';

interface DatepickerProps {
    onChange: (date: Date) => void,  // Will be called in handleChange()
}

interface DatepickerState {
    selectedDate: Date,
}

export default class Datepicker extends React.Component<DatepickerProps, DatepickerState> {

    constructor(props: any) {
        super(props);
        this.state = {
            selectedDate: new Date()
        }
    }

    handleChange = (date: Date) => {
        this.setState({
            selectedDate: date
        });
        this.props.onChange(date);
    };

    render() {
        return (
            <DatePicker
                customInput={<Form.Control />}
                selected={this.state.selectedDate}
                onChange={this.handleChange}
                timeInputLabel="Time:"
                placeholderText={"Set date and time"}
                dateFormat="MM/dd/yyyy h:mm aa"
                showTimeInput
                minDate={new Date()}
            />
        );
    }

}