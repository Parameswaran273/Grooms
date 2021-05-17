import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Layout, Row, Col, Menu, Tooltip } from 'antd';
import { withRouter } from 'react-router-dom';

import Widgets from './Widgets';
import TaskProfile from './TaskProfile'; 
import WIPPhasePer from './WIPPhasePer'; 

import { globalLoader, getRiskOrdersWidget, getTaskProfileWIP, getWIPPerformaceWidget } from '../../services/action';

class PrediveDash extends Component {
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
        this.props.getRiskOrdersWidget();
        //setTimeout(() => this.props.getTaskProfileWIP({ cuid: 'All' }), 3000)
        //setTimeout(() => this.props.getWIPPerformaceWidget(), 5000)
        this.props.getTaskProfileWIP({ cuid: 'All' })
        this.props.getWIPPerformaceWidget()
    }

    render() {
        return (
            <div>
                <Widgets />
                <TaskProfile />
                <WIPPhasePer />
            </div>
        );
    }
}

function mapState(state) {
    return {
        loderCheck: state.globalLoader,
    };
}

export default (connect(mapState, { globalLoader, getRiskOrdersWidget, getTaskProfileWIP, getWIPPerformaceWidget })(PrediveDash));