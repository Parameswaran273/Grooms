import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Card, DatePicker, Row, Col, Switch } from 'antd';
import BarLoader from "react-spinners/BarLoader";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { ComposedChart, BarChart, Line, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Label, LabelList, Legend, Cell } from "recharts";
import { globalLoader, getWIPAgingData, getGlobalRemoteTblData } from '../../services/action';

import Drilldown from '../Drilldown/GlobalTblRemote';
import InfoModal from './InfoModal';

class WIPAgingChart extends Component {
    constructor(props) {
        super(props);
        this.onClickChartDD = this.onClickChartDD.bind(this)
        this.onChangeSwitch = this.onChangeSwitch.bind(this)

        this.state = {
            chartData: [],
            renderDD: [],
            chartLoder: true,
            switchChecked: true,
            label: "< 60%",
            label2: "61% - 74%",
            label3: "> 75%",
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.loderCheck != prevProps.loderCheck) {
            if (this.props.loderCheck.result == true) {
                this.setState({
                    chartLoder: true,
                    chartData: []
                })
            }
        }
        if (this.props.wipAgingData != prevProps.wipAgingData) {
            if (this.props.wipAgingData != 0) {
                this.setState({
                    chartLoder: false,
                    chartData: this.props.wipAgingData
                })
            }
            else {
                this.setState({
                    chartLoder: false,
                    chartData: []
                })
            }
        }
    }

    onClickChartDD(e, type) {
        let label = type
        if (type == 'SLAMade' || type == 'SLAMadebyCCDorRCCDTgt') {
            label = 'SLA Made' + ' - ' + e.payload.MonthYearOfCompleteDate
        }
        else {
            label = 'SLA Missed' + ' - ' + e.payload.MonthYearOfCompleteDate
        }
        var value = { date: e.payload.MonthYearOfCompleteDate, type: type, skipRow: 1, fetchRow: 10, filterType: 'All', searchValue: 'All', sort: 'OrderAgingOrCT desc' }
        this.props.getGlobalRemoteTblData(value, 'MonthlyThroughput')
        this.setState({
            renderDD: <Drilldown openM={true} label={label} callName={'MonthlyThroughput'} type={value.type} date={value.date}
                sort={value.sort} onClose={this.handleCloseModal.bind(this)} />
        })
    }

    handleCloseModal() {
        this.setState({
            renderDD: []
        })
    }

    onChangeSwitch() {
        this.setState({
            switchChecked: !this.state.switchChecked
        })
    }

    onClickChartDD(e) {
        let label = e.Aging
        var value = { type: e.Aging, skipRow: 1, fetchRow: 10, filterType: 'All', searchValue: 'All', sort: 'OrderAgingOrCT desc' }
        this.props.getGlobalRemoteTblData(value, 'WIPAging')
        this.setState({
            renderDD: <Drilldown openM={true} label={label} callName={'WIPAging'} type={value.type} sort={value.sort}
                onClose={this.handleCloseModal.bind(this)} />
        })
    }

    render() {
        const renderCustomizedLabel = (props) => {
            const { x, y, width, height, value, stroke } = props;
            const radius = 10;
            return (
                <g>
                    <text x={x + width / 2} y={y - radius} fill="#fff" textAnchor="middle" dominantBaseline="middle">{value}</text>
                </g>
            );
        };
        return (
            <div>
                <Card className="chart-card card-bottom chart-clr" title={<Row>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>WIP Aging</Col>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-right made-sla-switch">
                        <FontAwesomeIcon className="info-logo" icon={faInfoCircle} onClick={(e) => this.infoDDModal("WIPAging")} />
                    </Col>
                </Row>}>
                    <div className="chart-loader">
                        <BarLoader color={'#123abc'} loading={this.state.chartLoder} />
                    </div>
                    {/*<div className="float-right">
                        <span className="legent-chart">
                            <span><FontAwesomeIcon icon={faCircle} className="icon-red" /> {this.state.label}</span>
                            <span><FontAwesomeIcon icon={faCircle} className="icon-yellow" /> {this.state.label2}</span>
                            <span><FontAwesomeIcon icon={faCircle} className="icon-green" /> {this.state.label3}</span>
                        </span>
                    </div>*/}
                    <ResponsiveContainer height={350} width="100%">
                        <BarChart width={600} height={300} data={this.state.chartData} margin={{ top: 10, right: 30, left: 20, bottom: 90 }}>
                            <XAxis dataKey="Aging" angle={-45} textAnchor="end" interval={0}>
                                <Label value="Aging" position="bottom" fill="#fff" offset={60} />
                            </XAxis>
                            <YAxis><Label fill="#fff" angle={-90} value='Orders' position='insideLeft' style={{ textAnchor: 'middle' }} /></YAxis>
                            <Legend verticalAlign="top" height={36} />
                            <Tooltip />
                            <Bar dataKey='TotalOrderCount' name="Orders" fill="#00bcd4" onClick={this.onClickChartDD} radius={[8, 8, 0, 0]}>
                                <LabelList dataKey="TotalOrderCount" content={renderCustomizedLabel}  />
                                {
                                    this.state.chartData.map((entry, index) => {
                                        return <Cell fill={entry.ColorCode} />;
                                    })
                                }
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </Card>

                {this.state.renderDD}
                <InfoModal setClick1={click => this.infoDDModal = click} />
            </div>
        );
    }
}

function mapState(state) {
    return {
        wipAgingData: state.getWIPAgingData,
        loderCheck: state.globalLoader,
    };
}

export default (connect(mapState, { globalLoader, getWIPAgingData, getGlobalRemoteTblData })(WIPAgingChart));