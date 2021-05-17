import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Card, DatePicker, Row, Col } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import BarLoader from "react-spinners/BarLoader";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Label, Legend, LabelList } from "recharts";
import { globalLoader, getWIPDailyTrendingChart, getGlobalRemoteTblData } from '../../services/action';

import Drilldown from '../Drilldown/GlobalTblRemote';
import InfoModal from './InfoModal';

class DailyTreChart extends Component {
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
        if (this.props.dailyTrendingData != prevProps.dailyTrendingData) {
            if (this.props.dailyTrendingData != 0) {
                this.setState({
                    chartLoder: false,
                    chartData: this.props.dailyTrendingData
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
        let label = 'Daily Trending' + ' - ' + e.payload.Logdate
        var value = { date: e.payload.Logdate, type: 'All', skipRow: 1, fetchRow: 10, filterType: 'All', searchValue: 'All', sort: 'OrderAgingOrCT desc' }
        this.props.getGlobalRemoteTblData(value, 'DailyTrending')
        this.setState({
            renderDD: <Drilldown openM={true} label={label} callName={'DailyTrending'} type={value.type} date={value.date}
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
                            <circle cx={cx} cy={cy} r={15} stroke="#d2d2d2" stroke-width='2px' fill={stroke}></circle>
                            <text x={cx} y={cy} text-anchor="middle" fill="#ffffff" font-size="12px" stroke-width='0px' font-weight='500' dy=".3em">{value[1]}</text>
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
                            <circle cx={cx} cy={cy} r={17} stroke="#d2d2d2" stroke-width='2px' fill="#67b7dc"></circle>
                            <text x={cx} y={cy} text-anchor="middle" fill="#ffffff" font-size="12px" stroke-width='0px' font-weight='500' dy=".3em">{value[1]}</text>
                        </g>
                    </svg>
                );
            }
        };
        return (
            <div>
                <Card className="chart-card card-bottom chart-clr" title={
                    <Row>
                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>WIP Daily Trending</Col>
                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                            <FontAwesomeIcon className="info-logo" icon={faInfoCircle} onClick={(e) => this.infoDDModal("DailyTrending")} />
                        </Col>
                    </Row>}>
                    <div className="chart-loader">
                        <BarLoader color={'#123abc'} loading={this.state.chartLoder} />
                    </div>
                    <ResponsiveContainer height={350} width="100%">
                        <AreaChart width={600} height={300} data={this.state.chartData} margin={{ top: 10, right: 30, left: 20, bottom: 70 }}>
                            <defs>
                                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#67b7dc" stopOpacity={0.6} />
                                    <stop offset="95%" stopColor="#67b7dc" stopOpacity={0.15} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="Logdate" angle={-45} textAnchor="end" interval={0}>
                                <Label value="Logdate" position="bottom" fill="#fff" offset={40}/>
                            </XAxis>
                            <YAxis width={50}>
                                <Label fill="#fff" angle={-90} value='Orders' position='insideLeft' style={{ textAnchor: 'middle' }} />
                            </YAxis>
                            <Legend verticalAlign="top" height={50} />
                            <Tooltip />
                            <Area dataKey='TotalOrders' name="Orders" type='monotone' stroke='#67b7dc' strokeWidth={3}
                                fillOpacity={1} fill="url(#colorUv)" activeDot={{ onClick: this.handleDotClick }} dot={renderCustomizedDot} />
                        </AreaChart>
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
        dailyTrendingData: state.getWIPDailyTrendingChart,
        loderCheck: state.globalLoader,
    };
}

export default (connect(mapState, { globalLoader, getWIPDailyTrendingChart, getGlobalRemoteTblData })(DailyTreChart));
