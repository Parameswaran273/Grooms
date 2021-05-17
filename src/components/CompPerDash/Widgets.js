import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faClock, faClipboardCheck, faThumbsUp, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { Row, Col, Card, Modal, Tooltip } from 'antd';
import { ClipLoader } from "react-spinners";

import Odometer from 'react-odometerjs';

import Drilldown from '../Drilldown/GlobalTblRemote';
import InfoModal from './InfoModal';

import { globalLoader, getCompletedOrderWidget, getGlobalRemoteTblData } from '../../services/action';

class Widgets extends Component {
    constructor(props) {
        super(props);
        this.state = {
            completeCount: 0,
            cycleTimeCount: 0,
            madeSLACount: 0,
            occdMetCount: 0,
            occdMetYield: 0,
            orderRiskLoad: true,
            renderDD: []
        }
        this.onClickDD = this.onClickDD.bind(this)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.loderCheck != prevProps.loderCheck) {
            if (this.props.loderCheck.result == true) {
                this.setState({
                    orderRiskLoad: true,
                    completeCount: 0,
                    cycleTimeCount: 0,
                    madeSLACount: 0,
                    occdMetCount: 0,
                    occdMetYield: 0,
                })
            }
        }
        if (this.props.copWidgetData != prevProps.copWidgetData) {
            if (this.props.copWidgetData != 0) {
                this.setState({
                    orderRiskLoad: false
                })
                setTimeout(() => {
                    this.setState({
                        completeCount: this.props.copWidgetData[0].TotalOrders,
                        cycleTimeCount: this.props.copWidgetData[0].AverageCycleTime,
                        madeSLACount: this.props.copWidgetData[0].SLAMadePercentage,
                        occdMetCount: this.props.copWidgetData[0].OCCDYieldMetCount,
                        occdMetYield: this.props.copWidgetData[0].OCCDYieldPercentage,
                    })
                }, 1)
            }
            else {
                this.setState({
                    orderRiskLoad: false,
                })
                setTimeout(() => {
                    this.setState({
                        completeCount: 0,
                        cycleTimeCount: 0,
                        madeSLACount: 0,
                        occdMetCount: 0,
                        occdMetYield: 0,
                    })
                }, 1)
            }
        }
    }

    onClickDD(e, callName) {
        let label = 'Completed Orders Details'
        let type = 'All'
        if (callName == "Complete") {
            label = 'Completed Orders Details'
            type = 'All'
        }
        else if (callName == "CycleTime") {
            label = 'Cycle Time Details'
            type = 'All'
        }
        else if (callName == "MadeSLA") {
            label = '% Made SLA Details'
            type = 'All'
        }
        else if (callName == "OCCD") {
            label = 'OCCD Details'
            type = 'OCCD'
        }
        var value = { type: type, skipRow: 1, fetchRow: 10, filterType: 'All', searchValue: 'All', sort: 'OrderAgingOrCT desc' }
        this.props.getGlobalRemoteTblData(value, 'COPWidget')
        this.setState({
            renderDD: <Drilldown openM={true} label={label} callName={'COPWidget'} type={type} sort={value.sort} onClose={this.handleCloseModal.bind(this)} />
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
                        <Card size="small" className="card-bg-clr-navy-blue card-bottom">
                            <div className="widget-icon-overlap"><FontAwesomeIcon className="widget-icon-clickboard" icon={faClipboardCheck} /></div>
                            <Tooltip placement="top" className="modal-tool-tip" title="Description">
                                <FontAwesomeIcon className="info-logo" icon={faInfoCircle} onClick={(e) => this.infoDDModal("Completeorder")} />
                            </Tooltip>
                            <div className="widget-value" onClick={(e) => this.onClickDD(e, 'Complete')}>
                                {this.state.orderRiskLoad ? <ClipLoader color={'#123abc'} /> :
                                    <div><Odometer value={this.state.completeCount} options={{ format: '' }} /></div>}
                                <div className="widget-label">Completed Orders</div>
                                <span className="widget-month-span">This Month</span>
                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                        <Card size="small" className="card-bg-clr-navy-blue card-bottom" >
                            <div className="widget-icon-overlap"><FontAwesomeIcon className="widget-icon-clock" icon={faClock} /></div>
                            <Tooltip placement="top" className="modal-tool-tip" title="Description">
                                <FontAwesomeIcon className="info-logo" icon={faInfoCircle} onClick={(e) => this.infoDDModal("CycleTime")} />
                            </Tooltip>
                            <div className="widget-value" onClick={(e) => this.onClickDD(e, 'CycleTime')}>
                                {this.state.orderRiskLoad ? <ClipLoader color={'#123abc'} /> :
                                    <div><Odometer value={this.state.cycleTimeCount} options={{ format: '' }} /><span className="small-units">BDays</span></div>}
                                <div className="widget-label">Cycle Time</div>
                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                        <Card size="small" className="card-bg-clr-navy-blue card-bottom" >
                            <div className="widget-icon-overlap"><FontAwesomeIcon className="widget-icon-clock" icon={faThumbsUp} /></div>
                            <Tooltip placement="top" className="modal-tool-tip" title="Description">
                                <FontAwesomeIcon className="info-logo" icon={faInfoCircle} onClick={(e) => this.infoDDModal("MadeSla")} />
                            </Tooltip>
                            <div className="widget-value" onClick={(e) => this.onClickDD(e, 'MadeSLA')}>
                                {this.state.orderRiskLoad ? <ClipLoader color={'#123abc'} /> :
                                    <div><Odometer value={this.state.madeSLACount} options={{ format: '' }} /><span className="small-units">%</span></div>}
                                <div className="widget-label">% Made SLA</div>
                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                        <Card size="small" className="card-bg-clr-navy-blue card-bottom occd-card" >
                            <div className="widget-icon-overlap"><FontAwesomeIcon className="widget-icon-clock" icon={faThumbsUp} /></div>
                            <Tooltip placement="top" className="modal-tool-tip" title="Description">
                                <FontAwesomeIcon className="info-logo" icon={faInfoCircle} onClick={(e) => this.infoDDModal("OccdMade")} />
                            </Tooltip>
                            <div className="widget-value" onClick={(e) => this.onClickDD(e, 'OCCD')}>
                                {this.state.orderRiskLoad ? <ClipLoader color={'#123abc'} /> :
                                    <div>
                                        <div className="div-occd-pb"><span className="occd-label">OCCD Met Count: </span><Odometer value={this.state.occdMetCount} options={{ format: '' }} /></div>
                                        <div><span className="occd-label">OCCD Yield: </span><Odometer value={this.state.occdMetYield} options={{ format: '' }} /><span className="small-units">%</span></div>
                                    </div>}
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
        copWidgetData: state.getCompletedOrderWidget,
        loderCheck: state.globalLoader,
    };
}

export default (connect(mapState, { globalLoader, getCompletedOrderWidget, getGlobalRemoteTblData })(Widgets));