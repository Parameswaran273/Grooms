import React, { Component } from 'react';
import { connect } from 'react-redux';

import moment from 'moment';
import BarLoader from "react-spinners/BarLoader";
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import filterFactory from 'react-bootstrap-table2-filter';
import { Row, Col, Modal, Menu, Button, DatePicker, Dropdown, Tooltip } from 'antd';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faStream } from '@fortawesome/free-solid-svg-icons';

import { clearCallback, getGlobalRemoteTblData, getGlobalRemoteTblExport, getClearCallback, getMilestoneView, getOrderDetails } from '../../services/action';
import { dynamicColumn } from '../DynamicColumnRemote';
import TreeView from './MilestoneTreeView';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const { SearchBar } = Search;

class GlobalTblRemote extends Component {
    constructor(props) {
        super(props);
        document.body.classList.add('freeze-column');
        this.onClickMilestoneView = this.onClickMilestoneView.bind(this);
        this.handleTableChange = this.handleTableChange.bind(this)
        this.onClickExport = this.onClickExport.bind(this)
        this.onClickClearBtn = this.onClickClearBtn.bind(this)
        this.state = {
            column: [{ text: '', align: 'center' }],
            tblData: [],
            exportLoading: false,
            clearBtnDisable: true,
            isDataFetched: false,
            page: 1,
            sizePerPage: 10,
            totalSize: 0,
            functionType: 'All',
            filtervalues: 'All',
            filterType: 'All',
            type: "ALL",
            searchList: [],
            tblHidden: false,
        };
    }

    componentDidMount() {
        if (this.props.globalTbl == true) {
            if (this.props.callName == 'PhaseYieldTarget') {
                document.body.classList.remove('freeze-column');
            }
            this.setState({
                tblHidden: true,
            })
        }
        this.setState({
            tblData: [],
            isDataFetched: false,
            sorting: this.props.sort
        })
    }

    UNSAFE_componentWillUpdate(nextProps) {
        if (this.props.exportedData != nextProps.exportedData) {
            if (nextProps.exportedData != 0) {
                saveAs(nextProps.exportedData, this.props.label + '.csv');
                this.setState({
                    exportLoading: false
                })
                //if (this.state.exportFile == 'CSV') {
                //    const ws = XLSX.utils.json_to_sheet(nextProps.exportedData);
                //    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
                //    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
                //    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
                //    FileSaver.saveAs(data, this.props.label + '.csv');
                //}
                //else {
                //    const ws = XLSX.utils.json_to_sheet(nextProps.exportedData);
                //    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
                //    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
                //    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
                //    FileSaver.saveAs(data, this.props.label + '.xlsx');
                //}
            }
        }
        if (this.props.globalTblData != nextProps.globalTblData) {
            if (this.props.globalTbl == true) {
                if (nextProps.globalTblData != 0) {
                    var values = [];
                    if (this.props.callName == 'GlobalSearch' ) {
                        values.push({
                            text: "Action", headerStyle: { width: 70 }, csvExport: false, formatter: (cell, row, rowIndex, extraData) => (
                                <div>
                                    <Tooltip placement="top" title="Milestone">
                                        <Button size="small" type="primary" className="mr-1 milestone-btn-tbl" onClick={(e) => this.onClickMilestoneView(row)}><FontAwesomeIcon icon={faStream} /></Button>
                                    </Tooltip>
                                </div>
                            )
                        });
                    }
                    var getColums = dynamicColumn(nextProps.globalTblData[0], 'GlobalTbl')
                    getColums.map((val, ind4) => {
                        values.push(val);
                    });
                    this.setState({
                        column: values,
                        tblData: nextProps.globalTblData,
                    });
                }
                else {
                    this.setState({
                        tblData: [],
                        isDataFetched: true
                    });
                }
            }
            else {
                if (nextProps.globalTblData.Table1 != 0) {
                    var values = [];
                    values.push({
                        text: "Action", headerStyle: { width: 70 }, csvExport: false, formatter: (cell, row, rowIndex, extraData) => (
                            <div>
                                <Tooltip placement="top" title="Milestone">
                                    <Button size="small" type="primary" className="mr-1 milestone-btn-tbl" onClick={(e) => this.onClickMilestoneView(row)}><FontAwesomeIcon icon={faStream} /></Button>
                                </Tooltip>
                            </div>
                        )
                    });
                    var getColums = dynamicColumn(nextProps.globalTblData.Table1[0])
                    getColums.map((val, ind4) => {
                        values.push(val);
                    });
                    this.setState({
                        column: values,
                        tblData: nextProps.globalTblData.Table1,
                        totalSize: nextProps.globalTblData.Table[0].FilterCount,
                        clearBtnDisable: false,
                    });
                }
                else {
                    this.setState({
                        tblData: [],
                        isDataFetched: true,
                        totalSize: 0,
                        clearBtnDisable: true,
                    });
                }
            }
        }
        if (this.props.clearFilter != nextProps.clearFilter) {
            if (nextProps.clearFilter != 0) {
                this.setState({
                    isDataFetched: false,
                    btnDisabled: false,
                    tblData: [],
                    page: 1,
                    filtervalues: "all",
                })
                var searchList = [];
                if (nextProps.clearFilter[0].value == 'clear') {
                    searchList = this.removeDuplicates(this.state.searchList, "column");
                    var ind = searchList.findIndex(function (element) {
                        return element.column === nextProps.clearFilter[0].column.dataField;
                    })
                    if (ind !== -1) {
                        searchList.splice(ind, 1)
                    }
                }
                else {
                    nextProps.clearFilter.map((val, ind5) => {
                        this.state.searchList.push({ column: val.column.dataField, value: val.value });
                    })
                    searchList = this.removeDuplicates(this.state.searchList, "column");
                }

                if (searchList.length != 0) {
                    let filtervalues = ''
                    searchList.map((val, ind6) => {
                        //if (filtervalues == '') {
                        //    filtervalues = ".has('" + val.column + "',TextP.Containing('" + val.value + "'))"
                        //}
                        //else {
                        //    filtervalues = filtervalues + ".has('" + val.column + "',TextP.Containing('" + val.value + "'))"
                        //}
                        if (filtervalues == '') {
                            filtervalues = val.column + " like '$" + val.value + "$'"
                        }
                        else {
                            filtervalues = filtervalues + ' ,and, ' + val.column + " like '$" + val.value + "$'"
                        }
                    })
                    this.setState({
                        functionType: 'filter',
                        filtervalues: filtervalues,
                    })
                    var filterValue = {
                        type: this.props.type, date: this.props.date, cuid: this.props.cuid, phaseName: this.props.phaseName, subinterval: this.props.subinterval,
                        skipRow: 1, fetchRow: this.state.sizePerPage, sort: this.state.sorting, filterType: 'filter', searchValue: filtervalues
                    }
                    this.props.getGlobalRemoteTblData(filterValue, this.props.callName);
                }
                else {
                    this.onClickClearBtn();
                }
            }
        }
    }
    removeDuplicates(originalArray, prop) {
        var newArray = [];
        var lookupObject = {};
        for (var i in originalArray) {
            lookupObject[originalArray[i][prop]] = originalArray[i];
        }
        for (i in lookupObject) {
            newArray.push(lookupObject[i]);
        }
        this.setState({
            searchList: newArray
        })
        return newArray;
    }

    handleTableChange(type, { page, sizePerPage, filters, sortField, sortOrder, cellEdit }) {
        let sorting = '';
        let functionType = '';
        if (sortField != null) {
            if (sortField == 'PoNRFlag?') {
                sortField = '[PoNRFlag?]'
            }
            sorting = sortField + ' ' + sortOrder;
            if (this.state.functionType == 'filter') {
                functionType = 'filter'
            }
            else {
                functionType = 'sort'
            }
        }
        else {
            sorting = this.props.sort;
            if (this.state.functionType == 'filter') {
                functionType = 'filter'
            }
            else {
                functionType = 'all'
            }
        }
        if (page == 0) {
            page = 1
        }
        this.setState({
            page: page,
            sizePerPage: sizePerPage,
            sorting: sorting,
            isDataFetched: false,
            tblData: []
        })
        var value = {
            type: this.props.type, date: this.props.date, cuid: this.props.cuid, phaseName: this.props.phaseName, subinterval: this.props.subinterval,
            skipRow: page, fetchRow: sizePerPage, filterType: functionType, searchValue: this.state.filtervalues, sort: sorting
        }
        this.props.getGlobalRemoteTblData(value, this.props.callName)
    }
    clearFilter() {
        this.setState({
            isDataFetched: false,
            btnDisabled: true,
            initialColumn: false,
            tblData: [],
            page: 1,
            functionType: 'all',
            filtervalues: 'all',
            searchList: []
        })
        let sort = this.props.sort;
        var values = {
            type: this.props.type, date: this.props.date, cuid: this.props.cuid, phaseName: this.props.phaseName, subinterval: this.props.subinterval,
            skipRow: 1, fetchRow: 10, filterType: this.state.filterType, searchValue: this.state.filtervalues, sort: this.state.sorting
        }
        this.props.getGlobalRemoteTblData(values, this.props.callName );
        values = [];
        this.props.getClearCallback(values);
    }
    onClickExport(e) {
        this.setState({
            //exportFile: e.key,
            exportFile: 'CSV',
            exportLoading: true,
        })
        if (this.props.callName == 'GlobalSearch' || this.props.callName == 'PhaseYieldTarget') {
            const ws = XLSX.utils.json_to_sheet(this.state.tblData);
            const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
            const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
            const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
            FileSaver.saveAs(data, this.props.label + '.csv');
            this.setState({
                exportLoading: false,
            })
        }
        else {
            var value = {
                type: this.props.type, date: this.props.date, cuid: this.props.cuid, phaseName: this.props.phaseName, subinterval: this.props.subinterval,
                skipRow: this.state.page, fetchRow: this.state.sizePerPage, filterType: this.state.functionType, searchValue: this.state.filtervalues, sort: this.state.sorting
            }
            this.props.getGlobalRemoteTblExport(value, this.props.callName)
        }
        
        
    }
    onClickClearBtn(e) {
        this.setState({
            isDataFetched: false,
            tblData: [],
            page: 1,
            functionType: 'All',
            filtervalues: 'All',
            searchList: [],
        })
        var values = {
            type: this.props.type, date: this.props.date, cuid: this.props.cuid, phaseName: this.props.phaseName, subinterval: this.props.subinterval,
            skipRow: 1, fetchRow: 10, filterType: 'All', searchValue: 'All', sort: this.props.sort
        }
        this.props.getGlobalRemoteTblData(values, this.props.callName);
        values = [];
        this.props.clearCallback(values);
    }
    onClickMilestoneView(e) {
        this.props.getOrderDetails(e.OrderId)
        let label = e.OrderId;
        this.setState({
            treeview: <TreeView orderId={e.OrderId} openModal={true} label={label} onClose={this.handleCloseModal.bind(this)} />
        })
    }
    handleCloseModal() {
        this.setState({
            treeview: []
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
        const fromDate = moment(sessionStorage.getItem('From_Date'), 'MM-DD-YYYY');
        const toDate = moment(sessionStorage.getItem('To_Date'), 'MM-DD-YYYY');
        const customTotal = (from, to, size) => (
            <span className="react-bootstrap-table-pagination-total">
                Showing {from} to {to} of {size} Results
            </span>
        );
        const options = {
            showTotal: true,
            paginationTotalRenderer: customTotal,
            page: this.state.page,
            sizePerPage: this.state.sizePerPage,
            totalSize: this.state.totalSize
        };
        const menu = (
            <Menu onClick={this.onClickExport}>
                <Menu.Item className="drop" key="CSV"><i className="fas fa-file-csv" /> CSV</Menu.Item>
                <Menu.Item className="drop" key="Excel"><i className="fas fa-file-excel" /> EXCEL</Menu.Item>
            </Menu>
        );
        return (
            <div>
                <Modal width="95%" style={{ top: 50 }} footer={null} title={this.props.label} visible={this.props.openM} onCancel={this.props.onClose}>
                    {this.state.tblData.length != 0 ? null : <Row>
                        <Col className="remote-table-load">
                            {this.state.isDataFetched ? <div className="tbl-no-data-found"><div>No data available for this criteria</div></div> :
                                <div className="tbl-loading"><h6>Loading</h6><BarLoader color={'#123abc'} /></div>}
                        </Col>
                    </Row>}
                    <Row hidden={this.state.tblHidden}>
                        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                            <Button className="export-btn" type="primary" disabled={this.state.clearBtnDisable} loading={this.state.exportLoading} onClick={this.onClickExport}>Export</Button>
                            {/*<span>
                                <Button disabled={this.state.exptBtnDisable} className="remote-tbl-export" type="primary">Export</Button>
                            </span>
                            <span>
                                <Dropdown disabled={this.state.exptBtnDisable} overlay={menu} placement="bottomRight">
                                    <Button className="remote-tbl-export-down" type="primary" loading={this.state.exportLoading}>
                                        {this.state.exportLoading ? null : <FontAwesomeIcon icon={faAngleDown} />}
                                    </Button>
                                </Dropdown>
                            </span>*/}
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={12} xl={12} className="text-right">
                            <Button className="remote-tbl-clear-btn" type="primary" disabled={this.state.clearBtnDisable} onClick={this.onClickClearBtn}>Clear Filter</Button>
                        </Col>
                    </Row>
                    <div className="global-tbl-height">
                        {this.state.tblHidden ? <ToolkitProvider keyField="id" data={this.state.tblData} columns={this.state.column} search striped pagination={paginationFactory()}>
                                {
                                    props => (
                                        <div>
                                            {this.props.callName == 'PhaseYieldTarget' ? <ul>
                                                <li>Orders that have open tasks, within the present phase with Actual Aging and ML Yield Target at different Order Configuration.
                                                    <ul style={{ listStyleType: "circle" }}>
                                                        <li>Note:
                                                            <ul style={{ listStyleType: "square" }}>
                                                                <li>Order Configuration: SourceSystem | OrderClassType | IMPPOS2 | is3rdPartyColoneeded | ProjectType | CreatorGroup | CategoryCD | OrderType</li>
                                                            </ul>
                                                        </li>
                                                    </ul>
                                                </li>
                                            </ul> : null}
                                            <Row>
                                                <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                                                    <Button className="export-btn" type="primary" loading={this.state.exportLoading} onClick={this.onClickExport}>Export</Button>
                                                </Col>
                                                <Col xs={24} sm={24} md={24} lg={12} xl={12} className="text-right">
                                                    <SearchBar {...props.searchProps} />
                                                </Col>
                                            </Row>
                                            <BootstrapTable {...props.baseProps} pagination={paginationFactory()} />
                                        </div>
                                    )
                                }
                            </ToolkitProvider> : <BootstrapTable remote keyField="id" data={this.state.tblData} columns={this.state.column} bordered={false} striped
                            pagination={paginationFactory(options)} filterPosition="top" filter={filterFactory()}
                            onTableChange={this.handleTableChange} />}
                        
                    </div>
                </Modal>

                {this.state.treeview}
            </div>
        );
    }
}

function mapState(state) {
    return {
        globalTblData: state.getGlobalRemoteTblData,
        exportedData: state.getGlobalRemoteTblExport,
        clearFilter: state.getClearCallback,
    };
}

export default (connect(mapState, { clearCallback, getGlobalRemoteTblData, getGlobalRemoteTblExport, getClearCallback, getMilestoneView, getOrderDetails })(GlobalTblRemote));
