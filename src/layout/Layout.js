import React from 'react';
import { connect } from 'react-redux';
import { Layout } from 'antd';
import moment from 'moment';
import { Switch, Route, Redirect, NavLink, useHistory  } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe, faFilter, faCheckCircle, faChartLine, faTasks, faTh } from '@fortawesome/free-solid-svg-icons';
import { getDashChange } from '../services/action';

const { Sider, Content } = Layout;

import Headers from './Header';
import SubHeader from './SubHeader';

import PrediveDash from '../components/PrediveDash/';
import CompPerDash from '../components/CompPerDash/';
import WIPPerDash from '../components/WIPPerDash/';
import Reports from '../components/Reports/';

class Layouts extends React.Component {
    constructor(props) {
        super(props);
        this.handleSelectedMenu = this.handleSelectedMenu.bind(this)
        this.state = {
            collapsed: true,
            activeClass: '1',
            showDatePicker: true,
            headerLabel: 'Predictive Analytics'
        };
    }

    componentDidMount() {
        window.scrollTo(0, 0)
        this.props.history.push("/PredictiveAnalytics")
    }

    toggle(){
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };

    handleSelectedMenu(e) {
        if (e.currentTarget.id == '1') {
            sessionStorage.setItem('dashView', 'PrediveDash');
            this.setState({
                activeClass: e.currentTarget.id,
                headerLabel: 'Predictive Analytics',
                showDatePicker: true,
            })
        }
        else if (e.currentTarget.id == '2') {
            sessionStorage.setItem('dashView', 'CompPerDash');
            this.setState({
                activeClass: e.currentTarget.id,
                headerLabel: 'Completed Performance',
                showDatePicker: false,
            })
        }
        else if (e.currentTarget.id == '3') {
            sessionStorage.setItem('dashView', 'WIPPerDash');
            this.setState({
                activeClass: e.currentTarget.id,
                headerLabel: 'WIP Performance',
                showDatePicker: false,
            })
        }
        else if (e.currentTarget.id == '4') {
            sessionStorage.setItem('dashView', 'Reports');
            this.setState({
                activeClass: e.currentTarget.id,
                headerLabel: 'Reports',
                showDatePicker: true,
            })
        }
        this.props.getDashChange("{\"result\":true}");
    }

    handleActiveClass(value) {
        return 'site-menu-list ' + ((value === this.state.activeClass) ? 'active-class' : 'inactive-class')
    }

    render() {
        
        return (
            <Layout>
                <Headers className="fixed-header" />
                <Layout>
                    <Sider className="site-layout-background sidebar-size">
                        <NavLink to="/PredictiveAnalytics">
                            <div id="1" className={this.handleActiveClass('1')} onClick={this.handleSelectedMenu}>
                                <FontAwesomeIcon icon={faChartLine} />
                                <div className="label">Predictive Analytics</div>
                            </div>
                        </NavLink>
                        <NavLink to="/CompletedPerformance">
                            <div id="2" className={this.handleActiveClass('2')} onClick={this.handleSelectedMenu}>
                                <FontAwesomeIcon icon={faCheckCircle} />
                                <div className="label">Completed Performance</div>
                            </div>
                        </NavLink>
                        <NavLink to="/WIP_Performance">
                            <div id="3" className={this.handleActiveClass('3')} onClick={this.handleSelectedMenu}>
                                <FontAwesomeIcon icon={faTasks} />
                                <div className="label">WIP Performance</div>
                            </div>
                        </NavLink>
                        <NavLink to="/Reports">
                            <div id="4" className={this.handleActiveClass('4')} onClick={this.handleSelectedMenu}>
                                <FontAwesomeIcon icon={faTh} />
                                <div className="label">Reports</div>
                            </div>
                        </NavLink>
                    </Sider>
                    <Layout className="layout-fixed-left">
                        <SubHeader className="fixed-header" headerLabel={this.state.headerLabel} showDatePicker={this.state.showDatePicker}/>
                        <Content className="site-layout-background site-layout-background-css">
                            <Switch>
                                <Route path="/PredictiveAnalytics" component={PrediveDash} />
                                <Route path="/CompletedPerformance" component={CompPerDash} />
                                <Route path="/WIP_Performance" component={WIPPerDash} />
                                <Route path="/Reports" component={Reports} />
                            </Switch>
                        </Content>
                        {/* <Footer style={{ textAlign: 'center' }}><span className="footer-logo" /></Footer>*/}
                    </Layout>
                </Layout>
            </Layout>
        );
    }
}

function mapState(state) {
    return {
        loderCheck: state.getDashChange,
    };
}

export default (connect(mapState, { getDashChange })(Layouts));