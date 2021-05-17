import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getClearCallback } from '../services/action';
import { Input } from 'antd';
const { Search } = Input;

class RemoteTblFilter extends Component {
    constructor(props) {
        super(props);
        this.onSearch = this.onSearch.bind(this);
        this.onChange = this.onChange.bind(this);

        this.state = {
            value: ''
        };
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.clearFilter != prevProps.clearFilter) {
            //console.log(this.props.clearFilter)
        }
    }
    onChange({ target: { value } }) {
        this.setState({
            value: value
        })
    }
    onSearch(value) {
        if (value != "") {
            var values = [{ column: this.props.column, value: value }]
            this.props.getClearCallback(values);
        }
        else {
            var data = [{ column: this.props.column, value: 'clear' }]
            this.props.getClearCallback(data);
        }
    }
    render() {
        return [
            <div>
                <Search value={this.state.value} className="tbl-fliter-btn" enterButton allowClear placeholder="Filter" onChange={this.onChange} onSearch={this.onSearch} />
            </div>
        ];
    }
}

function mapState(state) {
    return {
        clearFilter: state.getClearCallback
    };
}

export default (connect(mapState, { getClearCallback })(RemoteTblFilter));