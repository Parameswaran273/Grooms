import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Layout, Row, Col, Menu, Tooltip } from 'antd';

import Widgets from './Widgets';
import WIPAgingChart from './WIPAgingChart';
import DailyTreChart from './DailyTreChart';
import MonthlyTreChart from './MonthlyTreChart';

import { globalLoader, getWIPPerformaceWidget, getWIPAgingData, getWIPDailyTrendingChart, getWIPMonthlyTrendingChart } from '../../services/action';

class WIPPerDash extends Component {
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
        this.props.getWIPPerformaceWidget();
        this.props.getWIPAgingData();
        this.props.getWIPDailyTrendingChart();
        this.props.getWIPMonthlyTrendingChart();
    }

    render() {
        return (
            <div>
                <Widgets />
                <Row gutter={18}>
                    <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                        <WIPAgingChart />
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                        <DailyTreChart />
                    </Col>
                </Row>
                <Row gutter={18}>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <MonthlyTreChart />
                    </Col>
                </Row>
            </div>
        );
    }
}
function mapState(state) {
    return {
        loderCheck: state.globalLoader,
    };
}

export default (connect(mapState, { globalLoader, getWIPPerformaceWidget, getWIPAgingData, getWIPDailyTrendingChart, getWIPMonthlyTrendingChart })(WIPPerDash));