import React, { Component } from 'react';
import { connect } from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { Row, Col, Card, Tooltip, Button, Modal } from 'antd';
import BootstrapTable from 'react-bootstrap-table-next';
import BarLoader from "react-spinners/BarLoader";
import Drilldown from '../Drilldown/GlobalTblRemote';
import InfoModal from './InfoModal';
import { globalLoader, getTaskProfileWIP, getGlobalRemoteTblData } from '../../services/action';

class TaskProfile extends Component {
    constructor(props) {
        super(props);
        this.onClickArrow = this.onClickArrow.bind(this);
        this.onClickTags = this.onClickTags.bind(this);

        this.state = {
            totalTblColumns: [
                { dataField: '', text: '', headerStyle: { width: 13 } },
                { dataField: 'Name', text: '', headerStyle: { width: 180 } },
                { dataField: 'Total', text: 'Total', headerAlign: 'center', align: 'center', formatter: (cell, row) => (<span className="wip-tbl-count" id="Total" onClick={(e) => this.onClickDD(e, row)}>{cell}</span>) },
                { dataField: 'PastDue', text: 'PastDue', headerAlign: 'center', align: 'center', formatter: (cell, row) => (<span className="wip-tbl-count" id="PastDue" onClick={(e) => this.onClickDD(e, row)}>{cell}</span>) },
                { dataField: 'DueToday', text: 'DueToday', headerAlign: 'center', align: 'center', formatter: (cell, row) => (<span className="wip-tbl-count" id="DueToday" onClick={(e) => this.onClickDD(e, row)}>{cell}</span>) },
                { dataField: 'DueTomorrow', text: 'DueTomorrow', headerAlign: 'center', align: 'center', formatter: (cell, row) => (<span className="wip-tbl-count" id="DueTomorrow" onClick={(e) => this.onClickDD(e, row)}>{cell}</span>) },
                { dataField: 'CurrentMonth', text: 'CurrentMonth', headerAlign: 'center', align: 'center', formatter: (cell, row) => (<span className="wip-tbl-count" id="CurrentMonth" onClick={(e) => this.onClickDD(e, row)}>{cell}</span>) },
                { dataField: 'NextMonth', text: 'NextMonth', headerAlign: 'center', align: 'center', formatter: (cell, row) => (<span className="wip-tbl-count" id="NextMonth" onClick={(e) => this.onClickDD(e, row)}>{cell}</span>) },
                { dataField: 'twoplusmonths', text: '2+months', headerAlign: 'center', align: 'center', formatter: (cell, row) => (<span className="wip-tbl-count" id="twoplusmonths" onClick={(e) => this.onClickDD(e, row)}>{cell}</span>) }
            ],
            totalTblData: [],
            columns: [
                {
                    dataField: 'Cuid', text: '', headerStyle: { width: 13 }, formatter: (cell, row) => (
                        row.isReportingPerson == "No" ? null : <FontAwesomeIcon className="ccd-icon-clr" icon={faChevronRight} onClick={() => this.onClickArrow(row)} />)
                },
                { dataField: 'Name', text: 'Name', headerStyle: { width: 180 }},
                { dataField: 'Total', text: 'Total', headerAlign: 'center', align: 'center', sort: true, formatter: (cell, row) => (<span className="wip-tbl-count" id="Total" onClick={(e) => this.onClickDD(e, row)}>{cell}</span>)},
                { dataField: 'PastDue', text: 'PastDue', headerAlign: 'center', align: 'center', sort: true, formatter: (cell, row) => (<span className="wip-tbl-count" id="PastDue" onClick={(e) => this.onClickDD(e, row)}>{cell}</span>) },
                { dataField: 'DueToday', text: 'DueToday', headerAlign: 'center', align: 'center', sort: true, formatter: (cell, row) => (<span className="wip-tbl-count" id="DueToday" onClick={(e) => this.onClickDD(e, row)}>{cell}</span>) },
                { dataField: 'DueTomorrow', text: 'DueTomorrow', headerAlign: 'center', align: 'center', sort: true, formatter: (cell, row) => (<span className="wip-tbl-count" id="DueTomorrow" onClick={(e) => this.onClickDD(e, row)}>{cell}</span>) },
                { dataField: 'CurrentMonth', text: 'CurrentMonth', headerAlign: 'center', align: 'center', sort: true, formatter: (cell, row) => (<span className="wip-tbl-count" id="CurrentMonth" onClick={(e) => this.onClickDD(e, row)}>{cell}</span>) },
                { dataField: 'NextMonth', text: 'NextMonth', headerAlign: 'center', align: 'center', sort: true, formatter: (cell, row) => (<span className="wip-tbl-count" id="NextMonth" onClick={(e) => this.onClickDD(e, row)}>{cell}</span>) },
                { dataField: 'twoplusmonths', text: '2+months', headerAlign: 'center', align: 'center', sort: true, formatter: (cell, row) => (<span className="wip-tbl-count" id="twoplusmonths" onClick={(e) => this.onClickDD(e, row)}>{cell}</span>) }
            ],
            tblData: [],
            renderDD: [],
            selectedNames: [<li><span class="tag" id="All" onClick={this.onClickTags}>All</span></li>]
        }; 
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.loderCheck != prevProps.loderCheck) {
            if (this.props.loderCheck.result == true) {
                this.setState({
                    tblData: [],
                    totalTblData: [],
                    isDataFetched: false,
                })
            }
        }
        if (this.props.taskProfileData != prevProps.taskProfileData) {
            if (this.props.taskProfileData.length != 0) {
                var totalValues = []
                var values = []
                this.props.taskProfileData.map((val, ind) => {
                    if (val.Name == "Total") {
                        totalValues.push(val)
                    }
                    else {
                        values.push(val)
                    }
                })
                this.setState({
                    tblData: values,
                    totalTblData: totalValues
                })
                if (values.length == 0) {
                    this.setState({
                        tblData: [],
                        isDataFetched: true,
                    })
                }
            }
            else {
                this.setState({
                    tblData: [],
                    totalTblData: [],
                    isDataFetched: true,
                })
            }
        }
    }

    onClickArrow(row) {
        this.setState({
            tblData: [],
            totalTblData: [],
            isDataFetched: false,
            sendCUID: row.Cuid
        });
        var value = [row];
        value.map((val, ind) => {
            return this.state.selectedNames.push(<li><span class="tag" id={val.Cuid} onClick={this.onClickTags}>{val.Name}</span></li>)
        });

        let values = { cuid: row.Cuid, Actionable: this.state.selectedAction, YieldMet: this.state.selectedYield };
        this.props.getTaskProfileWIP(values);
    }

    onClickTags(e) {
        var value = [];
        for (var i = 0; i < this.state.selectedNames.length; i++) {
            if (this.state.selectedNames[i].props.children.props.id == e.currentTarget.id) {
                value.push(this.state.selectedNames[i]);
                break;
            }
            value.push(this.state.selectedNames[i]);
        }
        this.setState({
            tblData: [],
            totalTblData: [],
            isDataFetched: false,
            selectedNames: value,
            sendCUID: e.currentTarget.id
        });
        let values = { cuid: e.currentTarget.id };
        this.props.getTaskProfileWIP(values);
    }

    onClickDD(e, row) {
        let label = row.Name + ' - ' + e.currentTarget.id 
        var values = { cuid: row.Cuid, type: e.currentTarget.id, skipRow: 1, fetchRow: 10, filterType: 'All', searchValue: 'All', sort: 'TaskAging desc' }
        this.props.getGlobalRemoteTblData(values, 'TaskProfileWIP')
        this.setState({
            renderDD: <Drilldown openM={true} label={label} callName={'TaskProfileWIP'} cuid={values.cuid} type={values.type}
                sort={values.sort} onClose={this.handleCloseModal.bind(this)} />
        })
    }

    handleCloseModal() {
        this.setState({
            renderDD: []
        })
    }

    tblLoader() {
        if (this.state.isDataFetched) {
            return (<div className="tbl-no-data-found"><div>No data available for this criteria</div></div>);
        }
        else {
            return (<div className="tbl-loading"><h6>Loading</h6><BarLoader color={'#123abc'} /></div>);
        }
    }

    render() {
        return (
            <React.Fragment>
                <Row>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Card title={<Row>
                            <Col xs={22} sm={22} md={22} lg={22} xl={22}>WIP Tasks Target Profile (ML Target)</Col>
                            <Col xs={2} sm={2} md={2} lg={2} xl={2}>
                                <Tooltip placement="top" className="modal-tool-tip" title="Description">
                                    <FontAwesomeIcon className="info-logo" icon={faInfoCircle} onClick={(e) => this.infoDDModal("TaskProfile")} />
                                </Tooltip>
                            </Col>
                        </Row>} className="card-tbl card-bottom">
                            <ul class="tags">
                                {this.state.selectedNames}
                            </ul>
                            {this.state.totalTblData.length != 0 ? <div className="mb-2"><BootstrapTable keyField="id" data={this.state.totalTblData} columns={this.state.totalTblColumns} bordered={false} striped noDataIndication={() => this.tblLoader()} /></div> : <span />}
                            <div className="ccd-tbl"><BootstrapTable keyField="id2" data={this.state.tblData} columns={this.state.columns} bordered={false} striped noDataIndication={() => this.tblLoader()} /></div>
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
        taskProfileData: state.getTaskProfileWIP,
        loderCheck: state.globalLoader,
    };
}

export default (connect(mapState, { globalLoader, getTaskProfileWIP, getGlobalRemoteTblData })(TaskProfile));