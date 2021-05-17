import React, { Component } from 'react';
import { connect } from 'react-redux';
import BarLoader from "react-spinners/BarLoader";
import { Row, Col, Card } from 'antd';

import { globalLoader, getWIPPerformaceWidget, getGlobalRemoteTblData } from '../../services/action';
import Drilldown from '../Drilldown/GlobalTblRemote';

class Widgets extends Component {
    constructor(props) {
        super(props);
        this.state = {
            widgets: [],
            renderDD: [],
            loader: false
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.loderCheck != prevProps.loderCheck) {
            if (this.props.loderCheck.result == true) {
                this.setState({
                    loader: false,
                    widgets: []
                })
            }
        }
        if (this.props.wipPerData != prevProps.wipPerData) {
            var values = []
            this.props.wipPerData.map((val, ind) => {
                values.push(<Col xs={12} sm={12} md={8} lg={8} xl={4}>
                    <Card size="small" className="card-bg-clr-navy-blue card-bottom p-0 wip-card" onClick={(e) => this.onClickDD(e, val.phasename)}>
                        <div className="text-center">
                            <div className="widget-label">{val.phasename}</div>
                            <div className="wip-wid"><span className="wip-wid-label">Orders: </span> {val.Totalorders}</div>
                            <div className="wip-wid"><span className="wip-wid-label">Aging: </span>{val.cycletime}</div>
                        </div>
                    </Card>
                </Col>)
            })
            this.setState({
                loader: true,
                widgets: values
            })
        }
    }

    onClickDD(e, phaseName) {
        var values = { phaseName: phaseName, skipRow: 1, fetchRow: 10, filterType: 'all', searchValue: 'all', type: 'all', sort: 'OrderAgingOrCT desc' };
        let label = phaseName;
        this.props.getGlobalRemoteTblData(values, 'WIPPerformaceDD')
        this.setState({
            renderDD: <Drilldown openM={true} label={label} callName={'WIPPerformaceDD'} phaseName={values.phaseName}
                sort={values.sort} onClose={this.handleCloseModal.bind(this)} />
        })
    }

    handleCloseModal() {
        this.setState({
            renderDD: []
        })
    }

    render() {
        return (
            <React.Fragment>
                <div hidden={this.state.loader} className="tbl-loading wip-dash-load"><h6>Loading</h6><BarLoader color={'#123abc'} /></div>
                <Row gutter={20}>
                    {this.state.widgets}
                </Row>
                {this.state.renderDD}
            </React.Fragment>
        );
    }
}

function mapState(state) {
    return {
        wipPerData: state.getWIPPerformaceWidget,
        loderCheck: state.globalLoader,
    };
}

export default (connect(mapState, { globalLoader, getWIPPerformaceWidget, getGlobalRemoteTblData })(Widgets));