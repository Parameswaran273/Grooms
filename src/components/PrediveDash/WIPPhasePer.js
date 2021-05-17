import React, { Component } from 'react';
import { connect } from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTable, faStream, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { Row, Col, Card, Tooltip, Button, Modal } from 'antd';
import BootstrapTable from 'react-bootstrap-table-next';
import BarLoader from "react-spinners/BarLoader";
import Drilldown from '../Drilldown/GlobalTblRemote';
import InfoModal from './InfoModal';
import { globalLoader, getWIPPerformaceWidget, getSubintervalDeatils, getGlobalRemoteTblData } from '../../services/action';
import { Progress } from 'reactstrap';

class WIPPhasePer extends Component {
    constructor(props) {
        super(props);
        this.progressBar = this.progressBar.bind(this);
        this.onClickTblDD = this.onClickTblDD.bind(this);
        this.onClickInfoDD = this.onClickInfoDD.bind(this);
        this.onClickSubinterval = this.onClickSubinterval.bind(this);
        
        this.state = {
            totalTblColumns: [
                {
                    dataField: 'phasename', text: 'Action', headerStyle: { width: 90 }, formatter: (cell, row, rowIndex, extraData) => (
                        <div>
                            <Tooltip placement="top" className="modal-tool-tip" title="Drilldown order details">
                                <Button size="small" type="primary" className="mr-1 milestone-btn-tbl float-left" id={row.phasename} name='ALL' onClick={this.onClickTblDD}>
                                    <FontAwesomeIcon icon={faTable} />
                                </Button>
                            </Tooltip>
                            {/*<Tooltip placement="top" className="modal-tool-tip" title="Subinterval">
                                <Button size="small" type="primary" className="mr-1 milestone-btn-tbl float-left" id={row.WorkGroup} name='ALL' onClick={this.onClickMilestoneSubintervalTblDD}>
                                    <FontAwesomeIcon icon={faStream} />
                                </Button>
                            </Tooltip>*/}
                        </div>
                    )
                },
                { dataField: 'phasename', text: 'Total', headerStyle: { width: 180 } },
                { dataField: 'Totalorders', text: 'Orders', headerStyle: { width: 120 } },
                { dataField: 'yieldpercentage', text: 'Predicted Yield %', headerStyle: { width: 180 }, formatter: this.progressBar },
                { dataField: 'median', text: 'Predicted Interval Median', headerAlign: 'center', align: 'center', headerStyle: { width: 150 } },
                { dataField: 'cycletime', text: 'Actual Aging Avg', headerAlign: 'center', align: 'center', headerStyle: { width: 150 } },
            ],
            totalTblData: [],
            columns: [
                {
                    dataField: 'phasename', text: 'Action', headerStyle: { width: 90 }, formatter: (cell, row, rowIndex, extraData) => (
                        <div>
                            <Tooltip placement="top" className="modal-tool-tip" title="Drilldown order details">
                                <Button size="small" type="primary" className="mr-1 milestone-btn-tbl float-left" id={row.phasename} name='ALL' onClick={this.onClickTblDD}>
                                    <FontAwesomeIcon icon={faTable} />
                                </Button>
                            </Tooltip>
                            <Tooltip placement="top" className="modal-tool-tip" title="Subinterval">
                                <Button size="small" type="primary" className="mr-1 milestone-btn-tbl float-left" id={row.phasename} name='ALL' onClick={this.onClickSubinterval}>
                                    <FontAwesomeIcon icon={faStream} />
                                </Button>
                            </Tooltip>
                        </div>
                    )
                },
                { dataField: 'phasename', text: 'Phase', headerStyle: { width: 180 } },
                { dataField: 'Totalorders', text: 'Orders', headerStyle: { width: 120 } },
                { dataField: 'yieldpercentage', text: 'Predicted Yield %', headerStyle: { width: 180 }, formatter: this.progressBar },
                { dataField: 'median', text: 'Predicted Interval Median', headerAlign: 'center', align: 'center', headerStyle: { width: 150 }},
                { dataField: 'cycletime', text: 'Actual Aging Avg', headerAlign: 'center', align: 'center', headerStyle: { width: 150 }},
            ],
            tblData: [],
            subTblColumn: [
                {
                    dataField: 'phasename', text: 'Action', headerStyle: { width: 90 }, formatter: (cell, row, rowIndex, extraData) => (
                        <div>
                            <Tooltip placement="top" className="modal-tool-tip" title="Drilldown order details">
                                <Button size="small" type="primary" className="mr-1 milestone-btn-tbl float-left" name='ALL' onClick={(e) => this.onClickSubTblDD(row)}>
                                    <FontAwesomeIcon icon={faTable} />
                                </Button>
                            </Tooltip>
                        </div>
                    )
                },
                { dataField: 'SubintervalName', text: 'Subinterval', headerStyle: { width: 180 } },
                { dataField: 'OrderCount', text: 'Orders', headerStyle: { width: 120 } },
                { dataField: 'yield_Percentage', text: 'Predicted Yield %', headerStyle: { width: 180 }, formatter: this.progressBar },
                { dataField: 'Median', text: 'Predicted Interval Median', headerAlign: 'center', align: 'center', headerStyle: { width: 150 } },
                { dataField: 'Avg_Interval', text: 'Actual Aging Avg', headerAlign: 'center', align: 'center', headerStyle: { width: 150 } },
            ],
            subTblData: [],
            subModal: false,
            renderDD: [],
            isDataFetched: false,
            tableHide: false
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.loderCheck != prevProps.loderCheck) {
            if (this.props.loderCheck.result == true) {
                this.setState({
                    isDataFetched: false,
                    tblData: [],
                    totalTblData: [],
                    tableHide: false
                })
            }
        }
        if (this.props.wipPhasePer != prevProps.wipPhasePer) {
            if (this.props.wipPhasePer.length != 0) {
                var totalValues = []
                var values = []
                if (this.props.wipPhasePer.length != 0) {
                    this.props.wipPhasePer.map((val, ind) => {
                        if (val.phasename == "Total") {
                            totalValues.push(val)
                        }
                        else {
                            values.push(val)
                        }
                    })
                }
                this.setState({
                    tblData: values,
                    totalTblData: totalValues
                })
                if (values.length == 0) {
                    this.setState({
                        isDataFetched: true,
                        tblData: [],
                        tableHide: true
                    })
                }
            }
            else {
                this.setState({
                    isDataFetched: true,
                    tblData: [],
                    totalTblData: []
                })
            }
        }
        if (this.props.subViewData != prevProps.subViewData) {
            if (this.props.subViewData.length != 0) {
                this.setState({
                    isDataFetched: false,
                    subTblData: this.props.subViewData,
                })
            }
        }
    }

    onClickTblDD(e) {
        var values = { phaseName: e.currentTarget.id, skipRow: 1, fetchRow: 10, filterType: 'all', searchValue: 'all', type: 'all', sort: 'OrderAgingOrCT desc' };
        let label = e.currentTarget.id;
        this.props.getGlobalRemoteTblData(values, 'WIPPerformaceDD')
        this.setState({
            renderDD: <Drilldown openM={true} label={label} callName={'WIPPerformaceDD'} phaseName={values.phaseName}
                sort={values.sort} onClose={this.handleCloseModal.bind(this)} />
        })
    }

    onClickInfoDD(e) {
        var values = { };
        let label = "Description/Logic";
        this.props.getGlobalRemoteTblData(values, 'PhaseYieldTarget')
        this.setState({
            renderDD: <Drilldown openM={true} label={label} callName={'PhaseYieldTarget'} globalTbl={true} phaseName={values.phaseName}
                sort={values.sort} onClose={this.handleCloseModal.bind(this)} />
        })
    }

    onClickSubTblDD(row) {
        var values = { subinterval: row.SubintervalName, phaseName: row.PhaseName, skipRow: 1, fetchRow: 10, filterType: 'all', searchValue: 'all', type: 'all', sort: 'OrderAgingOrCT desc' };
        let label = row.PhaseName + ' - ' + values.subinterval;
        this.props.getGlobalRemoteTblData(values, 'WIPPerformaceSubDD')
        this.setState({
            renderDD: <Drilldown openM={true} label={label} callName={'WIPPerformaceSubDD'} subinterval={values.subinterval} phaseName={values.phaseName}
                sort={values.sort} onClose={this.handleCloseModal.bind(this)} />
        })
    }

    onClickSubinterval(e) {
        if (this.state.subModal == true) {
            this.setState({
                subModal: false
            })
        }
        else {
            this.props.getSubintervalDeatils({ phaseName: e.currentTarget.id })
            this.setState({
                subModal: true,
                subHeadLabel: e.currentTarget.id,
                subTblData: []
            })
        }
    }

    handleCloseModal() {
        this.setState({
            renderDD: []
        })
    }

    progressBar(cell, row, rowIndex, formatExtraData) {
        return <div><Progress className="progress-2 tbl-progress-bar green-progress" animated value={cell} /><span> {cell}%</span></div>;
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
                            <Col xs={22} sm={22} md={22} lg={22} xl={22}>WIP Phase Performance</Col>
                            <Col xs={2} sm={2} md={2} lg={2} xl={2}>
                                <Tooltip placement="top" className="modal-tool-tip" title="Description/Logic">
                                    <FontAwesomeIcon className="info-logo" icon={faInfoCircle} onClick={this.onClickInfoDD} />
                                </Tooltip>
                            </Col>
                        </Row>} className="card-tbl card-bottom">
                            {this.state.totalTblData.length != 0 ? <div className="mb-2"><BootstrapTable keyField="id" data={this.state.totalTblData} columns={this.state.totalTblColumns} bordered={false} striped noDataIndication={() => this.tblLoader()} /></div> : <span />}
                            <div hidden={this.state.tableHide}><BootstrapTable keyField="id2" data={this.state.tblData} columns={this.state.columns} bordered={false} striped noDataIndication={() => this.tblLoader()} /></div>
                        </Card>
                    </Col>
                </Row>
                <Modal className="sub-tbl" title={this.state.subHeadLabel} visible={this.state.subModal} onCancel={this.onClickSubinterval} width="75%" style={{ top: 50 }} footer={null}>
                    <BootstrapTable keyField="id3" data={this.state.subTblData} columns={this.state.subTblColumn} bordered={false} striped noDataIndication={() => this.tblLoader()} />
                </Modal>
                {this.state.renderDD}
                <InfoModal setClick1={click => this.infoDDModal = click} />
            </React.Fragment>
        );
    }
}

function mapState(state) {
    return {
        wipPhasePer: state.getWIPPerformaceWidget,
        subViewData: state.getSubintervalDeatils,
        loderCheck: state.globalLoader,
    };
}

export default (connect(mapState, { globalLoader, getWIPPerformaceWidget, getSubintervalDeatils, getGlobalRemoteTblData })(WIPPhasePer));