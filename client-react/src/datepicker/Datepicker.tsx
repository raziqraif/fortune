import React from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

// CSS Modules, react-datepicker-cssmodules.css
// import 'react-datepicker/dist/react-datepicker-cssmodules.css';

export default class Datepicker extends React.Component {
    state = {
        selectedDate: new Date()
    };

    handleChange = (date: Date) => {
        this.setState({
            selectedDate: date
        });
    };

    render() {
        return (
            <DatePicker
                selected={this.state.selectedDate}
                onChange={this.handleChange}
                timeInputLabel="Time:"
                dateFormat="MM/dd/yyyy h:mm aa"
                showTimeInput
                minDate={new Date()}
            />
        );
    }
}