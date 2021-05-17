import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout, Row, Col, Card, Modal, Button, Tooltip, message, Select, Input } from 'antd';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import BarLoader from "react-spinners/BarLoader";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import {
    globalLoader, getUserDetailsForSettings, updateUserDetailsforSettings, getQueuesDetailsforSettings, getUserDetailsbySearchValue,
    getSubintervalsList
} from '../services/action';

const { SearchBar } = Search;
const key = 'updatable';

class UserSetting extends Component {
    constructor(props) {
        super(props);
        this.onChangeDirectorList = this.onChangeDirectorList.bind(this);
        
        this.state = {
            enableClick: '',
            column: [{ text: '' },],
            tblData: [],
            openModal: false,
            selectedDirectorName: 'Select a person',
            dirctorList: [],
            subintervalList: [],
            subColumn: [{ dataField: 'PhaseName', text: 'PhaseName' }, { dataField: 'SubIntervalName', text: 'SubintervalName' },],
            subTblData: [],
            openSubModal: false,
            isDataFetched: false,
            vmgModal: false,
            vmgSelect: 'None',
            vmgList: [<Option value="YES">YES</Option>,
                <Option value="NO">NO</Option>]
        };
    }

    componentDidMount() {
        if (this.props.showTbl == "user") {
            this.setState({
                column: [
                    {
                        text: "", headerStyle: { width: 35 }, formatter: (cell, row) => (
                            <Tooltip placement="top" title="Edit">
                                <FontAwesomeIcon className="edit-icon" icon={faEdit} onClick={(e) => this.onClickEdit(row)} />
                            </Tooltip>
                        )
                    },
                    { dataField: 'UserName', text: 'UserName' },
                    { dataField: 'AppRoleName', text: 'AppRole' },
                ],
            })
        }
        else if (this.props.showTbl == "phase") {
            this.setState({
                column: [
                    {
                        text: "", headerStyle: { width: 35 }, formatter: (cell, row) => (
                            <Tooltip placement="top" title="Edit">
                                <FontAwesomeIcon className="edit-icon" icon={faEdit} onClick={(e) => this.onClickSubintervalEdit(row)} />
                            </Tooltip>
                        )
                    },
                    { dataField: 'SubIntervalName', text: 'SubintervalName', headerStyle: { width: 160 } },
                    { dataField: 'SourceSystem', text: 'System', headerStyle: { width: 100 } },
                    { dataField: 'PhaseName', text: 'PhaseName', headerStyle: { width: 120 } },
                ],
            })
        }
        else if (this.props.showTbl == "vmg") {
            this.setState({
                column: [
                    {
                        text: "", headerStyle: { width: 35 }, formatter: (cell, row) => (
                            <Tooltip placement="top" title="Edit">
                                <FontAwesomeIcon className="edit-icon" id={row.IMPPOS2} icon={faEdit} onClick={(e) => this.onClickIMPPOSEdit(row)} />
                            </Tooltip>
                        )
                    },
                    { dataField: 'IMPPOS2', text: 'IMPPOS2', headerStyle: { width: 160 } },
                    { dataField: 'VMG', text: 'VMG', headerStyle: { width: 100 } },
                ],
            })
        }
        else {
            this.setState({
                column: [
                    {
                        text: "", headerStyle: { width: 35 }, formatter: (cell, row) => (
                            <Tooltip placement="top" title="Edit">
                                <FontAwesomeIcon className="edit-icon" icon={faEdit} onClick={(e) => this.onClickEdit(row)} />
                            </Tooltip>
                        )
                    },
                    { dataField: 'OwnerorQueueName', text: 'QueueName' },
                    { dataField: 'ManagerName', text: 'ManagerName' },
                ],
            })
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.userData != prevProps.userData) {
            if (this.props.userData != 0) {
                this.setState({ tblData: this.props.userData, isDataFetched: true, })
            }
            else {
                this.setState({
                    isDataFetched: true,
                    tblData: []
                })
            }
        }
        if (this.props.subTblData != prevProps.subTblData) {
            if (this.props.subTblData != 0) {
                this.setState({ subTblData: this.props.subTblData })
            }
            else {
                this.setState({
                    isDataFetched: true,
                    subTblData: []
                })
            }
        }
        if (this.props.updateUserData != prevProps.updateUserData) {
            if (this.props.updateUserData.payload.data == 'true') {
                this.props.getUserDetailsForSettings(this.props.showTbl);
                this.setState({
                    openModal: false,
                    openSubModal: false,
                    isDataFetched: false,
                    tblData: [],
                    selectedDirectorName: 'Select a person',
                    dirctorList: []
                })
                message.success({ content: 'Updated Successfully', key, duration: 2 })
            }
            else {
                this.setState({
                    openModal: false,
                    selectedDirectorName: 'Select a person',
                    dirctorList: []
                })
                message.error({ content: 'Updated Error', key, duration: 2 })
            }
        }
        if (this.props.managerList != prevProps.managerList) {
            var values = [];
            this.props.managerList.map((val, ind) => {
                values.push(<Option value={val.ManagerCuid}>{val.ManagerName}</Option>)
            })
            this.setState({
                dirctorList: values
            })
        }
        if (this.props.subintervalList != prevProps.subintervalList) {
            var values = [];
            this.props.subintervalList.map((val, ind) => {
                values.push(<Option value={val.PID}>{val.PhaseName}</Option>)
            })
            this.setState({
                subintervalList: values
            })
        }
    }

    onClickEdit(row) {
        if (this.state.openModal == true) {
            this.setState({
                openModal: false,
                sendQueue: '',
                selectedDirectorName: 'Select a person',
                dirctorList: []
            })
        }
        else {
            if (this.props.showTbl == 'user') {
                this.setState({
                    label: "Update Role"
                })
            }
            else if (this.props.showTbl == 'phase') {
                this.setState({
                    label: "Phase Mapping",
                    sendPhaseId: row.PID
                })
            }
            else {
                this.setState({
                    label: "Update Manager"
                })
            }
            this.setState({
                openModal: true,
                userName: row.UserName,
                sendCUID: row.UserNt,
                sendQueue: row.OwnerorQueueName,
                selectedDirectorName: row.AppRoleName
            })
        }
    }

    onSearchDirectorList(value) {
        if (value != "") {
            if (value.length > 3) {
                this.props.getUserDetailsbySearchValue(value);
            }
        }
    }

    onChangeDirectorList(e, value) {
        if (this.props.showTbl == 'user') {
            this.setState({
                disableBtn: false,
                selectedDirectorName: e,
                sendManagerName: e
            })
        }
        else {
            if (value != undefined) {
                this.setState({
                    disableBtn: false,
                    selectedDirectorName: e,
                    sendCUID: e,
                    sendManagerName: value.children.split(' - ')[0]
                })
            }
            else {
                this.setState({
                    disableBtn: false,
                    selectedDirectorName: 'Select a person',
                    sendCUID: "",
                    sendManagerName: ""
                })
            }
        }
    }

    onClickSubintervalEdit(row, callName) {
        if (this.state.openSubModal == true) {
            //this.props.getUserDetailsForSettings(this.props.showTbl, "All");
            this.setState({
                openSubModal: false,
                //isDataFetched: false,
                //tblData:[]
            })
        }
        else {
            if (callName == "Add Phase") {
                this.setState({
                    label: "Add Phase",
                    showInput: true,

                })
            }
            else {
                this.setState({
                    label: "Phase Mapping",
                    showInput: false
                })
            }
            this.setState({
                sendSubId: row.SubIntID,
                CurrentPhase: row.pid,
                openSubModal: true,
                subTblData: [],
                isDataFetched: false
            })
            this.props.getSubintervalsList();
        }
    }

    onChangeSubinterval(e, value) {
        this.setState({
            sendPhaseId: e,
            selectedPhase: value.children
        })
    }

    onChangeAddPhase(e, value) {
        this.setState({
            phaseName: e.target.value
        })
    }


    onChangeVMG(e, value) {
        this.setState({
            vmgSelect: e
        })
    }    

    onClickSaveBtn(e) {
        message.loading({ content: 'Action in progress..', key })
        let value = {}
        if (this.state.showInput == true) {
            value = {
                subintId: "ALL", phaseId: "ALL", phaseName: this.state.phaseName, CurrentPhase: "ALL"
            }
        }
        else {
            value = {
                queue: this.state.sendQueue, cuid: this.state.sendCUID, managerName: this.state.sendManagerName, subintId: this.state.sendSubId,
                phaseId: this.state.sendPhaseId, phaseName: this.state.selectedPhase, CurrentPhase: this.state.CurrentPhase,
                VMG: this.state.vmgSelect, IMPPOS2: this.state.IMPPOS2
            }
        }
        this.props.updateUserDetailsforSettings(value, this.props.showTbl)
    }

    onClickIMPPOSEdit(e) {
        if (this.state.vmgModal == true) {
            this.setState({
                vmgModal: false
            })
        }
        else {
            this.setState({
                vmgModal: true,
                label: "Update VMG",
                IMPPOS2: e.IMPPOS2
            })
        }
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
            <Modal width="40%" style={{ top: 50 }} footer={null} title={this.props.label}
                visible={this.props.openModal} onCancel={this.props.onClose}>
                <div className="tbl-height">
                    <ToolkitProvider keyField="id" data={this.state.tblData} columns={this.state.column} search striped pagination={paginationFactory()}>
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
                                            {this.props.showTbl == 'phase' ? <Button type="primary" onClick={(e) => this.onClickSubintervalEdit(e, "Add Phase")}>Add New Phase</Button> : null}
                                        </Col>
                                        <Col xs={24} sm={24} md={24} lg={12} xl={12} className="text-right">
                                            <SearchBar {...props.searchProps} />
                                        </Col>
                                    </Row>
                                    <BootstrapTable {...props.baseProps} noDataIndication={() => this.tblLoader()} />
                                </div>
                            )
                        }
                    </ToolkitProvider>
                </div>
                <Modal width="30%" footer={null} title={this.state.label} visible={this.state.openModal} onCancel={this.onClickEdit.bind(this)}>
                    {this.props.showTbl == 'user' ? <div>
                        <Row>
                            <Col xs={24} sm={24} md={12} lg={15} xl={15}>
                                <div>UserName: </div>
                                <div>{this.state.userName} </div>
                            </Col>
                            <Col xs={24} sm={24} md={12} lg={9} xl={9}>
                                <div>Role: </div>
                                <Select style={{ width: '100%' }} placeholder="Select a Role" value={this.state.selectedDirectorName}
                                    onChange={this.onChangeDirectorList.bind(this)}>
                                    <Option value={1}>Super Admin</Option>
                                    <Option value={2}>Admin</Option>
                                    <Option value={3}>Read Only</Option>
                                </Select>
                            </Col>
                        </Row>
                    </div> : <div>
                            <div>Manager: </div>
                            <Select allowClear={true} showSearch style={{ width: '100%' }} placeholder="Select a person"
                                optionFilterProp="children" value={this.state.selectedDirectorName} onSearch={this.onSearchDirectorList.bind(this)}
                                onChange={this.onChangeDirectorList.bind(this)}
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                {this.state.dirctorList}
                            </Select>
                            <span className="drop-note">Note: Type minimum 4 letter</span>
                        </div>}
                    <div className="text-right">
                        <Button className="mt-3" type="primary" onClick={this.onClickSaveBtn.bind(this)}>Save</Button>
                    </div>
                </Modal>
                <Modal style={{ top: 100 }} width="25%" footer={null} title={this.state.label} visible={this.state.openSubModal} onCancel={this.onClickSubintervalEdit.bind(this)}>
                    {this.state.showInput ? <div>
                        <div>PhaseName: </div>
                        <Input placeholder="Type a PhaseName" onChange={this.onChangeAddPhase.bind(this)}/>
                    </div> : <div>
                            <div>PhaseName: </div>
                            <Select allowClear={true} showSearch style={{ width: '100%' }} placeholder="Select a PhaseName"
                                optionFilterProp="children" value={this.state.selectedPhase} onChange={this.onChangeSubinterval.bind(this)}
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                {this.state.subintervalList}
                            </Select>
                        </div>}
                    <div className="text-right">
                        <Button className="mt-2" type="primary" onClick={this.onClickSaveBtn.bind(this)}>Save</Button>
                    </div>
                </Modal>
                <Modal style={{ top: 100 }} width="35%" footer={null} title={this.state.label} visible={this.state.vmgModal} onCancel={this.onClickIMPPOSEdit.bind(this)}>
                    <Row>
                        <Col xs={24} sm={24} md={12} lg={15} xl={15}>
                            IMPPOS2:
                        <div>{this.state.IMPPOS2}</div>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={9} xl={9}>
                            VMG:
                            <Select style={{ width: '100%' }} value={this.state.vmgSelect} onChange={this.onChangeVMG.bind(this)}>
                                {this.state.vmgList}
                            </Select>
                        </Col>
                    </Row>
                    <div className="text-right">
                        <Button className="mt-2" type="primary" onClick={this.onClickSaveBtn.bind(this)}>Save</Button>
                    </div>
                </Modal>
            </Modal>
        );
    }
}

function mapState(state) {
    return {
        loderCheck: state.globalLoader,
        userData: state.getUserDetailsForSettings,
        updateUserData: state.updateUserDetailsforSettings,
        queuesData: state.getQueuesDetailsforSettings,
        managerList: state.getUserDetailsbySearchValue,
        subintervalList: state.getSubintervalsList
    };
}

export default (connect(mapState, {
    globalLoader, getUserDetailsForSettings, updateUserDetailsforSettings, getQueuesDetailsforSettings, getUserDetailsbySearchValue,
    getSubintervalsList
})(UserSetting));