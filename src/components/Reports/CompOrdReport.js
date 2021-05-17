import React, { Component } from 'react';
import { connect } from 'react-redux';

import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTable, faStream, faInfoCircle, faCircle } from '@fortawesome/free-solid-svg-icons';
import { Row, Col, Card, DatePicker, Tooltip, Button, Modal } from 'antd';
import BootstrapTable from 'react-bootstrap-table-next';
import BarLoader from "react-spinners/BarLoader";
import Drilldown from '../Drilldown/GlobalTblRemote';
import InfoModal from './InfoModal';
import { globalLoader, getCOPReports, getGlobalRemoteTblData } from '../../services/action';
import { Progress } from 'reactstrap';

class CompOrdReport extends Component {
    constructor(props) {
        super(props);
        this.onClickTblDD = this.onClickTblDD.bind(this);
        this.onChangeDatePicker = this.onChangeDatePicker.bind(this);
        
        this.state = {
            yearMonth: moment(new Date(), 'YYYY-MM-DD').subtract(0, 'M').format('YYYY-MM'),
            columns: [{ text: ''}],
            tblData: [],
            columns2: [{ text: '' }],
            tblData2: [],
            renderDD: [],
            label: "< 60%",
            label2: "61% - 74%",
            label3: "> 75%",
            isDataFetched: false,
            compOrdData: []
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.loderCheck != prevProps.loderCheck) {
            if (this.props.loderCheck.result == true) {
                this.setState({
                    isDataFetched: false,
                    tblData: []
                })
            }
        }
        if (this.props.compOrdData != prevProps.compOrdData) {
            if (this.props.compOrdData.length != 0) {
                var length = Math.round(this.props.compOrdData.length / 2);
                var workgroupWise = []
                var workgroupWise2 = []
                this.props.compOrdData.map((val, ind) => {
                    if (length > ind) {
                        if (ind == 0) {
                            val.Items.map((val1, ind1) => {
                                workgroupWise.push({ 'Month': val1.YearMonth, [val.PhaseName]: val1.YieldPercentage + '' })
                            })
                            workgroupWise.push({ 'Month': "Curr. AvgIntvl", [val.PhaseName]: val.AvgIntl })
                            workgroupWise.push({ 'Month': "Curr. Median", [val.PhaseName]: val.Median })
                            workgroupWise.push({ 'Month': "Curr. Orders", [val.PhaseName]: val.OrderCount })
                        }
                        else {
                            val.Items.map((val1, ind1) => {
                                Object.assign(workgroupWise[ind1], { [val.PhaseName]: val1.YieldPercentage });
                            })
                            Object.assign(workgroupWise[6], { [val.PhaseName]: val.AvgIntl });
                            Object.assign(workgroupWise[7], { [val.PhaseName]: val.Median });
                            Object.assign(workgroupWise[8], { [val.PhaseName]: val.OrderCount });
                        }
                    }
                    else {
                        if (workgroupWise2.length == 0) {
                            val.Items.map((val1, ind1) => {
                                workgroupWise2.push({ 'Month': val1.YearMonth, [val.PhaseName]: val1.YieldPercentage + '' })
                            })
                            workgroupWise2.push({ 'Month': "Curr. AvgIntvl", [val.PhaseName]: val.AvgIntl })
                            workgroupWise2.push({ 'Month': "Curr. Median", [val.PhaseName]: val.Median })
                            workgroupWise2.push({ 'Month': "Curr. Orders", [val.PhaseName]: val.OrderCount })
                        }
                        else {
                            val.Items.map((val1, ind1) => {
                                Object.assign(workgroupWise2[ind1], { [val.PhaseName]: val1.YieldPercentage });
                            })
                            Object.assign(workgroupWise2[6], { [val.PhaseName]: val.AvgIntl });
                            Object.assign(workgroupWise2[7], { [val.PhaseName]: val.Median });
                            Object.assign(workgroupWise2[8], { [val.PhaseName]: val.OrderCount });
                        }
                    }
                })
                var getColumns = [];
                for (var key in workgroupWise[0]) {
                    getColumns.push({
                        dataField: key, text: key, headerAlign: 'center', align: 'center',
                        events: {
                            onClick: (e, column, columnIndex, row, rowIndex) => {
                                this.setState({ phaseName: column.dataField })
                            },
                        },
                        formatter: (cell, row, rowIndex) => {
                            if (cell != row.Month) {
                                if (moment(this.state.yearMonth, 'YYYY-MM-DD').subtract(5, 'M').format('YYYY-MM') == row.Month || moment(this.state.yearMonth, 'YYYY-MM-DD').subtract(4, 'M').format('YYYY-MM') == row.Month ||
                                    moment(this.state.yearMonth, 'YYYY-MM-DD').subtract(3, 'M').format('YYYY-MM') == row.Month || moment(this.state.yearMonth, 'YYYY-MM-DD').subtract(2, 'M').format('YYYY-MM') == row.Month ||
                                    moment(this.state.yearMonth, 'YYYY-MM-DD').subtract(1, 'M').format('YYYY-MM') == row.Month || moment(this.state.yearMonth, 'YYYY-MM-DD').subtract(0, 'M').format('YYYY-MM') == row.Month ||
                                    moment(this.state.yearMonth, 'YYYY-MM-DD').subtract(5, 'M').format('YYYY-M') == row.Month || moment(this.state.yearMonth, 'YYYY-MM-DD').subtract(4, 'M').format('YYYY-M') == row.Month ||
                                    moment(this.state.yearMonth, 'YYYY-MM-DD').subtract(3, 'M').format('YYYY-M') == row.Month || moment(this.state.yearMonth, 'YYYY-MM-DD').subtract(2, 'M').format('YYYY-M') == row.Month ||
                                    moment(this.state.yearMonth, 'YYYY-MM-DD').subtract(1, 'M').format('YYYY-M') == row.Month || moment(this.state.yearMonth, 'YYYY-MM-DD').subtract(0, 'M').format('YYYY-M') == row.Month) {
                                    if (cell <= 60) {
                                        return <div className="report-icon-red" id={row.Month} onClick={this.onClickTblDD}>{cell}% <FontAwesomeIcon icon={faCircle} /></div>
                                    }
                                    else if (cell < 75) {
                                        return <div className="report-icon-yellow" id={row.Month} onClick={this.onClickTblDD}>{cell}% <FontAwesomeIcon icon={faCircle} /></div>
                                    }
                                    else {
                                        return <div className="report-icon-green" id={row.Month} onClick={this.onClickTblDD}>{cell}% <FontAwesomeIcon icon={faCircle} /></div>
                                    }
                                }
                                else {
                                    return <div>{cell}</div>
                                }
                            }
                            else {
                                return <div>{cell}</div>
                            }
                        }
                    })
                }
                var getColumns2 = [];
                for (var key in workgroupWise2[0]) {
                    getColumns2.push({
                        dataField: key, text: key, headerAlign: 'center', align: 'center',
                        events: {
                            onClick: (e, column, columnIndex, row, rowIndex) => {
                                this.setState({ phaseName: column.dataField })
                            },
                        },
                        formatter: (cell, row, rowIndex) => {
                            if (cell != row.Month) {
                                if (moment(this.state.yearMonth, 'YYYY-MM-DD').subtract(5, 'M').format('YYYY-MM') == row.Month || moment(this.state.yearMonth, 'YYYY-MM-DD').subtract(4, 'M').format('YYYY-MM') == row.Month ||
                                    moment(this.state.yearMonth, 'YYYY-MM-DD').subtract(3, 'M').format('YYYY-MM') == row.Month || moment(this.state.yearMonth, 'YYYY-MM-DD').subtract(2, 'M').format('YYYY-MM') == row.Month ||
                                    moment(this.state.yearMonth, 'YYYY-MM-DD').subtract(1, 'M').format('YYYY-MM') == row.Month || moment(this.state.yearMonth, 'YYYY-MM-DD').subtract(0, 'M').format('YYYY-MM') == row.Month ||
                                    moment(this.state.yearMonth, 'YYYY-MM-DD').subtract(5, 'M').format('YYYY-M') == row.Month || moment(this.state.yearMonth, 'YYYY-MM-DD').subtract(4, 'M').format('YYYY-M') == row.Month ||
                                    moment(this.state.yearMonth, 'YYYY-MM-DD').subtract(3, 'M').format('YYYY-M') == row.Month || moment(this.state.yearMonth, 'YYYY-MM-DD').subtract(2, 'M').format('YYYY-M') == row.Month ||
                                    moment(this.state.yearMonth, 'YYYY-MM-DD').subtract(1, 'M').format('YYYY-M') == row.Month || moment(this.state.yearMonth, 'YYYY-MM-DD').subtract(0, 'M').format('YYYY-M') == row.Month) {
                                    if (cell <= 60) {
                                        return <div className="report-icon-red" id={row.Month} onClick={this.onClickTblDD}>{cell}% <FontAwesomeIcon icon={faCircle} /></div>
                                    }
                                    else if (cell < 75) {
                                        return <div className="report-icon-yellow" id={row.Month} onClick={this.onClickTblDD}>{cell}% <FontAwesomeIcon icon={faCircle} /></div>
                                    }
                                    else {
                                        return <div className="report-icon-green" id={row.Month} onClick={this.onClickTblDD}>{cell}% <FontAwesomeIcon icon={faCircle} /></div>
                                    }
                                }
                                else {
                                    return <div>{cell}</div>
                                }
                            }
                            else {
                                return <div>{cell}</div>
                            }
                        }
                    })
                }
                this.setState({
                    columns: getColumns,
                    tblData: workgroupWise,
                    columns2: getColumns2,
                    tblData2: workgroupWise2,
                })
            }
            else {
                this.setState({
                    isDataFetched: true,
                    tblData: [],
                })
            }
        }
    }

    onClickTblDD(e) {
        let yearMonth = e.currentTarget.id
        setTimeout(() => {
            var values = {
                type: yearMonth, phaseName: this.state.phaseName, directorname: 'all', sourceSystem: 'all', skipRow: 1, fetchRow: 10,
                filterType: 'all', searchValue: 'all', sort: 'OrderAgingOrCT desc'
            };
            let label = this.state.phaseName + ' - ' + yearMonth;
            this.props.getGlobalRemoteTblData(values, 'COP_Report')
            this.setState({
                renderDD: <Drilldown openM={true} label={label} callName={'COP_Report'} type={values.type} phaseName={values.phaseName} sort={values.sort}
                    onClose={this.handleCloseModal.bind(this)} />
            })
        }, 1)
    }

    handleCloseModal() {
        this.setState({
            renderDD: []
        })
    }

    onChangeDatePicker(date, dateString) {
        this.setState({
            tblData: [],
            isDataFetched: false,
            yearMonth: dateString
        })
        this.props.getCOPReports(dateString)
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
        const monthFormat = 'YYYY-MM';
        return (
            <React.Fragment>
                <Row>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Card title={<Row>
                            <Col xs={22} sm={22} md={22} lg={22} xl={22}>Completed Order Performance</Col>
                            <Col xs={2} sm={2} md={2} lg={2} xl={2}>
                                <DatePicker allowClear={false} defaultValue={moment(this.state.yearMonth, monthFormat)} format={monthFormat}
                                    onChange={this.onChangeDatePicker} picker="month" />
                            </Col>
                        </Row>} className="card-tbl card-bottom">
                            <Row>
                                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                    <div className="float-right legend-cop">
                                        <span className="legent-chart">
                                            <span><FontAwesomeIcon icon={faCircle} className="icon-red" /> {this.state.label}</span>
                                            <span><FontAwesomeIcon icon={faCircle} className="icon-yellow" /> {this.state.label2}</span>
                                            <span><FontAwesomeIcon icon={faCircle} className="icon-green" /> {this.state.label3}</span>
                                        </span>
                                    </div>
                                </Col>
                                
                            </Row>
                            <BootstrapTable keyField="id2" data={this.state.tblData} columns={this.state.columns} bordered={false} striped noDataIndication={() => this.tblLoader()} />
                            {this.state.tblData2.length != 0 ? <div className="mt-2"><BootstrapTable keyField="id3" data={this.state.tblData2} columns={this.state.columns2} bordered={false} striped noDataIndication={() => this.tblLoader()} /></div> : null}
                        </Card>
                    </Col>
                </Row>
                {this.state.renderDD}
                {/*<InfoModal setClick1={click => this.infoDDModal = click} />*/}
            </React.Fragment>
        );
    }
}

function mapState(state) {
    return {
        loderCheck: state.globalLoader,
        compOrdData: state.getCOPReports,
    };
}

export default (connect(mapState, { globalLoader, getCOPReports, getGlobalRemoteTblData })(CompOrdReport));