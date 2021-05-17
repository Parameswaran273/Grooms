import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Card, DatePicker, Row, Col } from 'antd';
import BarLoader from "react-spinners/BarLoader";
import { ComposedChart, Line, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Label, Legend, LabelList } from "recharts";
import { globalLoader, getMadeSLAMonthwiseWidget, getGlobalRemoteTblData } from '../../services/action';

import Drilldown from '../Drilldown/GlobalTblRemote';

class MonthlyThr extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chartData: [],
            renderDD: [],
            chartLoder: true,
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
        let label = 'Avg Interval - ' + e.payload.MonthYearOfCompleteDate
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

    customTooltip(e) {
        if (e.active && e.payload !== null && e.payload[0] !== null) {
            return (
                <div className="recharts-default-tooltip">
                    <span>
                        <b className="tooltip-label-head">{e.payload[0].payload.MonthYearOfCompleteDate}</b> <br />
                    </span>
                    <span>
                        <b className="orders-clr">Orders : {e.payload[0].payload.TotalOrders}</b> <br />
                    </span>
                    <span>
                        <b className="tgt-intl-clr">Average Interval : {e.payload[0].payload.TgtIntl}</b> <br />
                    </span>
                    <span>
                        <b className="cycle-time-clr">Cycle Time : {e.payload[0].payload.CycleTime}</b> <br />
                    </span>
                </div>);
        }
    }

    render() {
        const renderCustomizedLabel = (props) => {
            const { x, y, width, height, value, stroke } = props;
            const radius = 10;
            return (
                <g>
                    <text x={x + width / 2} y={y - radius} fill={stroke} textAnchor="middle" dominantBaseline="middle">{value}</text>
                </g>
            );
        };
        const renderCustomizedDot = (props) => {
            const { cx, cy, stroke, payload, value } = props;
            if (value != undefined) {
                return (
                    <svg>
                        <g id="UrTavla">
                            <circle cx={cx} cy={cy} r={4} stroke="#d2d2d2" stroke-width='2px' fill={stroke}></circle>
                            <text x={cx} y={cy - 15} text-anchor="middle" fill="#ff3626" font-size="13px" stroke-width='0px' font-weight='500' dy=".3em">{value}</text>
                        </g>
                    </svg>
                );
            }
        };
        const renderCustomizedDot2 = (props) => {
            const { cx, cy, stroke, payload, value } = props;
            if (value != undefined) {
                return (
                    <svg>
                        <g id="UrTavla">
                            <circle cx={cx} cy={cy} r={4} stroke="#d2d2d2" stroke-width='2px' fill={stroke}></circle>
                            <text x={cx} y={cy + 15} text-anchor="middle" fill="#00aeff" font-size="13px" stroke-width='0px' font-weight='500' dy=".3em">{value}</text>
                        </g>
                    </svg>
                );
            }
        };
        return (
            <div>
                <Card className="chart-card card-bottom" title="Average Interval">
                    <div className="chart-loader">
                        <BarLoader color={'#123abc'} loading={this.state.chartLoder} />
                    </div>
                    <ResponsiveContainer height={350} width="100%">
                        <ComposedChart width={600} height={300} data={this.state.chartData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                            <XAxis dataKey="MonthYearOfCompleteDate" angle={-45} textAnchor="end" interval={0}>
                                <Label value="CompleteMonth" position="bottom" fill="#fff" offset={30} />
                            </XAxis>
                            <YAxis yAxisId="left" orientation="left">
                                <Label fill="#fff" angle={-90} value='Orders' position='insideLeft' style={{ textAnchor: 'middle' }} />
                            </YAxis>
                            <YAxis yAxisId="right" orientation="right">
                                <Label fill="#fff" angle={-90} value='CycleTime' position='outside' style={{ textAnchor: 'middle' }} />
                            </YAxis>
                            <Legend verticalAlign="top" height={50} />
                            <Tooltip content={this.customTooltip} />
                            <Line yAxisId="left" dataKey='TgtIntl' name="AverageInterval" type='monotone' stroke='#c5463c' strokeWidth={3} dot={renderCustomizedDot} activeDot={{ onClick: this.handleDotClick }}/>
                            <Line yAxisId="right" dataKey='CycleTime' name="CycleTime" type='monotone' stroke='#67b7dc' strokeWidth={3} dot={renderCustomizedDot2} activeDot={{ onClick: this.handleDotClick }}/>
                        </ComposedChart>
                    </ResponsiveContainer>
                </Card>

                {this.state.renderDD}
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
