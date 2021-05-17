import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Card, DatePicker, Row, Col, Switch } from 'antd';
import BarLoader from "react-spinners/BarLoader";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { ComposedChart, Line, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Label, Legend } from "recharts";
import { globalLoader, getMadeSLAMonthwiseWidget, getGlobalRemoteTblData } from '../../services/action';

import Drilldown from '../Drilldown/GlobalTblRemote';
import InfoModal from './InfoModal';

class MadeSLAChart extends Component {
    constructor(props) {
        super(props);
        this.onClickChartDD = this.onClickChartDD.bind(this)
        this.onChangeSwitch = this.onChangeSwitch.bind(this)
        this.customTooltip = this.customTooltip.bind(this)
        
        this.state = {
            chartData: [],
            renderDD: [],
            chartLoder: true,
            switchChecked: true,
            label: "< 60%",
            label2: "61% - 74%",
            label3: "> 75%",
            headerLabel: 'Prediceted Tgt'
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
        if (this.props.monthwiseOrderData != prevProps.monthwiseOrderData) {
            if (this.props.monthwiseOrderData != 0) {
                this.setState({
                    chartLoder: false,
                    chartData: this.props.monthwiseOrderData
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
        if (type == 'SLAMade' || type =='SLAMadebyCCDorRCCDTgt') {
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

    customTooltip(e) {
        if (e.active && e.payload !== null && e.payload[0] !== null) {
            if (this.state.switchChecked == true) {
                return (
                    <div className="recharts-default-tooltip">
                        <span>
                            <b className="tooltip-label-head">{e.payload[0].payload.MonthYearOfCompleteDate}</b> <br />
                        </span>
                        <span>
                            <b className="sla-made-clr">SLA Made : {e.payload[0].payload.SLAMade}</b> <br />
                        </span>
                        <span>
                            <b className="sla-missed-clr">SLA Missed : {e.payload[0].payload.SLAMissed}</b> <br />
                        </span>
                        <span>
                            <b className="sla-per-clr">SLA Made % : {e.payload[0].payload.SLAMadePercentage}%</b> <br />
                        </span>
                        <span>
                            <b className="sla-cycle-time">CycleTime : {e.payload[0].payload.CycleTime}</b> <br />
                        </span>
                    </div>);
            }
            else {
                return (
                    <div className="recharts-default-tooltip">
                        <span>
                            <b className="tooltip-label-head">{e.payload[0].payload.MonthYearOfCompleteDate}</b> <br />
                        </span>
                        <span>
                            <b className="sla-made-clr">SLA Made : {e.payload[0].payload.SLAMadebyCCDorRCCDTgt}</b> <br />
                        </span>
                        <span>
                            <b className="sla-missed-clr">SLA Missed : {e.payload[0].payload.SLAMissedbyCCDorRCCDTgt}</b> <br />
                        </span>
                        <span>
                            <b className="sla-per-clr">SLA Made % : {e.payload[0].payload.SLAMadePercentagebyCCDorRCCDTgt}%</b> <br />
                        </span>
                    </div>);
            }
        }
    }

    render() {
        const renderCustomizedDot = (props) => {
            const { cx, cy, stroke, payload, value } = props;
            if (value != undefined) {
                if (value <= 60) {
                    return (
                        <svg>
                            <g id="UrTavla">
                                <circle cx={cx} cy={cy} r={17} stroke="#d2d2d2" fill="#e84547" stroke-width='2px'></circle>
                                <text x={cx} y={cy} text-anchor="middle" fill="#ffffff" font-size="12px" stroke-width='0px' font-weight='500' dy=".3em">{value}%</text>
                            </g>
                        </svg>
                    );
                }
                else if (value < 75) {
                    return (
                        <svg>
                            <g id="UrTavla">
                                <circle cx={cx} cy={cy} r={17} stroke="#d2d2d2" fill="#faad14" stroke-width='2px'></circle>
                                <text x={cx} y={cy} text-anchor="middle" fill="#ffffff" font-size="12px" stroke-width='0px' font-weight='500' dy=".3em">{value}%</text>
                            </g>
                        </svg>
                    );
                }
                else {
                    return (
                        <svg>
                            <g id="UrTavla">
                                <circle cx={cx} cy={cy} r={17} stroke="#d2d2d2" fill="#dc6967" stroke-width='2px'></circle>
                                <text x={cx} y={cy} text-anchor="middle" fill="#ffffff" font-size="12px" stroke-width='0px' font-weight='500' dy=".3em">{value}%</text>
                            </g>
                        </svg>
                    );
                }
            }
        };
        const renderCustomizedActiveDot = (props) => {
            const { cx, cy, stroke, payload, value } = props;
            if (value != undefined) {
                if (value <= 60) {
                    return (
                        <svg>
                            <g id="UrTavla">
                                <circle cx={cx} cy={cy} r={19} stroke="#d2d2d2" fill="#e84547" stroke-width='2px'></circle>
                                <text x={cx} y={cy} text-anchor="middle" fill="#ffffff" font-size="12px" stroke-width='0px' font-weight='500' dy=".3em">{value}%</text>
                            </g>
                        </svg>
                    );
                }
                else if (value < 75) {
                    return (
                        <svg>
                            <g id="UrTavla">
                                <circle cx={cx} cy={cy} r={19} stroke="#d2d2d2" fill="#faad14" stroke-width='2px'></circle>
                                <text x={cx} y={cy} text-anchor="middle" fill="#ffffff" font-size="12px" stroke-width='0px' font-weight='500' dy=".3em">{value}%</text>
                            </g>
                        </svg>
                    );
                }
                else {
                    return (
                        <svg>
                            <g id="UrTavla">
                                <circle cx={cx} cy={cy} r={19} stroke="#d2d2d2" fill="#dc6967" stroke-width='2px'></circle>
                                <text x={cx} y={cy} text-anchor="middle" fill="#ffffff" font-size="12px" stroke-width='0px' font-weight='500' dy=".3em">{value}%</text>
                            </g>
                        </svg>
                    );
                }
            }
        };
        
        return (
            <div>
                <Card className="chart-card card-bottom chart-clr" title={<Row>
                    <Col xs={12} sm={12} md={18} lg={18} xl={18}>% Made SLA based on {this.state.switchChecked ? 'Order Target' : 'OCCD/RCCD'}</Col>
                    <Col xs={12} sm={12} md={6} lg={6} xl={6} className="text-right made-sla-switch">
                        Made % by : <Switch className="milestone-switch" checkedChildren="OCCD/RCCD" unCheckedChildren="Order Tgt" onChange={this.onChangeSwitch}/>
                        <FontAwesomeIcon className="info-logo ml-10" icon={faInfoCircle} onClick={(e) => this.infoDDModal(this.state.switchChecked ? "MadeSLAPredicted" : "MadeSLAOCCD/RCCD")} />
                    </Col>
                </Row>}>
                    <div className="chart-loader">
                        <BarLoader color={'#123abc'} loading={this.state.chartLoder}/>
                    </div>
                    <div className="float-right">
                        <span className="legent-chart">
                            <span><FontAwesomeIcon icon={faCircle} className="icon-red"/> {this.state.label}</span>
                            <span><FontAwesomeIcon icon={faCircle} className="icon-yellow"/> {this.state.label2}</span>
                            <span><FontAwesomeIcon icon={faCircle} className="icon-green"/> {this.state.label3}</span>
                        </span>
                    </div>
                    <ResponsiveContainer height={350} width="100%">
                        <ComposedChart width={600} height={300} data={this.state.chartData} margin={{ top: 10, right: 30, left: 20, bottom: 70 }}>
                            <XAxis dataKey="MonthYearOfCompleteDate" angle={-45} textAnchor="end" interval={0}>
                                <Label value="CompleteMonth" position="bottom" fill="#fff" offset={30} />
                            </XAxis>
                            <YAxis yAxisId="left" orientation="left">
                                <Label fill="#fff" angle={-90} value='Orders' position='insideLeft' style={{ textAnchor: 'middle' }} />
                            </YAxis>
                            <YAxis yAxisId="right" orientation="right">
                                <Label fill="#fff" angle={-90} value='Yield %' position='outside' style={{ textAnchor: 'middle' }} />
                            </YAxis>
                            <Legend verticalAlign="top" height={50} />
                            <Tooltip content={this.customTooltip} />
                            <Bar yAxisId="left" dataKey={this.state.switchChecked ? ("SLAMade") : ("SLAMadebyCCDorRCCDTgt")} name="SLA Made" stackId="a" fill="#6cd070" strokeWidth={0.5} onClick={(e) => this.onClickChartDD(e, this.state.switchChecked ? ("SLAMissed") : ("SLAMissedbyCCDorRCCDTgt"))} />
                            <Bar yAxisId="left" dataKey={this.state.switchChecked ? ("SLAMissed") : ("SLAMissedbyCCDorRCCDTgt")} name="SLA Missed" stackId="a" fill="#d04f46" strokeWidth={0.5} radius={[8, 8, 0, 0]} onClick={(e) => this.onClickChartDD(e, this.state.switchChecked ? ("SLAMade") : ("SLAMadebyCCDorRCCDTgt"))} />
                            <Line yAxisId="right" dataKey={this.state.switchChecked ? ("SLAMadePercentage") : ("SLAMadePercentagebyCCDorRCCDTgt")} name="SLA Made %" type='monotone' stroke='#ff9800' strokeWidth={3} activeDot={renderCustomizedActiveDot} dot={renderCustomizedDot} />
                        </ComposedChart>
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
        monthwiseOrderData: state.getMadeSLAMonthwiseWidget,
        loderCheck: state.globalLoader,
    };
}

export default (connect(mapState, { globalLoader, getMadeSLAMonthwiseWidget, getGlobalRemoteTblData })(MadeSLAChart));