import React, { Component } from 'react';
import { connect } from 'react-redux';

import moment from 'moment';
import { Layout, Row, Col, Menu, Tooltip } from 'antd';

import CompOrdReport from './CompOrdReport';

import { globalLoader, getCOPReports  } from '../../services/action';

class Reports extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }

    componentDidMount() {
        this.globalAPICall();
    }

    componentWillUnmount() {
        window.scrollTo(0, 0)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.loderCheck != prevProps.loderCheck) {
            if (this.props.loderCheck.result == true) {
                this.globalAPICall();
            }
        }
    }

    globalAPICall() {
        this.props.getCOPReports(moment(new Date(), 'YYYY-MM-DD').subtract(0, 'M').format('YYYY-MM'))
    }

    render() {
        return (
            <div>
                <CompOrdReport />
            </div>
        );
    }
}
function mapState(state) {
    return {
        loderCheck: state.globalLoader,
    };
}

export default (connect(mapState, { globalLoader, getCOPReports })(Reports));