import React, { Component } from 'react';
import { connect } from 'react-redux';

import moment from 'moment';
import BarLoader from "react-spinners/BarLoader";
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faExclamationCircle, faChevronRight, faPlus } from '@fortawesome/free-solid-svg-icons';

import { Row, Col, Modal, Card, Tooltip, Button, Tag, Switch, Menu, Dropdown } from 'antd';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';

import { getOrderDetails, getMilestoneView, getMilestoneSubView } from '../../services/action';
import { openTeams } from '../DynamicColumnRemote';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
class MilestoneTreeView extends Component {
    constructor(props) {
        super(props);
        this.toggleMilestoneView = this.toggleMilestoneView.bind(this);
        this.onClickExport = this.onClickExport.bind(this);
        this.onClickSubView = this.onClickSubView.bind(this);
        this.state = {
            orderDetailsDD: [],
            milestonetreeData: [],
            milestoneTblData: [],
            focusTreeData: [],
            subMilestoneData: [],
            orderLoad: true,
            treeLoder: true,
            activeTreeView: true,
            isDataFetched: false,
            subViewTblModal: false,
            tblColumn: [{ text: '' }],
            subTblColumn: [{ text: '' }],
            activeFocus: 'tree-btn-active',
            activeChronological: '',
            activeWorkgroup: '',
            activeView: 'FocusedView',
            nidStatus: 'In Progress'
        };
    }

    componentDidMount() {
        document.body.classList.add('freeze-column-milestone-Tbl');
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.orderDetailsDD != prevProps.orderDetailsDD) {
            if (this.props.orderDetailsDD != 0) {
                this.setState({
                    orderLoad: false,
                    orderDetailsDD: this.props.orderDetailsDD,
                    sourceSystem: this.props.orderDetailsDD[0].SourceSystem,
                    nidStatus: this.props.orderDetailsDD[0].NIDStatus
                })
                let value = { type: "Chronological", OrderId: this.props.orderId }
                this.props.getMilestoneView(value);
            }
            else {
                this.setState({
                    orderLoad: false,
                    orderDetailsDD: []
                })
            }
        }
        if (this.props.milestonetreeData != prevProps.milestonetreeData) {
            if (this.props.milestonetreeData != 0) {
                var milestoneData = []; 
                var focusTblData = []; 
                var focusData = [];
                var startDate = []
                var endDate = []
                var interval = []
                var delay = []
                var className = 'risk';
                var icon = <FontAwesomeIcon icon={faCircle} className="icon-red" />;
                this.props.milestonetreeData.map((val, ind) => {
                    if (val.Status == 'Completed') {
                        startDate = <span>Started: {val.ActualStart_PredictedStart == null || val.ActualStart_PredictedStart == "" ? '--' : moment(val.ActualStart_PredictedStart).format('MM-DD-YYYY') }</span>;
                        endDate = <span>Completed: {val.AcutalCompleteDate == null || val.AcutalCompleteDate == "" ? '--' : moment(val.AcutalCompleteDate).format('MM-DD-YYYY')}</span>;
                        interval = <span>Actual Interval: {val.ActualIntl == null ? '--' : val.ActualIntl + ' BDays' }</span>;
                        delay = [];
                        icon = <FontAwesomeIcon icon={faCircle} className="milestone-icon-green" />
                        className= 'completed'
                    }
                    else if (val.Status == 'Completed with TargetMissed') {
                        startDate = <span>Start: {val.ActualStart_PredictedStart == null || val.ActualStart_PredictedStart == "" ? '--' : moment(val.ActualStart_PredictedStart).format('MM-DD-YYYY')}</span>;
                        endDate = this.state.nidStatus == 'In Progress' ? <span>Predicted Target: {val.PredictedCompletedate == null || val.PredictedCompletedate == "" ? '--' : moment(val.PredictedCompletedate).format('MM-DD-YYYY')}</span> : null;
                        interval = this.state.nidStatus == 'In Progress' ? <span>Predicted Interval: {val.PredictedIntl == null ? '--' : val.PredictedIntl + ' BDays'}</span> : null;
                        delay = <span>Exceeded Interval: {val.ExceededTgt == null ? '--' : val.ExceededTgt + ' BDays'}</span>;
                        icon = <FontAwesomeIcon icon={faExclamationCircle} className="milestone-icon-red-green" />
                        className = 'complete-target'
                    }
                    else if (val.Status == 'In_Progress') {
                        startDate = <span>Started: {val.ActualStart_PredictedStart == null || val.ActualStart_PredictedStart == "" ? '--' : moment(val.ActualStart_PredictedStart).format('MM-DD-YYYY')}</span>;
                        endDate = this.state.nidStatus == 'In Progress' ? <span>Predicted Target: {val.PredictedCompletedate == null || val.PredictedCompletedate == "" ? '--' : moment(val.PredictedCompletedate).format('MM-DD-YYYY')}</span> : null;
                        interval = this.state.nidStatus == 'In Progress' ? <span>Predicted Interval: {val.PredictedIntl == null ? '--' : val.PredictedIntl + ' BDays'}</span> : null;
                        delay = [];
                        icon = <FontAwesomeIcon icon={faCircle} className="milestone-icon-yellow" />
                        className = 'inprogress'
                    }
                    else if (val.Status == 'Predicted') {
                        startDate = <span>Predicted Start: {val.ActualStart_PredictedStart == null || val.ActualStart_PredictedStart == "" ? '--' : moment(val.ActualStart_PredictedStart).format('MM-DD-YYYY')}</span>;
                        endDate = this.state.nidStatus == 'In Progress' ? <span>Predicted Target: {val.PredictedCompletedate == null || val.PredictedCompletedate == "" ? '--' : moment(val.PredictedCompletedate).format('MM-DD-YYYY')}</span> : null;
                        interval = this.state.nidStatus == 'In Progress' ? <span>Predicted Interval: {val.PredictedIntl == null ? '--' : val.PredictedIntl + ' BDays'}</span> : null;
                        delay = [];
                        icon = <FontAwesomeIcon icon={faCircle} className="milestone-icon-blue-blink" />
                        className = 'predicted'
                    }
                    else if (val.Status == 'Risk') {
                        startDate = <span>Start: {val.ActualStart_PredictedStart == null || val.ActualStart_PredictedStart == "" ? '--' : moment(val.ActualStart_PredictedStart).format('MM-DD-YYYY')}</span>;
                        endDate = this.state.nidStatus == 'In Progress' ? <span>Predicted Target: {val.PredictedCompletedate == null || val.PredictedCompletedate == "" ? '--' : moment(val.PredictedCompletedate).format('MM-DD-YYYY')}</span> : null;
                        interval = this.state.nidStatus == 'In Progress' ? <span>Predicted Interval: {val.PredictedIntl == null ? '--' : val.PredictedIntl + ' BDays'}</span> : null;
                        delay = <span>Exceeded Interval: {val.ExceededTgt == null ? '--' : val.ExceededTgt + ' BDays'}</span>;
                        icon = <FontAwesomeIcon icon={faCircle} className="milestone-icon-red-blink" />
                        className = 'risk'
                    }
                    if (this.state.activeView == 'FocusedView' || this.state.activeView == 'ChronologicalView') {
                        if (val.Status == "In_Progress" || val.Status == "Predicted" || val.Status == "Risk") {
                            focusData.push(
                                <VerticalTimelineElement className={"vertical-timeline-element--work " + className} contentStyle={{ background: 'rgba(33, 37, 41, 0.6)', color: '#fff' }}
                                    contentArrowStyle={{ borderRight: '7px solid  rgba(33, 37, 41, 0.6)' }} date={val.ActualStart_PredictedStart == "" || val.ActualStart_PredictedStart == null ? ' -- ' : moment(val.ActualStart_PredictedStart).format('MM-DD-YYYY')} icon={icon}>
                                    <div className="tree-card-head">{val.PhaseName}: <span className="sub-name-head">{val.SubintervalName}</span></div>
                                    <div>{startDate}<span className="float-right">{endDate}</span></div>
                                    <div>{interval} <span className="float-right">{delay}</span></div>
                                    {val.ServiceOrderUnit == "" || val.ServiceOrderUnit == null ? null : <div>ServiceOrderUnit: {val.ServiceOrderUnit}</div>}
                                    {val.Owner != null ? <Row className="text-right">
                                        <span onClick={() => openTeams(val)}><span className="owner-name"><span className="microsoft-team-icon" /> {val.Owner}</span></span>
                                    </Row> : null}
                                </VerticalTimelineElement>
                            )
                            focusTblData.push(val)
                        }
                        milestoneData.push(
                            <VerticalTimelineElement className={"vertical-timeline-element--work " + className} contentStyle={{ background: 'rgba(33, 37, 41, 0.6)', color: '#fff' }}
                                contentArrowStyle={{ borderRight: '7px solid  rgba(33, 37, 41, 0.6)' }} date={val.ActualStart_PredictedStart == "" || val.ActualStart_PredictedStart == null ? ' -- ' : moment(val.ActualStart_PredictedStart).format('MM-DD-YYYY')} icon={icon}>
                                <div className="tree-card-head">{val.PhaseName}: <span className="sub-name-head">{val.SubintervalName}</span></div>
                                <div>{startDate}<span className="float-right">{endDate}</span></div>
                                <div>{interval} <span className="float-right">{delay}</span></div>
                                {val.ServiceOrderUnit == "" || val.ServiceOrderUnit == null ? null : <div>ServiceOrderUnit: {val.ServiceOrderUnit}</div>}
                                {val.Owner != null ? <Row className="text-right">
                                    <span onClick={() => openTeams(val)}><span className="owner-name"><span className="microsoft-team-icon" /> {val.Owner}</span></span>
                                </Row> : null}
                            </VerticalTimelineElement>
                        );
                    }
                    else {
                        milestoneData.push(
                            <VerticalTimelineElement className={"vertical-timeline-element--work " + className} contentStyle={{ background: 'rgba(33, 37, 41, 0.6)', color: '#fff' }}
                                contentArrowStyle={{ borderRight: '7px solid  rgba(33, 37, 41, 0.6)' }} date={val.ActualStart_PredictedStart == "" || val.ActualStart_PredictedStart == null ? ' -- ' : moment(val.ActualStart_PredictedStart).format('MM-DD-YYYY')} icon={icon}>
                                <div className="tree-card-head">{val.PhaseName} <FontAwesomeIcon className="sub-plus-icon" icon={faPlus} onClick={() => this.onClickSubView(val)} /></div>
                                <div className="pt-1">{startDate}<span className="float-right">{endDate}</span></div>
                                <div>{interval} <span className="float-right">{delay}</span></div>
                            </VerticalTimelineElement>
                        );
                    }
                });
                if (this.state.activeView == 'FocusedView' || this.state.activeView == 'ChronologicalView') {
                    if (focusData.length == 0) {
                        this.setState({
                            activeTreeView: false,
                            focusBtnDisable: true,
                            activeView: 'ChronologicalView',
                            activeFocus: '',
                            activeChronological: 'tree-btn-active',
                            activeWorkgroup: '',
                        })
                    }
                    else {
                        if (this.state.activeView == 'FocusedView') {
                            this.setState({
                                activeTreeView: true,
                                focusBtnDisable: false,
                                activeView: 'FocusedView',
                                activeFocus: 'tree-btn-active',
                                activeChronological: '',
                                activeWorkgroup: '',
                            })
                        }
                    }
                }
                this.setState({
                    treeLoder: false,
                    focusTreeData: focusData,
                    treeData: milestoneData,
                    milestoneTblData: focusTblData,
                    milestonetreeData: this.props.milestonetreeData,
                    tblColumn:
                        [
                            this.state.activeView != 'WorkgroupView' ? { field: '', title: '', hidden: true, headerStyle: { width: 0 } } : { dataField: '', text: '', headerStyle: { width: 20 }, formatter: (cell, row) => (<FontAwesomeIcon className="sub-icon" icon={faChevronRight} onClick={() => this.onClickSubView(row)} />) },
                            this.state.activeView != 'WorkgroupView' ? { dataField: 'SubintervalName', text: 'Subinterval', sort: true, headerStyle: { width: 195 } } : { field: '', title: '', hidden: true, headerStyle: { width: 0 } },
                            this.state.activeView != 'WorkgroupView' ? { dataField: 'TaskId', text: 'TaskId', sort: true, headerStyle: { width: 125 } } : { field: '', title: '', hidden: true, headerStyle: { width: 0 } },
                            { dataField: 'PhaseName', text: 'Phase', sort: true, headerStyle: { width: 140 } },
                            this.state.activeView != 'WorkgroupView' ? { dataField: 'OrderVer', text: 'OrderVer', sort: true, headerStyle: { width: 95 } } : { field: '', title: '', hidden: true, headerStyle: { width: 0 } },
                            this.state.activeView != 'WorkgroupView' ? { dataField: 'ServiceOrderUnit', text: 'ServiceOrderUnit', sort: true, headerStyle: { width: 100 } } : { field: '', title: '', hidden: true, headerStyle: { width: 0 } },
                            this.state.activeView != 'WorkgroupView' ? { dataField: 'TaskJeop', text: 'TaskJeop', sort: true, headerStyle: { width: 160 } } : { field: '', title: '', hidden: true, headerStyle: { width: 0 } },
                            {
                                dataField: 'Status', text: 'Status', sort: true, headerStyle: { width: 80 }, headerAlign: 'center', align: 'center',
                                formatter: (cell, row) => (<span className="tbl-dot">
                                    {cell == 'Completed' ? <FontAwesomeIcon icon={faCircle} className="milestone-icon-green" /> : null}
                                    {cell == 'Completed with TargetMissed' ? <FontAwesomeIcon icon={faExclamationCircle} className="milestone-icon-red-green" /> : null}
                                    {cell == 'In_Progress' ? <FontAwesomeIcon icon={faCircle} className="milestone-icon-yellow" /> : null}
                                    {cell == 'Predicted' ? <FontAwesomeIcon icon={faCircle} className="milestone-icon-blue-blink" /> : null}
                                    {cell == 'Risk' ? <FontAwesomeIcon icon={faCircle} className="milestone-icon-red-blink" /> : null}
                                </span>)
                            },
                            { dataField: 'ActualStart_PredictedStart', text: 'ActualStart/ PredictedStart', sort: true, headerStyle: { width: 145 } },
                            { dataField: 'AcutalCompleteDate', text: 'AcutalCompleteDate', sort: true, headerStyle: { width: 165 } },
                            //{ dataField: 'PredictedCompletedate', text: 'PredictedCompletedate', sort: true, headerStyle: { width: 190 }, headerAlign: 'center', align: 'center' },
                            //{ dataField: 'ActualIntl', text: 'ActualIntl', sort: true, headerStyle: { width: 90 }, headerAlign: 'center', align: 'center' },
                            this.state.nidStatus == 'In Progress' ? { dataField: 'PredictedCompletedate', text: 'PredictedCompletedate', sort: true, headerStyle: { width: 190 }, headerAlign: 'center', align: 'center' } : { field: '', title: '', hidden: true, headerStyle: { width: 0 } },
                            this.state.nidStatus == 'In Progress' ? { dataField: 'ActualIntl', text: 'ActualIntl', sort: true, headerStyle: { width: 90 }, headerAlign: 'center', align: 'center' } : { field: '', title: '', hidden: true, headerStyle: { width: 0 } },
                            { dataField: 'PredictedIntl', text: 'PredictedIntl', sort: true, headerStyle: { width: 120 }, headerAlign: 'center', align: 'center' },
                            { dataField: 'TgtIntl', text: 'TgtIntl', sort: true, headerStyle: { width: 100 }, headerAlign: 'center', align: 'center' },
                            this.state.activeView != 'WorkgroupView' ? { dataField: 'ExceededTgt', text: 'ExceededTgt', sort: true, headerStyle: { width: 120 }, headerAlign: 'center', align: 'center' } : { field: '', title: '', hidden: true, headerStyle: { width: 0 } },
                            this.state.activeView != 'WorkgroupView' ?  { dataField: 'Owner', text: 'Owner', sort: true, headerStyle: { width: 150 }, formatter: (cell, row) => {
                                return cell != null ? <Tooltip placement="top" className="modal-tool-tip" title="Open Team">
                                    <span onClick={() => openTeams(row)}><span className="microsoft-team-icon" /> <a className="open-team-chart">{cell}</a></span>
                                    </Tooltip> : <span />}
                            } : { field: '', title: '', hidden: true, headerStyle: { width: 0 } },
                            this.state.activeView != 'WorkgroupView' ? { dataField: 'Department', text: 'DEPT', sort: true, headerStyle: { width: 130 } } : { field: '', title: '', hidden: true, headerStyle: { width: 0 } },
                        ]
                })
            }
            else {
                this.setState({
                    exportLoading: false,
                    treeLoder: false,
                    treeData: [],
                    focusTreeData: [],
                    milestonetreeData: [],
                    tblColumn: [{ text: '' }]
                })
            }
        }
        if (this.props.subMilestoneData != prevProps.subMilestoneData) {
            if (this.props.subMilestoneData != 0) {
                this.setState({
                    isDataFetched: false,
                    subTblData: this.props.subMilestoneData,
                    subTblColumn: [
                        { dataField: 'SubintervalName', text: 'Subinterval', sort: true, headerStyle: { width: 195 } },
                        { dataField: 'TaskId', text: 'TaskId', sort: true, headerStyle: { width: 125 } },
                        { dataField: 'PhaseName', text: 'Phase', sort: true, headerStyle: { width: 140 } },
                        { dataField: 'OrderVer', text: 'OrderVer', sort: true, headerStyle: { width: 95 } },
                        { dataField: 'ServiceOrderUnit', text: 'ServiceOrderUnit', sort: true, headerStyle: { width: 100 } },
                        { dataField: 'TaskJeop', text: 'TaskJeop', sort: true, headerStyle: { width: 160 } },
                        {
                            dataField: 'Status', text: 'Status', sort: true, headerStyle: { width: 80 }, headerAlign: 'center', align: 'center',
                            formatter: (cell, row) => (<span className="tbl-dot">
                                {cell == 'Completed' ? <FontAwesomeIcon icon={faCircle} className="milestone-icon-green" /> : null}
                                {cell == 'Completed with TargetMissed' ? <FontAwesomeIcon icon={faExclamationCircle} className="milestone-icon-red-green" /> : null}
                                {cell == 'In_Progress' ? <FontAwesomeIcon icon={faCircle} className="milestone-icon-yellow" /> : null}
                                {cell == 'Predicted' ? <FontAwesomeIcon icon={faCircle} className="milestone-icon-blue-blink" /> : null}
                                {cell == 'Risk' ? <FontAwesomeIcon icon={faCircle} className="milestone-icon-red-blink" /> : null}
                            </span>)
                        },
                        { dataField: 'ActualStart_PredictedStart', text: 'ActualStart/ PredictedStart', sort: true, headerStyle: { width: 145 } },
                        { dataField: 'AcutalCompleteDate', text: 'AcutalCompleteDate', sort: true, headerStyle: { width: 165 } },
                        this.state.nidStatus == 'In Progress' ? { dataField: 'PredictedCompletedate', text: 'PredictedCompletedate', sort: true, headerStyle: { width: 190 }, headerAlign: 'center', align: 'center' } : { field: '', title: '', hidden: true, headerStyle: { width: 0 } },
                        this.state.nidStatus == 'In Progress' ? { dataField: 'ActualIntl', text: 'ActualIntl', sort: true, headerStyle: { width: 90 }, headerAlign: 'center', align: 'center' } : { field: '', title: '', hidden: true, headerStyle: { width: 0 } },
                        { dataField: 'PredictedIntl', text: 'PredictedIntl', sort: true, headerStyle: { width: 120 }, headerAlign: 'center', align: 'center' },
                        { dataField: 'TgtIntl', text: 'TgtIntl', sort: true, headerStyle: { width: 100 }, headerAlign: 'center', align: 'center' },
                        { dataField: 'ExceededTgt', text: 'ExceededTgt', sort: true, headerStyle: { width: 120 }, headerAlign: 'center', align: 'center' },
                        {
                            dataField: 'Owner', text: 'Owner', sort: true, headerStyle: { width: 150 }, formatter: (cell, row) => {
                                return cell != null ? <Tooltip placement="top" className="modal-tool-tip" title="Open Team">
                                    <span onClick={() => openTeams(row)}><span className="microsoft-team-icon" /> <a className="open-team-chart">{cell}</a></span>
                                </Tooltip> : <span />
                            }
                        },
                        { dataField: 'Department', text: 'DEPT', sort: true, headerStyle: { width: 130 } },
                    ]
                })
            }
            else {
                this.setState({
                    isDataFetched: true,
                    subTblData: []
                })
            }
        } 
    }
    onClickSubView(row) {
        if (this.state.subViewTblModal == true) {
            document.body.classList.remove('freeze-column-milestone-Tbl');
            this.setState({
                subViewTblModal: false
            })
        }
        else {
            document.body.classList.add('freeze-column-milestone-Tbl');
            this.setState({
                subViewTblModal: true,
                subTblLabel: row.PhaseName,
                subTblData: []
            })
            let value = { phaseId: row.PId, OrderId: this.props.orderId }
            this.props.getMilestoneSubView(value)
        }
    }
    toggleMilestoneView(e) {
        this.setState({
            treeLoder: true,
            treeData: [],
            focusTreeData: [],
            milestonetreeData: [],
        })
        if (e.currentTarget.id == "FocusedView") {
            document.body.classList.add('freeze-column-milestone-Tbl');
            this.setState({
                activeTreeView: true,
                activeView: 'FocusedView',
                activeFocus: 'tree-btn-active',
                activeChronological: '',
                activeWorkgroup: '',
            })
            let value = { type: "Chronological", OrderId: this.props.orderId }
            this.props.getMilestoneView(value);
        }
        else if (e.currentTarget.id == "ChronologicalView") {
            document.body.classList.add('freeze-column-milestone-Tbl');
            this.setState({
                activeTreeView: false,
                activeView: 'ChronologicalView',
                activeFocus: '',
                activeChronological: 'tree-btn-active',
                activeWorkgroup: '',
            })
            let value = { type: "Chronological", OrderId: this.props.orderId }
            this.props.getMilestoneView(value);
        }
        else if (e.currentTarget.id == "WorkgroupView") {
            document.body.classList.remove('freeze-column-milestone-Tbl');
            this.setState({
                activeTreeView: true,
                activeView: 'WorkgroupView',
                activeFocus: '',
                activeChronological: '',
                activeWorkgroup: 'tree-btn-active',
            })
            let value = { type: "MilestoneView", OrderId: this.props.orderId }
            this.props.getMilestoneView(value);
        }
    }
    toggleSwitch(e) {
        if (e == true) {
            this.setState({
                activeTreeView: true
            })
        }
        else {
            this.setState({
                activeTreeView: false
            })
        }
    }
    onClickExport() {
        var datas = []
        if (this.state.activeView == "FocusedView") {
            datas = this.state.milestoneTblData
        }
        else {
            datas = this.state.milestonetreeData
        }
        const ws = XLSX.utils.json_to_sheet(datas);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
        FileSaver.saveAs(data, 'MilestoneTableData - ' + this.props.label  + '.csv');
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
            <div>
                <Modal className="milestone-tree-view-modal" width="90%" style={{ top: 30 }} footer={null} title={this.props.label} visible={this.props.openModal} onCancel={this.props.onClose}>
                    <Card className="popup-card">
                        {this.state.orderLoad ?
                            <Row>
                                <Col xs={24} sm={24} md={24} lg={24} xl={24} className="text-center">
                                    <div className="milestone-data-loader"><h6>Loading</h6><BarLoader color={'#123abc'} /></div>
                                </Col>
                            </Row> :
                            <div>
                                {this.state.orderDetailsDD.length != 0 ? <div>
                                    <Row className="popup-card-content">
                                        <Col xs={4} sm={4} md={4} lg={4} xl={4}>
                                            <span>OrderAction: </span>
                                            <div className="con-val-clr">{this.state.orderDetailsDD[0].OrderAction == "" || this.state.orderDetailsDD[0].OrderAction == null ?  '--' : this.state.orderDetailsDD[0].OrderAction}</div>
                                        </Col>
                                        <Col xs={4} sm={4} md={4} lg={4} xl={4}>
                                            <span>ParentOrder: </span>
                                            <div className="con-val-clr">{this.state.orderDetailsDD[0].ParentOrder == "" || this.state.orderDetailsDD[0].ParentOrder == null ? '--' : this.state.orderDetailsDD[0].ParentOrder}</div>
                                        </Col>
                                        <Col xs={4} sm={4} md={4} lg={4} xl={4} >
                                            <span>OrderStatus: </span>
                                            <div className="con-val-clr">{this.state.orderDetailsDD[0].OrderStatus == "" || this.state.orderDetailsDD[0].OrderStatus == null ? '--' : this.state.orderDetailsDD[0].OrderStatus}</div>
                                        </Col>
                                        <Col xs={4} sm={4} md={4} lg={4} xl={4} >
                                            <span>SourceSystem: </span>
                                            <div className="con-val-clr">{this.state.orderDetailsDD[0].SourceSystem == "" || this.state.orderDetailsDD[0].SourceSystem == null ? '--' : this.state.orderDetailsDD[0].SourceSystem}</div>
                                        </Col>
                                        <Col xs={4} sm={4} md={4} lg={4} xl={4} >
                                            <span>OrderVer: </span>
                                            <div className="con-val-clr">{this.state.orderDetailsDD[0].OrderVer == null ? '--' : this.state.orderDetailsDD[0].OrderVer}</div>
                                        </Col>
                                        <Col xs={4} sm={4} md={4} lg={4} xl={4}>
                                            <span>OrderCreateDate: </span>
                                            <div className="con-val-clr">{this.state.orderDetailsDD[0].OrderCreateDate == "" || this.state.orderDetailsDD[0].OrderCreateDate == null ? '--' : moment(this.state.orderDetailsDD[0].OrderCreateDate).format("MM-DD-YYYY")} </div>
                                        </Col>
                                        <Col xs={4} sm={4} md={4} lg={4} xl={4}>
                                            <span>OrderWFStart: </span>
                                            <div className="con-val-clr">{this.state.orderDetailsDD[0].OrderWFStart == "" || this.state.orderDetailsDD[0].OrderWFStart == null ? '--' : moment(this.state.orderDetailsDD[0].OrderWFStart).format("MM-DD-YYYY")}</div>
                                        </Col>
                                        <Col xs={4} sm={4} md={4} lg={4} xl={4}>
                                            <span>DCD/CCD: </span>
                                            <div className="con-val-clr">{this.state.orderDetailsDD[0].DCDorCCD == "" || this.state.orderDetailsDD[0].DCDorCCD == null ? '--' : moment(this.state.orderDetailsDD[0].DCDorCCD).format("MM-DD-YYYY")}</div>
                                        </Col>
                                        <Col xs={4} sm={4} md={4} lg={4} xl={4}>
                                            <span>RDCD/RCCD: </span>
                                            <div className="con-val-clr">{this.state.orderDetailsDD[0].RDCDorRCCD == "" || this.state.orderDetailsDD[0].RDCDorRCCD == null ? '--' : moment(this.state.orderDetailsDD[0].RDCDorRCCD).format("MM-DD-YYYY")}</div>
                                        </Col>
                                        <Col xs={4} sm={4} md={4} lg={4} xl={4}>
                                            <span>FCD: </span>
                                            <div className="con-val-clr">{this.state.orderDetailsDD[0].FCD == "" || this.state.orderDetailsDD[0].FCD == null ? '--' : moment(this.state.orderDetailsDD[0].FCD).format("MM-DD-YYYY")}</div>
                                        </Col>
                                        <Col xs={4} sm={4} md={4} lg={4} xl={4}>
                                            <span>OrderCompleteDate: </span>
                                            <div className="con-val-clr">{this.state.orderDetailsDD[0].OrderCompleteDate == "" || this.state.orderDetailsDD[0].OrderCompleteDate == null ? '--' : moment(this.state.orderDetailsDD[0].OrderCompleteDate).format("MM-DD-YYYY")}</div>
                                        </Col>
                                        <Col xs={4} sm={4} md={4} lg={4} xl={4}>
                                            <span>PredictedCompleteDate: </span>
                                            <div className="con-val-clr">{this.state.orderDetailsDD[0].PredictedCompleteDate == "" || this.state.orderDetailsDD[0].PredictedCompleteDate == null ? '--' : moment(this.state.orderDetailsDD[0].PredictedCompleteDate).format("MM-DD-YYYY")}</div>
                                        </Col>
                                        <Col xs={4} sm={4} md={4} lg={4} xl={4}>
                                            <span>OrderTargetDate: </span>
                                            <div className="con-val-clr">{this.state.orderDetailsDD[0].OrderTargetDate == "" || this.state.orderDetailsDD[0].OrderTargetDate == null ? '--' : moment(this.state.orderDetailsDD[0].OrderTargetDate).format("MM-DD-YYYY")}</div>
                                        </Col>
                                        <Col xs={4} sm={4} md={4} lg={4} xl={4} >
                                            <span>OrderTgt: </span>
                                            <div className="con-val-clr">{this.state.orderDetailsDD[0].PredictedOrderTgt == null ? '--' : this.state.orderDetailsDD[0].PredictedOrderTgt}</div>
                                        </Col>
                                        <Col xs={4} sm={4} md={4} lg={4} xl={4} >
                                            <span>PredictedOrderIntl: </span>
                                            <div className="con-val-clr">{this.state.orderDetailsDD[0].PredictedOrderIntl == null ? '--' : this.state.orderDetailsDD[0].PredictedOrderIntl}</div>
                                        </Col>
                                        <Col xs={4} sm={4} md={4} lg={4} xl={4} >
                                            <span>OrderAging/CT: </span>
                                            <div className="con-val-clr">{this.state.orderDetailsDD[0].CycleTime == null ? '--' : this.state.orderDetailsDD[0].CycleTime}</div>
                                        </Col>
                                        <Col xs={4} sm={4} md={4} lg={4} xl={4} >
                                            <span>ActualYieldStatus: </span>
                                            <div className="con-val-clr">{ this.state.orderDetailsDD[0].ActualYieldMet == null ? '--' : this.state.orderDetailsDD[0].ActualYieldMet}</div>
                                        </Col>
                                        <Col xs={4} sm={4} md={4} lg={4} xl={4} >
                                            <span>PredictedOrderYield: </span>
                                            <div className="con-val-clr">{this.state.orderDetailsDD[0].PredictedYield == null ? '--' : this.state.orderDetailsDD[0].PredictedYield}</div>
                                        </Col>
                                        <Col xs={4} sm={4} md={4} lg={4} xl={4} >
                                            <span>OrderClassType: </span>
                                            <div className="con-val-clr">{this.state.orderDetailsDD[0].OrderClassType == "" || this.state.orderDetailsDD[0].OrderClassType == null ? '--' : this.state.orderDetailsDD[0].OrderClassType}</div>
                                        </Col>
                                        <Col xs={4} sm={4} md={4} lg={4} xl={4} >
                                            <span>BuildGroup: </span>
                                            <div className="con-val-clr">{this.state.orderDetailsDD[0].BuildGroup == "" || this.state.orderDetailsDD[0].BuildGroup == null ? '--' : this.state.orderDetailsDD[0].BuildGroup}</div>
                                        </Col>
                                        {/*<Col xs={4} sm={4} md={4} lg={4} xl={4} >
                                            <span>ProjectId: </span>
                                            <div className="con-val-clr">{this.state.orderDetailsDD[0].ProjectId != "" ? this.state.orderDetailsDD[0].ProjectId : '--'}</div>
                                        </Col>*/}
                                        <Col xs={4} sm={4} md={4} lg={4} xl={4} >
                                            <span>ProjectType: </span>
                                            <div className="con-val-clr">{this.state.orderDetailsDD[0].ProjectType == "" || this.state.orderDetailsDD[0].ProjectType == null ? '--' :this.state.orderDetailsDD[0].ProjectType}</div>
                                        </Col>
                                        <Col xs={4} sm={4} md={4} lg={4} xl={4} >
                                            <span>IMPPOS2: </span>
                                            <div className="con-val-clr">{this.state.orderDetailsDD[0].IMPPOS2 == "" || this.state.orderDetailsDD[0].IMPPOS2 == null ? '--' : this.state.orderDetailsDD[0].IMPPOS2}</div>
                                        </Col>
                                        {/* <Col xs={4} sm={4} md={4} lg={4} xl={4} >
                                            <span>Planner: </span>
                                            <div className="con-val-clr">{this.state.orderDetailsDD[0].Planner == "" || this.state.orderDetailsDD[0].Planner == null ? '--' : this.state.orderDetailsDD[0].Planner}</div>
                                        </Col>
                                        <Col xs={4} sm={4} md={4} lg={4} xl={4} >
                                            <span>Director: </span>
                                            <div className="con-val-clr">{this.state.orderDetailsDD[0].Director == "" || this.state.orderDetailsDD[0].Director == null ? '--' : this.state.orderDetailsDD[0].Director }</div>
                                        </Col>*/}
                                        <Col xs={8} sm={8} md={8} lg={8} xl={8} className="text-right">
                                            {this.state.sourceSystem == "Netbuild" ? 
                                                <Button type="primary" className="netbuild-btn">
                                                    <a href={'http://netbuild/Pages/Revision.aspx?projectId=' + this.state.orderDetailsDD[0].URLProjectID + '&revisionNumber=' + this.state.orderDetailsDD[0].OrderVer} target="_blank">Netbuild</a>
                                                </Button> : null}
                                            {this.state.sourceSystem == "CORE" ?
                                                <Button type="primary" className="netbuild-btn">
                                                    <a className="goto-tbl-link" href={'http://webcore2.qintra.com/excel_viewer.aspx?id=' + this.state.orderDetailsDD[0].OrderId} target="_blank">Core</a>
                                                </Button> : null}
                                        </Col>
                                    </Row>
                                </div>
                                    : <Row>
                                        <Col className="milestone-data-found">
                                            <h6>No data available for this criteria</h6>
                                        </Col>
                                    </Row>}
                            </div>}
                    </Card>
                    <Row>
                        <Col xs={12} sm={12} md={12} lg={12} xl={12} className="mb-2">
                            <Button.Group size="small" className="tree-view-btn-group">
                                <Button hidden={this.state.focusBtnDisable} className={this.state.activeFocus} id="FocusedView" type="primary" onClick={this.toggleMilestoneView}>Focused/NBA View</Button>
                                <Button className={this.state.activeChronological} id="ChronologicalView" type="primary" onClick={this.toggleMilestoneView}>Chronological View</Button>
                                <Button className={this.state.activeWorkgroup} id="WorkgroupView" type="primary" onClick={this.toggleMilestoneView}>Workgroup View</Button>
                            </Button.Group> 
                        </Col>
                        <Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-right">
                            View : <Switch className="milestone-switch" checked={this.state.activeTreeView} onChange={this.toggleSwitch.bind(this)} onClick={this.toggleSwitch.bind(this)} checkedChildren="Timeline" unCheckedChildren="Grid" />
                        </Col>
                    </Row>
                    {this.state.activeTreeView ?
                        <Row>
                            <div className="milestone-legend">
                                <div><FontAwesomeIcon icon={faCircle} className="milestone-icon-green" />  - Completed </div>
                                <div><FontAwesomeIcon icon={faExclamationCircle} className="milestone-icon-red-green" />  - Completed with TargetMissed </div>
                                <div><FontAwesomeIcon icon={faCircle} className="milestone-icon-red" />  - Risk </div>
                                <div><FontAwesomeIcon icon={faCircle} className="milestone-icon-yellow" />  - In-Progress </div>
                                <div><FontAwesomeIcon icon={faCircle} className="milestone-icon-blue" />  - Predicted </div>
                            </div>
                        </Row> : <Row className="justi">
                            <Col xs={12} sm={12} md={12} lg={4} xl={4}>
                                <Button className="export-btn mb-0" type="primary" onClick={this.onClickExport}>Export</Button>
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={20} xl={20} className="text-right">
                                <div>
                                    <span><FontAwesomeIcon icon={faCircle} className="milestone-icon-green" />  - Completed </span>
                                    <span><FontAwesomeIcon icon={faExclamationCircle} className="milestone-icon-red-green" />  - Completed with TargetMissed </span>
                                    <span><FontAwesomeIcon icon={faCircle} className="milestone-icon-red" />  - Risk </span>
                                    <span><FontAwesomeIcon icon={faCircle} className="milestone-icon-yellow" />  - In-Progress </span>
                                    <span><FontAwesomeIcon icon={faCircle} className="milestone-icon-blue" />  - Predicted </span>
                                </div>
                            </Col>
                        </Row>}
                    {this.state.activeTreeView ?
                        <div className="milestone-tree-view">
                            {this.state.treeLoder ? <div className="milestone-timeline-loader"><h6>Loading</h6><BarLoader color={'#123abc'} /></div> :
                            this.state.activeView == 'FocusedView' ? <VerticalTimeline>{this.state.focusTreeData}</VerticalTimeline> : <VerticalTimeline>{this.state.treeData}</VerticalTimeline>}
                        </div> :
                        <div className="freeze-milestone-tbl">
                            <ToolkitProvider keyField="id" data={this.state.activeView == 'FocusedView' ? this.state.milestoneTblData : this.state.milestonetreeData} columns={this.state.tblColumn} exportCSV search>
                                {
                                    props => (
                                        <div>
                                            <div className="table-overflow chrono">
                                                <BootstrapTable {...props.baseProps} noDataIndication={() => this.tblLoader()} />
                                            </div>
                                        </div>
                                    )
                                }
                            </ToolkitProvider>
                        </div>}
                </Modal>
                <Modal width="95%" style={{ top: 50 }} footer={null} title={this.state.subTblLabel} visible={this.state.subViewTblModal} onCancel={this.onClickSubView}>
                    <div className="freeze-milestone-tbl">
                        <ToolkitProvider keyField="id" data={this.state.subTblData} columns={this.state.subTblColumn} exportCSV search>
                            {
                                props => (
                                    <div>
                                        <div className="table-overflow chrono">
                                            <BootstrapTable {...props.baseProps} noDataIndication={() => this.tblLoader()} />
                                        </div>
                                    </div>
                                )
                            }
                        </ToolkitProvider>
                    </div>
                </Modal>
            </div>
        );
    }
}

function mapState(state) {
    return {
        orderDetailsDD: state.getOrderDetails,
        milestonetreeData: state.getMilestoneView,
        subMilestoneData: state.getMilestoneSubView,
    };
}

export default (connect(mapState, { getOrderDetails, getMilestoneView, getMilestoneSubView })(MilestoneTreeView));
