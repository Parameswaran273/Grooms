    import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Card, DatePicker, Row, Col } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import BarLoader from "react-spinners/BarLoader";
import { ComposedChart, AreaChart, Area, Line, CartesianGrid, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Label, Legend, LabelList } from "recharts";
import { globalLoader, getWIPMonthlyTrendingChart, getGlobalRemoteTblData } from '../../services/action';

import Drilldown from '../Drilldown/GlobalTblRemote';
import InfoModal from './InfoModal';

class MonthlyTreChart extends Component {
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
        if (this.props.monthlyTrendingData != prevProps.monthlyTrendingData) {
            if (this.props.monthlyTrendingData != 0) {
                this.setState({
                    chartLoder: false,
                    chartData: this.props.monthlyTrendingData
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
        let label = 'Monthly Trending' + ' - ' + e.payload.MonthYearOfLogdate
        var value = { date: e.payload.MonthYearOfLogdate, type: 'All', skipRow: 1, fetchRow: 10, filterType: 'All', searchValue: 'All', sort: 'OrderAgingOrCT desc' }
        this.props.getGlobalRemoteTblData(value, 'MonthlyTrending')
        this.setState({
            renderDD: <Drilldown openM={true} label={label} callName={'MonthlyTrending'} type={value.type} date={value.date}
                sort={value.sort} onClose={this.handleCloseModal.bind(this)} />
        })
    }

    handleCloseModal() {
        this.setState({
            renderDD: []
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
        const renderCustomizedDot = (props) => {
            const { cx, cy, stroke, payload, value } = props;
            if (value != undefined) {
                return (
                    <svg>
                        <g id="UrTavla">
                            <circle cx={cx} cy={cy} r={15} stroke="#fff" stroke-width='2px' fill="#40cfff"></circle>
                            <text x={cx} y={cy} text-anchor="middle" fill="#ffffff" font-size="13px" stroke-width='0px' font-weight='500' dy=".3em">{value}</text>
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
                            <circle cx={cx} cy={cy} r={17} stroke="#fff" stroke-width='2px' fill="#40cfff"></circle>
                            <text x={cx} y={cy} text-anchor="middle" fill="#ffffff" font-size="13px" stroke-width='0px' font-weight='500' dy=".3em">{value}</text>
                        </g>
                    </svg>
                );
            }
        };
        const renderCustomizedDot1 = (props) => {
            const { cx, cy, stroke, payload, value } = props;
            if (value != undefined) {
                return (
                    <svg>
                        <g id="UrTavla">
                            <circle cx={cx} cy={cy} r={15} stroke="#fff" stroke-width='2px' fill="#1890ff"></circle>
                            <text x={cx} y={cy} text-anchor="middle" fill="#ffffff" font-size="13px" stroke-width='0px' font-weight='500' dy=".3em">{value}</text>
                        </g>
                    </svg>
                );
            }
        };
        const renderCustomizedActiveDot1 = (props) => {
            const { cx, cy, stroke, payload, value } = props;
            if (value != undefined) {
                return (
                    <svg>
                        <g id="UrTavla">
                            <circle cx={cx} cy={cy} r={17} stroke="#fff" stroke-width='2px' fill="#1890ff"></circle>
                            <text x={cx} y={cy} text-anchor="middle" fill="#ffffff" font-size="13px" stroke-width='0px' font-weight='500' dy=".3em">{value}</text>
                        </g>
                    </svg>
                );
            }
        };
        return (
            <div>
                <Card className="chart-card card-bottom chart-clr" title={
                    <Row>
                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>WIP Monthly Trending</Col>
                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                            <FontAwesomeIcon className="info-logo" icon={faInfoCircle} onClick={(e) => this.infoDDModal("MonthlyTrending")} />
                        </Col>
                    </Row>}>
                    <div className="chart-loader">
                        <BarLoader color={'#123abc'} loading={this.state.chartLoder} />
                    </div>
                    <ResponsiveContainer height={350} width="100%">
                        <ComposedChart width={600} height={300} data={this.state.chartData} margin={{ top: 10, right: 30, left: 20, bottom: 70 }}>
                            <XAxis dataKey="MonthYearOfLogdate" angle={-45} textAnchor="end" interval={0}>
                                <Label value="Logdate" position="bottom" fill="#fff" offset={40} />
                            </XAxis>
                            <YAxis yAxisId="left" orientation="left">
                                <Label fill="#fff" angle={-90} value='Orders' position='insideLeft' style={{ textAnchor: 'middle' }} />
                            </YAxis>
                            <YAxis yAxisId="right" orientation="right">
                                <Label fill="#fff" angle={-90} value='Avg' position='outside' style={{ textAnchor: 'middle' }} />
                            </YAxis>
                            <Legend verticalAlign="top" height={50} />
                            <Tooltip />
                            <Bar yAxisId="left" dataKey='TotalOrders' name="Orders" fill="#656fdc" onClick={this.handleDotClick} radius={[8, 8, 0, 0]}>
                                <LabelList dataKey="TotalOrders" position='insideStart' />
                            </Bar>
                            <Line yAxisId="right" dataKey='AvgTgt' name="Avg Target" type='monotone' stroke='#40cfff' strokeWidth={3} activeDot={renderCustomizedActiveDot} dot={renderCustomizedDot} />
                            <Line yAxisId="right" dataKey='AvgAging' name="Avg Aging" type='monotone' stroke='#1890ff' strokeWidth={3} activeDot={renderCustomizedActiveDot1} dot={renderCustomizedDot1} />
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
        monthlyTrendingData: state.getWIPMonthlyTrendingChart,
        loderCheck: state.globalLoader,
    };
}

export default (connect(mapState, { globalLoader, getWIPMonthlyTrendingChart, getGlobalRemoteTblData })(MonthlyTreChart));
