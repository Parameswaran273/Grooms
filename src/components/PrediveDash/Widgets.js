import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faCheckSquare, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { Row, Col, Card, Modal, Tooltip, Button } from 'antd';
import { ClipLoader } from "react-spinners";

import Odometer from 'react-odometerjs';

import Drilldown from '../Drilldown/GlobalTblRemote';
import InfoModal from './InfoModal';

import { globalLoader, getRiskOrdersWidget, getGlobalRemoteTblData } from '../../services/action';

class Widgets extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orderAtRiskCount: 0,
            orderNotRiskCount: 0,
            orderRiskLoad: true,
            renderDD: []
        }
        this.onClickDD = this.onClickDD.bind(this)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.loderCheck != prevProps.loderCheck) {
            if (this.props.loderCheck.result == true) {
                this.setState({
                    orderRiskLoad: true
                })
            }
        }
        if (this.props.riskOrderWidgetData != prevProps.riskOrderWidgetData) {
            if (this.props.riskOrderWidgetData.length !=0 ) {
                this.setState({
                    orderRiskLoad: false,
                    orderAtRiskCount: 0,
                    orderNotRiskCount: 0,
                })
                setTimeout(() => {
                    this.setState({
                        orderAtRiskCount: this.props.riskOrderWidgetData[0].OrdersatRisk,
                        orderNotRiskCount: this.props.riskOrderWidgetData[1].OrdersnotatRisk,
                    })
                }, 1)
            }
            else {
                this.setState({
                    orderRiskLoad: false
                })
                setTimeout(() => {
                    this.setState({
                        orderAtRiskCount: 0,
                        orderNotRiskCount: 0,
                    })
                }, 1)
            }
        }
    }

    onClickDD(e, callName) {
        let label = 'Orders at Risk'
        let type = 'OrdersatRisk'
        if (callName == "OrderAtRisk") {
            label = 'Orders at Risk'
            type = 'OrdersatRisk'
        }
        else if (callName == "OrderNotAtRisk") {
            label = 'Orders Not at Risk'
            type = 'OrdersnotatRisk'
        }
        var values = { type: type, skipRow: 1, fetchRow: 10, filterType: 'All', searchValue: 'All', sort: 'OrderAgingOrCT desc' }
        this.props.getGlobalRemoteTblData(values, 'OrderRisk')
        this.setState({
            renderDD: <Drilldown openM={true} label={label} type={type} callName={'OrderRisk'} sort={values.sort} onClose={this.handleCloseModal.bind(this)} />
        })
    }

    handleCloseModal() {
        this.setState({
            renderDD: []
        })
    }

    render() {
        return (
            <React.Fragment>
                <Row gutter={18}>
                    <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                        <Card size="small" className="card-bg-clr-navy-blue card-bottom" >
                            <div className="widget-icon-overlap"><FontAwesomeIcon className="widget-icon-red" icon={faExclamationTriangle} /></div>
                            <Tooltip placement="top" className="modal-tool-tip" title="Description">
                                <FontAwesomeIcon className="info-logo" icon={faInfoCircle} onClick={(e) => this.infoDDModal("OrdersOnRisk")} />
                            </Tooltip>
                            <div className="widget-value" onClick={(e) => this.onClickDD(e, 'OrderAtRisk')}>
                                {this.state.orderRiskLoad ? <ClipLoader color={'#123abc'} /> :
                                    <Odometer value={this.state.orderAtRiskCount} options={{ format: '' }} />}
                                <div className="widget-label">Orders at Risk</div>
                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                        <Card size="small" className="card-bg-clr-navy-blue card-bottom">
                            <div className="widget-icon-overlap"><FontAwesomeIcon className="widget-icon" icon={faCheckSquare} /></div>
                            <Tooltip placement="top" className="modal-tool-tip" title="Description">
                                <FontAwesomeIcon className="info-logo" icon={faInfoCircle} onClick={(e) => this.infoDDModal("OrdersNotOnRisk")} />
                            </Tooltip>
                            <div className="widget-value" onClick={(e) => this.onClickDD(e, 'OrderNotAtRisk')}>
                                {this.state.orderRiskLoad ? <ClipLoader color={'#123abc'} /> :
                                    <Odometer value={this.state.orderNotRiskCount} options={{ format: '' }} />}
                                <div className="widget-label">Orders Not at Risk</div>
                            </div>
                        </Card>
                    </Col>
                </Row>
                {this.state.renderDD}
                <InfoModal setClick1={click => this.infoDDModal = click} />
            </React.Fragment>
        );
    }
}

function mapState(state) {
    return {
        riskOrderWidgetData: state.getRiskOrdersWidget,
        loderCheck: state.globalLoader,
    };
}

export default (connect(mapState, { globalLoader, getRiskOrdersWidget, getGlobalRemoteTblData })(Widgets));