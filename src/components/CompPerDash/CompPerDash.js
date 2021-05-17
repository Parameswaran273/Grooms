import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Row, Col } from 'antd';

import Widgets from './Widgets';
import MadeSLAChart from './MadeSLAChart';
import MonthlyThr from './MonthlyThr';
import DailyThr from './DailyThr';

//import AvgIntervalChart from './AvgIntervalChart';

import { globalLoader, getCompletedOrderWidget, getMadeSLAMonthwiseWidget, getDailyThroughputData } from '../../services/action';

class CompPerDash extends Component {
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
        this.props.getCompletedOrderWidget();
        this.props.getMadeSLAMonthwiseWidget()
        this.props.getDailyThroughputData()
    }

    render() {
        return (
            <div>
                <Widgets />
                <Row gutter={18}>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <MadeSLAChart />
                    </Col>
                </Row>
              
                <Row gutter={18}>
                    <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                        <MonthlyThr />
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                        <DailyThr/>
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

export default (connect(mapState, { globalLoader, getCompletedOrderWidget, getMadeSLAMonthwiseWidget, getDailyThroughputData })(CompPerDash));