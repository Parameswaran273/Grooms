import { combineReducers } from 'redux';

import getLoginDetails from './getLoginDetails';

import clearCallback from './clearCallback'; 
import globalLoader from './globalLoader'; 
import getClearCallback from './getClearCallback';
import getDashChange from './getDashChange';
import getDirectorList from './getDirectorList';
import getLoginUserData from './getLoginUserData';
import getThemeSaveSettings from './getThemeSaveSettings';

import getRiskOrdersWidget from './getRiskOrdersWidget';
import getTaskProfileWIP from './getTaskProfileWIP';

import getCompletedOrderWidget from './getCompletedOrderWidget';
import getMadeSLAMonthwiseWidget from './getMadeSLAMonthwiseWidget';
import getDailyThroughputData from './getDailyThroughputData';
import getWIPDailyTrendingChart from './getWIPDailyTrendingChart';
import getWIPMonthlyTrendingChart from './getWIPMonthlyTrendingChart';

import getWIPAgingData from './getWIPAgingData';

import getGlobalRemoteTblData from './getGlobalRemoteTblData';
import getGlobalRemoteTblExport from './getGlobalRemoteTblExport';
import getOrderDetails from './getOrderDetails';
import getMilestoneView from './getMilestoneView'; 
import getMilestoneSubView from './getMilestoneSubView'; 
import getWIPPerformaceWidget from './getWIPPerformaceWidget';

import getSubintervalDeatils from './getSubintervalDeatils';
import getUserDetailsForSettings from './getUserDetailsForSettings';
import updateUserDetailsforSettings from './updateUserDetailsforSettings'; 
import getUserDetailsbySearchValue from './getUserDetailsbySearchValue';
import getSubintervalsList from './getSubintervalsList';
import getCOPReports from './getCOPReports';

const rootReducer = combineReducers({
    getLoginDetails,
    clearCallback,
    globalLoader,
    getClearCallback,
    getDashChange,
    getDirectorList,
    getLoginUserData,
    getThemeSaveSettings,

    getRiskOrdersWidget,
    getTaskProfileWIP,

    getCompletedOrderWidget,
    getMadeSLAMonthwiseWidget,
    getDailyThroughputData,
    getWIPDailyTrendingChart,
    getWIPMonthlyTrendingChart,

    getWIPAgingData,

    getGlobalRemoteTblData,
    getGlobalRemoteTblExport,
    getOrderDetails,
    getMilestoneView,
    getMilestoneSubView,
    getWIPPerformaceWidget,

    getSubintervalDeatils,
    getUserDetailsForSettings,
    updateUserDetailsforSettings,
    getUserDetailsbySearchValue,
    getSubintervalsList,

    getCOPReports
});

export default rootReducer;