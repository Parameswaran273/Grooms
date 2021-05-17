import React from 'react';
import { connect } from 'react-redux';

import moment from 'moment';
import { Row, Col, Drawer, DatePicker, Checkbox, Button, Badge, Select } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

import { globalLoader, getDashChange, getDirectorList, getUserDetailsForSettings } from '../services/action';

const { RangePicker } = DatePicker;

class SubHeader extends React.Component {
    constructor(props) {
        super(props);
        this.handleDrawer = this.handleDrawer.bind(this);
        this.onCheckAllChange = this.onCheckAllChange.bind(this);
        this.onChangeCheckBox = this.onChangeCheckBox.bind(this);
        this.onChangeDatePicker = this.onChangeDatePicker.bind(this);
        this.onClickApplyBtn = this.onClickApplyBtn.bind(this);
        this.onChangeDirectorList = this.onChangeDirectorList.bind(this);
        
        this.state = {
            view: sessionStorage.getItem('dashView'),
            fromDate: moment(moment(new Date(), 'MM-DD-YYYY').subtract(1, 'M').format('MM-DD-YYYY'), 'MM-DD-YYYY'),
            toDate: moment(moment(new Date(), 'MM-DD-YYYY').subtract(0, 'days').format('MM-DD-YYYY'), 'MM-DD-YYYY'),
            collapsed: false,
            sourceCheckAll: true,
            sourceList: 'All',
            imppos2CheckAll: true,
            imppos2List: 'All',
            show: false,
            disableBtn: true,
            selectedDirectorName: 'Select a person',
            dirctorList: [<Option value="Glenn Connaughton">Glenn Connaughton</Option>,
                <Option value="Justin Painter">Justin Painter</Option>,
                <Option value="Todd Vincent">Todd Vincent</Option>,
                <Option value="Daniel Wilson">Daniel Wilson</Option>,
                <Option value="Andrew Jackson">Andrew Jackson</Option>,
                <Option value="Erin Deardorff">Erin Deardorff</Option>,
                <Option value="Angela Faler">Angela Faler</Option>,
                <Option value="Alexander Talavera">Alexander Talavera</Option>,
                <Option value="Racheal Otwell">Racheal Otwell</Option>,
                <Option value="Michelle Larue">Michelle Larue</Option>,
                <Option value="Timothy Doolittle">Timothy Doolittle</Option>,
            ],
            selectedVMG: 'All',
            vmgList: [<Option value="All">All</Option>,
            <Option value="Yes">Yes</Option>,
            <Option value="No">No</Option>],
        };
    }

    componentDidMount() {
        this.props.getUserDetailsForSettings('vmg');
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.dashChange != prevProps.dashChange) {
            if (this.props.dashChange.result == true) {
                sessionStorage.setItem('GblStartDate', moment(new Date(), 'MM-DD-YYYY').subtract(1, 'M').format('MM-DD-YYYY'));
                sessionStorage.setItem('GblEndDate', moment(new Date(), 'MM-DD-YYYY').subtract(0, 'days').format('MM-DD-YYYY'));

                sessionStorage.setItem('directorName', 'All');
                sessionStorage.setItem('sourceSystem', 'All');
                sessionStorage.setItem('vmg', 'All');
                sessionStorage.setItem('imppos2', 'All');

                this.setState({
                    fromDate: moment(moment(new Date(), 'MM-DD-YYYY').subtract(1, 'M').format('MM-DD-YYYY'), 'MM-DD-YYYY'),
                    toDate: moment(moment(new Date(), 'MM-DD-YYYY').subtract(0, 'days').format('MM-DD-YYYY'), 'MM-DD-YYYY'),
                    selectedDirectorName: 'Select a person',
                    dirctorList: [<Option value="Glenn Connaughton">Glenn Connaughton</Option>,
                    <Option value="Justin Painter">Justin Painter</Option>,
                    <Option value="Todd Vincent">Todd Vincent</Option>,
                    <Option value="Daniel Wilson">Daniel Wilson</Option>,
                    <Option value="Andrew Jackson">Andrew Jackson</Option>,
                    <Option value="Erin Deardorff">Erin Deardorff</Option>,
                    <Option value="Angela Faler">Angela Faler</Option>,
                    <Option value="Alexander Talavera">Alexander Talavera</Option>,
                    <Option value="Racheal Otwell">Racheal Otwell</Option>,
                    <Option value="Michelle Larue">Michelle Larue</Option>,
                    <Option value="Timothy Doolittle">Timothy Doolittle</Option>,
                    ],
                    selectedVMG: 'All',
                })
                if (sessionStorage.getItem('sourceSystem') == 'All') {
                    this.setState({
                        show: false,
                        sourceCheckAll: true,
                        sourceList: 'All',
                        imppos2CheckAll: true,
                        imppos2List: 'All',
                    })
                }
                else if (sessionStorage.getItem('imppos2') == 'All') {
                    this.setState({
                        show: false,
                        imppos2CheckAll: true,
                        imppos2List: 'All',
                    })
                }
            }
        }
        if (this.props.directorList != prevProps.directorList) {
            var values = [];
            this.props.directorList.map((val, ind) => {
                values.push(<Option value={val.directorname}>{val.directorname}</Option>)
            })
            this.setState({
                dirctorList: values
            })
        }
        if (this.props.imppos2List != prevProps.imppos2List) {
            var values = [];
            this.props.imppos2List.map((val, ind) => {
                values.push({ label: val.IMPPOS2, value: val.IMPPOS2 },)
            })
            this.setState({
                imppos2Lists: values
            })
        }
    }

    handleDrawer() {
        this.setState({
            disableBtn: true,
            collapsed: !this.state.collapsed,
        });
    };

    onChangeDatePicker(dates, dateStrings, range) {
        if (dates == null) {
            sessionStorage.setItem('GblStartDate', moment(new Date(), 'MM-DD-YYYY').subtract(1, 'M').format('MM-DD-YYYY'));
            sessionStorage.setItem('GblEndDate', moment(new Date(), 'MM-DD-YYYY').subtract(0, 'days').format('MM-DD-YYYY'));
            this.setState({
                fromDate: moment(moment(new Date(), 'MM-DD-YYYY').subtract(1, 'M').format('MM-DD-YYYY'), 'MM-DD-YYYY'),
                toDate: moment(moment(new Date(), 'MM-DD-YYYY').subtract(0, 'days').format('MM-DD-YYYY'), 'MM-DD-YYYY'),
            })
            this.props.globalLoader("{\"result\":true}");
        }
        else if (dateStrings[1] != "" ){
            sessionStorage.setItem('GblStartDate', dateStrings[0]);
            sessionStorage.setItem('GblEndDate', dateStrings[1]);
            this.setState({
                fromDate: moment(dateStrings[0], 'MM-DD-YYYY'),
                toDate: moment(dateStrings[1], 'MM-DD-YYYY'),
            })
            if (range["range"] == "end") {
                this.props.globalLoader("{\"result\":true}");
            }
        }
    }

    onSearchDirectorList(value) {
        if (value != "") {
            this.props.getDirectorList(value);
        }
    }

    onChangeDirectorList(value) {
        if (value != undefined) {
            this.setState({
                show: true,
                disableBtn: false,
                selectedDirectorName: value
            })
            sessionStorage.setItem('directorName', value)
        }
        else {
            this.setState({
                show: false,
                disableBtn: false,
                selectedDirectorName: 'Select a person'
            })
            sessionStorage.setItem('directorName', 'All')
        }
    }

    onChangeCheckBox(e, value) {
        this.setState({
            show: true,
            disableBtn: false,
        })
        if (value == 'Source') {
            sessionStorage.setItem('sourceSystem', e);
            this.setState({
                sourceCheckAll: false,
                sourceList: e
            })
        }
        else if (value == 'Imppos2') {
            sessionStorage.setItem('imppos2', e);
            this.setState({
                imppos2CheckAll: false,
                imppos2List: e
            })
        }
        //this.props.globalLoader("{\"result\":true}");
    }

    onCheckAllChange(e, value) {
        this.setState({
            show: false,
            disableBtn: false,
        })
        if (value == 'Source') {
            sessionStorage.setItem('sourceSystem', 'All');
            this.setState({
                sourceCheckAll: true,
                sourceList: 'All'
            })
        }
        else if (value == 'Imppos2') {
            sessionStorage.setItem('imppos2', 'All');
            this.setState({
                imppos2CheckAll: true,
                imppos2List: 'All'
            })
        }
        //this.props.globalLoader("{\"result\":true}");
    }

    onClickApplyBtn() {
        this.setState({ collapsed: false, })
        this.props.globalLoader("{\"result\":true}");
    }

    onChangeVMGList(value) {
        this.setState({
            show: true,
            disableBtn: false,
            selectedVMG: value
        })
        sessionStorage.setItem('vmg', value)
    }

    render() {
        const sourceSystem = [
            { label: 'Netbuild', value: 'Netbuild' },
            { label: 'Core', value: 'Core' },
        ];
        const disabledDate = (current) => {
            return current && current > moment().endOf('day');
        }
        return (
            <Row className="sub-header-fixed">
                <Col xs={12} sm={12} md={12} lg={8} xl={14} className="header-label">
                    {this.props.headerLabel}
                </Col>
                <Col xs={12} sm={12} md={12} lg={16} xl={10} className="text-right">
                    <span hidden={this.props.showDatePicker}>
                        <RangePicker className="sub-head-date-picker" size='small' format="MM-DD-YYYY" value={[this.state.fromDate, this.state.toDate]}
                            disabledDate={disabledDate} onCalendarChange={this.onChangeDatePicker} />
                    </span>
                    <span className="sub-header">
                        <span className="sub-header-filter-label">Advance Filter: </span>
                        <Badge dot={this.state.show}>
                            <FontAwesomeIcon icon={faFilter} onClick={this.handleDrawer} />
                        </Badge>
                    </span>
                </Col>
                <Drawer title="Advance Filter" placement="right" width={400} onClose={this.handleDrawer} visible={this.state.collapsed}>
                    <Row>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="text-right">
                            <Button className="export-btn m-0" type="primary" disabled={this.state.disableBtn} onClick={this.onClickApplyBtn}>Apply</Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} sm={12} md={12} lg={9} xl={9}>
                            <h6 className="filter-list-head">Source System</h6>
                            <Checkbox checked={this.state.sourceCheckAll} onChange={(e) => this.onCheckAllChange(e, 'Source')}>ALL</Checkbox>
                            <Checkbox.Group options={sourceSystem} value={this.state.sourceList} defaultValue={this.state.sourceList} onChange={(e) => this.onChangeCheckBox(e, 'Source')} />
                        </Col>
                        <Col xs={12} sm={12} md={12} lg={15} xl={15}>
                            <h6 className="filter-list-head">Director: </h6>
                            <Select allowClear={true} showSearch style={{ width: '100%' }} placeholder="Select a person"
                                optionFilterProp="children" value={this.state.selectedDirectorName} onSearch={this.onSearchDirectorList.bind(this)}
                                onChange={this.onChangeDirectorList.bind(this)}
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                {this.state.dirctorList}
                            </Select>
                        </Col>
                    </Row>
                    <Row className="filter-section">
                        <Col xs={12} sm={12} md={12} lg={9} xl={9}>
                            <h6 className="filter-list-head">Imppos2</h6>
                            <Checkbox checked={this.state.imppos2CheckAll} onChange={(e) => this.onCheckAllChange(e, 'Imppos2')}>ALL</Checkbox>
                            <Checkbox.Group className="list-scroll" options={this.state.imppos2Lists} value={this.state.imppos2List} defaultValue={this.state.imppos2List} onChange={(e) => this.onChangeCheckBox(e, 'Imppos2')} />
                        </Col>
                        <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                            <h6 className="filter-list-head">VMG: </h6>
                            <Select allowClear={true} style={{ width: '100%' }} placeholder="Select a person" value={this.state.selectedVMG}
                                onChange={this.onChangeVMGList.bind(this)}>
                                {this.state.vmgList}
                            </Select>
                        </Col>
                    </Row>
                </Drawer>
            </Row>
        );
    }
}

function mapState(state) {
    return {
        dashChange: state.getDashChange,
        directorList: state.getDirectorList,
        imppos2List: state.getUserDetailsForSettings
    };
}

export default (connect(mapState, { globalLoader, getDashChange, getDirectorList, getUserDetailsForSettings })(SubHeader));