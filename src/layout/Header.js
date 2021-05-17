import React, { Component } from 'react';
import { connect } from 'react-redux';
import BarLoader from "react-spinners/BarLoader";
import moment from 'moment';
import { Layout, Row, Col, Tooltip, Drawer, Button, Input } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faUser } from '@fortawesome/free-solid-svg-icons';
import Cookies from 'universal-cookie';
import UserSetting from './UserSetting';

import {
    getLoginDetails, getLoginUserData, getGlobalRemoteTblData, getUserDetailsForSettings, globalLoader, getThemeSaveSettings
} from '../services/action';
import Drilldown from '../components/Drilldown/GlobalTblRemote';

const { Header } = Layout;
const cookies = new Cookies();
const { Search } = Input;

class Headers extends Component {
    constructor(props) {
        super(props);
        this.handleDrawer = this.handleDrawer.bind(this)
        this.handleThemeChange = this.handleThemeChange.bind(this)
        this.onSearch = this.onSearch.bind(this)
        this.onClickUserSetting = this.onClickUserSetting.bind(this)
        
        sessionStorage.setItem('GblStartDate', moment(new Date(), 'MM-DD-YYYY').subtract(1, 'M').format('MM-DD-YYYY'));
        sessionStorage.setItem('GblEndDate', moment().format('MM-DD-YYYY'));
        sessionStorage.setItem('dashView', 'PrediveDash');
        sessionStorage.setItem('directorName', 'All');
        sessionStorage.setItem('sourceSystem', 'All');
        sessionStorage.setItem('vmg', 'All');
        sessionStorage.setItem('imppos2', 'All');

        this.state = {
            activeClass: cookies.get('selectedTheme'),
            collapsed: false,
            openModal: false,
            loder: true,
            showTbl: 1,
            userName: '',
            userRole: '',
            renderDD: []
        };
        this.props.getLoginDetails();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.loginData != prevProps.loginData) {
            if (this.props.loginData.message != "Failed to fetch") {
                this.props.getLoginUserData(this.props.loginData[0].user_id);
                sessionStorage.setItem('UserEmail', this.props.loginData[0].user_id);
            }
            else {
                this.openLoginPage();
            }
        }
        if (this.props.loginUserData != prevProps.loginUserData) {
            if (this.props.loginUserData != 0) {
                sessionStorage.setItem('CUID', this.props.loginUserData[0].Cuid);
                document.body.classList.remove(cookies.get('selectedTheme'));
                document.body.classList.add(this.props.loginUserData[0].Theme);
                this.handleActiveClass(this.props.loginUserData[0].Theme)
                let userName = this.props.loginUserData[0].LastName + ', ' + this.props.loginUserData[0].FirstName
                this.setState({
                    userName: userName,
                    userRole: this.props.loginUserData[0].JobTitle,
                    appRoleId: this.props.loginUserData[0].AppRole,
                    loder: false
                })
            }
        }
    }
    openLoginPage(url) {
        return window.open('https://app-npgroomtst.azurewebsites.net/.auth/login/aad/callback');
    }
    handleDrawer() {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };
    handleThemeChange(e) {
        this.setState({
            activeClass: e.currentTarget.id
        })
        document.body.classList.remove(cookies.get('selectedTheme'));
        document.body.classList.add(e.currentTarget.id);
        cookies.set('selectedTheme', e.currentTarget.id, { path: '/' });
        this.props.getThemeSaveSettings();
    }
    handleActiveClass(value) {
        return 'white-theme-btn ' + ((value === this.state.activeClass) ? 'active-btn' : 'default')
    }
    onSearch(e) {
        var values = { OrderId: e }
        this.props.getGlobalRemoteTblData(values, 'GlobalSearch')
        this.setState({
            renderDD: <Drilldown openM={true} label={e} globalTbl={true} callName={'GlobalSearch'} onClose={this.handleCloseModal.bind(this)} />
        })
    }
    handleCloseModal() {
        this.setState({
            renderDD: [],
            openModal: false,
            userSetting: []
        })
    }
    onClickUserSetting(e) {
        this.props.globalLoader("{\"result\":\"userSetting\"}");
        let showTbl = ''
        let label = ''
        if (e.currentTarget.id == 'user') {
            showTbl= 'user'
            label= 'User Settings'
            this.props.getUserDetailsForSettings('user');
        }
        else if (e.currentTarget.id == 'phase') {
            //var value = { UserEmail, CurrentPhase }
            showTbl='phase'
            label= 'Phase Settings'
            this.props.getUserDetailsForSettings('phase');
        }
        else if (e.currentTarget.id == 'vmg') {
            //var value = { UserEmail, CurrentPhase }
            showTbl = 'vmg'
            label = 'VMG Settings'
            this.props.getUserDetailsForSettings('vmg');
        }
        else {
            showTbl = ''
            label = 'Queue Settings'
            this.props.getUserDetailsForSettings();
        }
        this.setState({
            userSetting: <UserSetting openModal={true} label={label} showTbl={showTbl} onClose={this.handleCloseModal.bind(this)} />
        })
    }
    render() {
        return (
            <Header className="header">
                <Row>
                    <Col xs={12} sm={12} md={12} lg={12} xl={9}>
                        {/*<span className="logo-lumen"></span>*/}
                        <span className="inid-logo"></span>
                        <span className="header-name">Intelligent Network Implementation Delivery</span>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={12} xl={15} className="text-right">
                        <Tooltip placement="top" title="Settings">
                            <FontAwesomeIcon className="theme-btn-icon" icon={faCog} onClick={this.handleDrawer} />
                        </Tooltip>
                        <span className="user-name">
                            <ul>
                                <li className="loader-user"><BarLoader color={'#123abc'} loading={this.state.loder} /></li>
                                <li className="logged-user-name">{this.state.userName}</li>
                                <li className="user-role">{this.state.userRole}</li>
                            </ul>
                        </span>
                        <div className="float-right border-left-2">
                            <div className="user-round-btn">
                                <FontAwesomeIcon icon={faUser} />
                                <span><i className="user-fo-icon fas fa-angle-down ml-1" /></span>
                            </div>
                        </div>
                        <Tooltip placement="bottom" className="modal-tool-tip" title="OrderID/ BGID/ FOAnumber(ParentOrderNBR)">
                            <Search className="global-search" placeholder="OrderID/ BGID/ FOAnumber(ParentOrderNBR)" enterButton loading={this.state.searchLoad} onSearch={this.onSearch} />
                        </Tooltip>
                    </Col>
                </Row>
                {this.state.renderDD}
                <Drawer title="Settings" placement="right" width={300} onClose={this.handleDrawer} visible={this.state.collapsed}>
                    <div className="setting-labels">Themes</div>
                    <Button className={this.handleActiveClass('blue')} type="primary" shape="circle" id="blue" onClick={this.handleThemeChange}>.</Button>
                    <Button className={this.handleActiveClass('white')} type="primary" shape="circle" id="white" onClick={this.handleThemeChange}>.</Button>
                    <Button className={this.handleActiveClass('block')} type="primary" shape="circle" id="block" onClick={this.handleThemeChange}>.</Button>
                    <Button className={this.handleActiveClass('violet')} type="primary" shape="circle" id="violet" onClick={this.handleThemeChange}>.</Button>
                    {this.state.appRoleId != 3 ? <div className="mt-4">
                        <div className="setting-labels">Settings</div>
                        <Button className="mr-2" type="primary" id="queue" onClick={this.onClickUserSetting}>Queue Settings</Button>
                        <Button type="primary" id="phase" onClick={this.onClickUserSetting}>Phase Settings</Button>
                        <Button className="mr-2" type="primary" id="vmg" onClick={this.onClickUserSetting}>VMG Settings</Button>
                        {this.state.appRoleId != 2 ? <Button className="mr-2 mt-2" type="primary" id="user" onClick={this.onClickUserSetting}>User Settings</Button> : null}
                    </div> : null}
                </Drawer>
                {this.state.userSetting}
            </Header>
        );
    }
}

function mapState(state) {
    return {
        loginData: state.getLoginDetails,
        loginUserData: state.getLoginUserData
    };
}

export default (connect(mapState, {
    getLoginDetails, getLoginUserData, getGlobalRemoteTblData, getUserDetailsForSettings, globalLoader, getThemeSaveSettings
})(Headers));