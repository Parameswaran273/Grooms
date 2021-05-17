import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Card, DatePicker, Row, Col } from 'antd';
import BarLoader from "react-spinners/BarLoader";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { ComposedChart, Line, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Label, Legend, LabelList } from "recharts";
import { globalLoader, getMadeSLAMonthwiseWidget, getGlobalRemoteTblData } from '../../services/action';

import Drilldown from '../Drilldown/GlobalTblRemote';
import InfoModal from './InfoModal';

class MonthlyThr extends Component {
    constructor(props) {
        super(props);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleLegend = this.handleLegend.bind(this);

        this.state = {
            chartData: [],
            renderDD: [],
            chartLoder: true,
            opacity: { TotalOrders: 1, CycleTime: 1 },
            barTotalOrders: true,
            barCycleTime: true,
        };
        this.handleDotClick = this.handleDotClick.bind(this)
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

    handleDotClick(e, type) {
        let label = 'Monthly Throughput - ' + e.payload.MonthYearOfCompleteDate
        var value = { date: e.payload.MonthYearOfCompleteDate, type: 'All', skipRow: 1, fetchRow: 10, filterType: 'All', searchValue: 'All', sort: 'OrderAgingOrCT desc' }
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

    handleMouseEnter(o, index) {
        const { dataKey } = o;
        if (dataKey == 'TotalOrders') {
            this.setState({
                opacity: { TotalOrders: 1, CycleTime: 0.2 },
            });
        }
        else if (dataKey == 'CycleTime') {
            this.setState({
                opacity: { TotalOrders: 0.2, CycleTime: 1 },
            });
        }
    }

    handleMouseLeave() {
        this.setState({
            opacity: { TotalOrders: 1, CycleTime: 1 },
        });
    }

    handleLegend(o) {
        const { value } = o;
        if (value == 'Orders') {
            if (this.state.barTotalOrders == false) {
                this.setState({
                    barTotalOrders: true,
                })
            }
            else {
                this.setState({
                    barTotalOrders: false,
                })
            }
        }
        else if (value == 'CycleTime') {
            if (this.state.barCycleTime == false) {
                this.setState({
                    barCycleTime: true,
                })
            }
            else {
                this.setState({
                    barCycleTime: false,
                })
            }
        }
    }

    render() {
        const renderCustomizedLabel = (props) => {
            const { x, y, width, height, value, stroke } = props;
            const radius = 10;
            return (
                <g>
                    <text x={x + width / 2} y={y - radius} fill="#fff" textAnchor="middle" dominantBaseline="middle" strokeOpacity={this.state.opacity.TotalOrders} fillOpacity={this.state.opacity.TotalOrders}>{value}</text>
                </g>
            );
        };
        const renderCustomizedDot = (props) => {
            const { cx, cy, stroke, payload, value } = props;
            if (value != undefined) {
                return (
                    <svg>
                        <g id="UrTavla">
                            <circle cx={cx} cy={cy} r={15} stroke="#d2d2d2" stroke-width='2px' fill={stroke} strokeOpacity={this.state.opacity.CycleTime} fillOpacity={this.state.opacity.CycleTime}></circle>
                            <text x={cx} y={cy} text-anchor="middle" fill="#ffffff" font-size="13px" stroke-width='0px' font-weight='500' dy=".3em" strokeOpacity={this.state.opacity.CycleTime} fillOpacity={this.state.opacity.CycleTime}>{value}</text>
                        </g>
                    </svg>
                );
            }
        };
        const renderCustomizedActiveDot = (props) => {
            const { cx, cy, stroke, payload, value } = props;
            if (value != undefined) {
                return (
                    <svg>
                        <g id="UrTavla">
                            <circle cx={cx} cy={cy} r={17} stroke="#d2d2d2" stroke-width='2px' fill="#67b7dc" strokeOpacity={this.state.opacity.CycleTime} fillOpacity={this.state.opacity.CycleTime}></circle>
                            <text x={cx} y={cy} text-anchor="middle" fill="#ffffff" font-size="13px" stroke-width='0px' font-weight='500' dy=".3em" strokeOpacity={this.state.opacity.CycleTime} fillOpacity={this.state.opacity.CycleTime}>{value}</text>
                        </g>
                    </svg>
                );
            }
        };
        return (
            <div>
                <Card className="chart-card card-bottom chart-clr" title={
                    <Row>
                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>Monthly Throughput</Col>
                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                            <FontAwesomeIcon className="info-logo" icon={faInfoCircle} onClick={(e) => this.infoDDModal("MonthlyThr")} />
                        </Col>
                    </Row>}>
                    <div className="chart-loader">
                        <BarLoader color={'#123abc'} loading={this.state.chartLoder} />
                    </div>
                    <ResponsiveContainer height={350} width="100%">
                        <ComposedChart width={600} height={300} data={this.state.chartData} margin={{ top: 10, right: 30, left: 20, bottom: 70 }}>
                            <XAxis dataKey="MonthYearOfCompleteDate" angle={-45} textAnchor="end" interval={0}>
                                <Label value="CompleteMonth" position="bottom" fill="#fff" offset={30} />
                            </XAxis>
                            <YAxis yAxisId="left" orientation="left">
                                <Label fill="#fff" angle={-90} value={this.state.barTotalOrders ? ("Orders") : ("")} position='insideLeft' style={{ textAnchor: 'middle' }} />
                            </YAxis>
                            <YAxis yAxisId="right" orientation="right">
                                <Label fill="#fff" angle={-90} value={this.state.barCycleTime ? ("CycleTime") : ("")} position='outside' style={{ textAnchor: 'middle' }} />
                            </YAxis>
                            <Legend verticalAlign="top" height={50} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} onClick={this.handleLegend}/>
                            <Tooltip />
                            <Bar yAxisId="left" dataKey={this.state.barTotalOrders ? ("TotalOrders") : ("")} name="Orders" fill="#656fdc" onClick={this.handleDotClick} radius={[8, 8, 0, 0]}
                                strokeOpacity={this.state.opacity.TotalOrders} fillOpacity={this.state.opacity.TotalOrders} onMouseOver={this.handleMouseEnter}
                                onMouseLeave={this.handleMouseLeave}>
                                <LabelList dataKey={this.state.barTotalOrders ? ("TotalOrders") : ("")} position='insideBottom' />
                            </Bar>
                            <Line yAxisId="right" dataKey={this.state.barCycleTime ? ("CycleTime") : ("")} name="CycleTime" type='monotone' stroke='#67b7dc' strokeWidth={3} strokeOpacity={this.state.opacity.CycleTime} fillOpacity={this.state.opacity.CycleTime} activeDot={renderCustomizedActiveDot} dot={renderCustomizedDot} />
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

export default (connect(mapState, { globalLoader, getMadeSLAMonthwiseWidget, getGlobalRemoteTblData })(MonthlyThr));
