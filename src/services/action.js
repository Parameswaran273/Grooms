import axios from 'axios';
import 'url-search-params-polyfill';
import moment from 'moment';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

const ROOT_URL_UI = "https://app-npgroomtst.azurewebsites.net/.auth/me";
//const ROOT_URL_UI = "https://app-inid.azurewebsites.net/.auth/me";

const ROOT_URL = "https://npgroomapitst.azurewebsites.net/api/";
//const ROOT_URL = "https://api-inid.azurewebsites.net/api/";

export function configDetail() {
    let config = {
        'X-Application-Key': "APPKEYX71g4GgWh16QhxgJoiJhHQ==",
        'Secret': "aH4dUFh+j6DqlADn6ZZYuA==",
        'Content-Type': 'application/json',
        //Production
        //'X-Application-Key': "APPKEYImMCqgbQv0m6crmXhjyqBw==",
        //'Secret': "JIykxC1Z75KEC6s5BSyEw==",
        //'Content-Type': 'application/json'
    }
    return config
}

export function getLoginDetails() {
    let type = 'getLoginDetails'
    let headers = new Headers();
    headers.append('Origin', 'http://localhost:8080');
    return function (dispatch) {
        fetch(ROOT_URL_UI, { mode: 'cors', credentials: 'include', method: 'GET', headers: headers }).then(response => response.json())
            .then(response => dispatch({
                type, payload: response
            })).catch((error) => dispatch({
                type, payload: error
            }));
    }
}

function API_CALL(method, url, params, type, callback) {
    return function (dispatch) {
        axios({ method: method, url: ROOT_URL + url, params: params, headers: configDetail() }).then((response) => dispatch({
            type, payload: response
        })).catch((error) => dispatch({
            type, payload: error
        }));
    };
}

function API_CALL_Export(method, url, params, type, callback) {
    return function (dispatch) {
        axios({ method: method, url: ROOT_URL + url, params: params, headers: configDetail(), responseType: 'blob' }).then((response) => dispatch({
            type, payload: response
        })).catch((error) => dispatch({
            type, payload: error
        }));
    };
}

function getParams() {
    var sendParams = {
        'selectedTheme': cookies.get('selectedTheme'),
        'CUID': sessionStorage.getItem('CUID'),
        'UserEmail': sessionStorage.getItem('UserEmail'),
        'GblStartDate': sessionStorage.getItem('GblStartDate'),
        'GblEndDate': sessionStorage.getItem('GblEndDate'),

        'directorName': sessionStorage.getItem('directorName'),
        'sourceSystem': sessionStorage.getItem('sourceSystem'),
        'vmg': sessionStorage.getItem('vmg'),
        'imppos2': sessionStorage.getItem('imppos2'),
    };
    return sendParams;
}

export function globalLoader(value) {
    let type = 'globalLoader'
    return function (dispatch) { dispatch({ type, payload: value }) };
}

export function getDashChange(value) {
    let type = 'getDashChange'
    return function (dispatch) { dispatch({ type, payload: value }) };
}

export function getClearCallback(value) {
    let type = 'getClearCallback'
    return function (dispatch) {dispatch({ type, payload: value })};
}

export function clearCallback(value) {
    let type = 'clearCallback'
    return function (dispatch) {dispatch({type, payload: value})};
}

export function getDirectorList(value) {
    var params = { searchValue: value }
    return API_CALL('GET', 'GroomsDB/GetImpersonationListDB', params, 'getDirectorList');
}

export function getLoginUserData(value) {
    var params = { Email: value }
    return API_CALL('GET', 'GroomsDB/GetUserDetails', params, 'getLoginUserData');
}
export function getThemeSaveSettings(value) {
    var paramsValue = getParams();
    var params = { Cuid: paramsValue.CUID, Theme: paramsValue.selectedTheme }
    return API_CALL('GET', 'GroomsDB/UpdateThemeSetting', params, 'getThemeSaveSettings');
}


//User Setting APIs
export function getUserDetailsForSettings(value) {
    if (value == 'user') {
        return API_CALL('GET', 'GroomsDB/GetUserDetailsforSettings', null, 'getUserDetailsForSettings');
    }
    else if (value == 'phase') {
        return API_CALL('GET', 'GroomsDB/GetTbdSubintervals', null, 'getUserDetailsForSettings');
    }
    else if (value == 'vmg') {
        return API_CALL('GET', 'GroomsDB/GetImppos2', null, 'getUserDetailsForSettings');
    }
    else {
        return API_CALL('GET', 'GroomsDB/GetQueuesDetailsforSettings', null, 'getUserDetailsForSettings');
    }
}

export function updateUserDetailsforSettings(value, callName) {
    var paramsValue = getParams();
    if (callName == 'user') {
        var params = { UserNt: value.cuid, AppRole: value.managerName, UserEmail: paramsValue.UserEmail }
        return API_CALL('GET', 'GroomsDB/UpdateUserDetailsforSettings', params, 'updateUserDetailsforSettings');
    }
    else if (callName == 'phase') {
        var params = { Subintid: value.subintId, PhaseId: value.phaseId, PhaseName: value.phaseName, UserEmail: paramsValue.UserEmail, CurrentPhase: value.CurrentPhase }
        return API_CALL('GET', 'GroomsDB/UpdateTbdsubinetrvalforSettings', params, 'updateUserDetailsforSettings');
    }
    else if (callName == 'vmg') {
        var params = { VMG: value.VMG, IMPPOS2: value.IMPPOS2 }
        return API_CALL('GET', 'GroomsDB/UpdateVMGforSettings', params, 'updateUserDetailsforSettings');
    }
    else {
        var params = { Queue: value.queue, ManagerCuid: value.cuid, ManagerName: value.managerName, UserEmail: paramsValue.UserEmail }
        return API_CALL('GET', 'GroomsDB/UpdateQueuesDetailsforSettings', params, 'updateUserDetailsforSettings');
    }
}

export function getQueuesDetailsforSettings() {
    return API_CALL('GET', 'GroomsDB/GetQueuesDetailsforSettings', null, 'getQueuesDetailsforSettings');
}

export function getUserDetailsbySearchValue(value) {
    var params = { SearchValue: value }
    return API_CALL('GET', 'GroomsDB/GetUserDetailsbySearchValue', params, 'getUserDetailsbySearchValue');
}

export function getSubintervalsList() {
    return API_CALL('GET', 'GroomsDB/GetTbdPhases', null, 'getSubintervalsList');
}

//Predictive View API
export function getRiskOrdersWidget() {
    var paramsValue = getParams();
    var params = { directorname: paramsValue.directorName, sourceSystem: paramsValue.sourceSystem, vmg: paramsValue.vmg, imppos2: paramsValue.imppos2 }
    return API_CALL('GET', 'GroomsDB/GetRiskOrdersWidget', params, 'getRiskOrdersWidget');
}

export function getWIPPerformaceWidget() {
    var paramsValue = getParams();
    var params = { directorname: paramsValue.directorName, sourceSystem: paramsValue.sourceSystem, vmg: paramsValue.vmg, imppos2: paramsValue.imppos2 }
    return API_CALL('GET', 'GroomsDB/GetWIPPerformaceWidget', params, 'getWIPPerformaceWidget');
}

export function getTaskProfileWIP(value) {
    var paramsValue = getParams();
    var params = { cuid: value.cuid, directorname: paramsValue.directorName, sourceSystem: paramsValue.sourceSystem, vmg: paramsValue.vmg, imppos2: paramsValue.imppos2 }
    return API_CALL('GET', 'GroomsDB/GetTaskProfileWIPWidget', params, 'getTaskProfileWIP');
}

//COP VIEW API
export function getCompletedOrderWidget() {
    var paramsValue = getParams();
    var params = { EndDate: paramsValue.GblEndDate, directorname: paramsValue.directorName, sourceSystem: paramsValue.sourceSystem, vmg: paramsValue.vmg, imppos2: paramsValue.imppos2 }
    return API_CALL('GET', 'GroomsDB/GetCompletedOrderWidget', params, 'getCompletedOrderWidget');
}
export function getMadeSLAMonthwiseWidget(value) {
    var paramsValue = getParams();
    var params = { Startdate: paramsValue.GblEndDate, directorname: paramsValue.directorName, sourceSystem: paramsValue.sourceSystem, vmg: paramsValue.vmg, imppos2: paramsValue.imppos2 }
    return API_CALL('GET', 'GroomsDB/GetMadeSLAMonthwiseWidget', params, 'getMadeSLAMonthwiseWidget');
}
export function getDailyThroughputData(value) {
    var paramsValue = getParams();
    var params = { Startdate: paramsValue.GblEndDate, directorname: paramsValue.directorName, sourceSystem: paramsValue.sourceSystem, vmg: paramsValue.vmg, imppos2: paramsValue.imppos2 }
    return API_CALL('GET', 'GroomsDB/GetDailyThroughputChart', params, 'getDailyThroughputData');
}
export function getWIPDailyTrendingChart(value) {
    var paramsValue = getParams();
    var params = { Startdate: paramsValue.GblEndDate, directorname: paramsValue.directorName, sourceSystem: paramsValue.sourceSystem, vmg: paramsValue.vmg, imppos2: paramsValue.imppos2 }
    return API_CALL('GET', 'GroomsDB/GetWIPDailyTrendingChart', params, 'getWIPDailyTrendingChart');
}
export function getWIPMonthlyTrendingChart(value) {
    var paramsValue = getParams();
    var params = { Startdate: paramsValue.GblEndDate, directorname: paramsValue.directorName, sourceSystem: paramsValue.sourceSystem, vmg: paramsValue.vmg, imppos2: paramsValue.imppos2 }
    return API_CALL('GET', 'GroomsDB/GetWIPMonthlyTrendingChart', params, 'getWIPMonthlyTrendingChart');
}

//WIP View Api
export function getWIPAgingData(value) {
    var paramsValue = getParams();
    var params = { directorname: paramsValue.directorName, sourceSystem: paramsValue.sourceSystem, vmg: paramsValue.vmg, imppos2: paramsValue.imppos2 }
    return API_CALL('GET', 'GroomsDB/GetWIPAgingChartWidget', params, 'getWIPAgingData');
}

export function getCOPReports(value) {
    var paramsValue = getParams();
    var params = { yearmonth: value, directorname: paramsValue.directorName, sourceSystem: paramsValue.sourceSystem, vmg: paramsValue.vmg, imppos2: paramsValue.imppos2 }
    return API_CALL('GET', 'GroomsDB/GetCOPReports', params, 'getCOPReports');
}

//Drilldown Views
export function getSubintervalDeatils(value) {
    var paramsValue = getParams();
    var params = { PhaseName: value.phaseName, directorname: paramsValue.directorName, sourceSystem: paramsValue.sourceSystem, vmg: paramsValue.vmg, imppos2: paramsValue.imppos2 }
    return API_CALL('GET', 'GroomsDB/GetWIPSubintervalWidget', params, 'getSubintervalDeatils');
}
export function getOrderDetails(orderID) {
    var params = { OrderId: orderID }
    return API_CALL('GET', 'GroomsDB/GetOrderDetails', params, 'getOrderDetails');
}
export function getMilestoneView(value) {
    var params = { type: value.type, OrderId: value.OrderId }
    return API_CALL('GET', 'GroomsDB/GetMilestoneView', params, 'getMilestoneView');
} 
export function getMilestoneSubView(value) {
    var params = { PhaseName: value.phaseId, OrderId: value.OrderId }
    return API_CALL('GET', 'GroomsDB/Getsubinterval_based_tree', params, 'getMilestoneSubView');
} 
export function getGlobalRemoteTblData(values, callName) {
    var paramsValue = getParams();
    if (callName == "GlobalSearch") {
        var params = { OrderId: values.OrderId }
        return API_CALL('GET', 'GroomsDB/GetOrderSearch', params, 'getGlobalRemoteTblData');
    }
    else if (callName == "OrderRisk") {
        var params = {
            type: values.type, directorname: paramsValue.directorName, sourceSystem: paramsValue.sourceSystem, vmg: paramsValue.vmg, imppos2: paramsValue.imppos2, skipRows: values.skipRow,
            fetchRows: values.fetchRow, FilterType: values.filterType, value: values.searchValue, Sort: values.sort
        }
        return API_CALL('GET', 'GroomsDB/GetRiskOrdersDD', params, 'getGlobalRemoteTblData');
    }
    else if (callName == "TaskProfileWIP") {
        var params = {
            Cuid: values.cuid, type: values.type, directorname: paramsValue.directorName, sourceSystem: paramsValue.sourceSystem, vmg: paramsValue.vmg, imppos2: paramsValue.imppos2,
            skipRows: values.skipRow, fetchRows: values.fetchRow, FilterType: values.filterType, value: values.searchValue, Sort: values.sort
        }
        return API_CALL('GET', 'GroomsDB/GetTaskProfileWIPDD', params, 'getGlobalRemoteTblData');
    }
    else if (callName == "WIPPerformaceDD") {
        var params = {
            Phasename: values.phaseName, directorname: paramsValue.directorName, sourceSystem: paramsValue.sourceSystem, vmg: paramsValue.vmg, imppos2: paramsValue.imppos2,
            skipRows: values.skipRow, fetchRows: values.fetchRow, FilterType: values.filterType, value: values.searchValue, Sort: values.sort
        }
        return API_CALL('GET', 'GroomsDB/GetWIPPerformaceDD', params, 'getGlobalRemoteTblData');
    }
    else if (callName == "WIPPerformaceSubDD") {
        var params = {
            SubintervalName: values.subinterval, Phasename: values.phaseName, directorname: paramsValue.directorName, sourceSystem: paramsValue.sourceSystem, vmg: paramsValue.vmg, imppos2: paramsValue.imppos2,
            skipRows: values.skipRow, fetchRows: values.fetchRow, FilterType: values.filterType, value: values.searchValue, Sort: values.sort
        }
        return API_CALL('GET', 'GroomsDB/GetWIPSubintervalDD', params, 'getGlobalRemoteTblData');
    }
    
    //COP VIEW API
    else if (callName == "COPWidget") {
        var params = {
            EndDate: paramsValue.GblEndDate, Type: values.type,  directorname: paramsValue.directorName, sourceSystem: paramsValue.sourceSystem, vmg: paramsValue.vmg, imppos2: paramsValue.imppos2,
            skipRows: values.skipRow, fetchRows: values.fetchRow, FilterType: values.filterType, value: values.searchValue, Sort: values.sort
        }
        return API_CALL('GET', 'GroomsDB/GetCompletedOrderDD', params, 'getGlobalRemoteTblData');
    }
    else if (callName == "MonthlyThroughput") {
        var params = {
            Month: values.date, Type: values.type, directorname: paramsValue.directorName, sourceSystem: paramsValue.sourceSystem, vmg: paramsValue.vmg, imppos2: paramsValue.imppos2,
            skipRows: values.skipRow, fetchRows: values.fetchRow, FilterType: values.filterType, value: values.searchValue, Sort: values.sort
        }
        return API_CALL('GET', 'GroomsDB/GetMadeSLAMonthwiseDD', params, 'getGlobalRemoteTblData');
    }
    else if (callName == "DailyThroughput") {
        var params = {
            Date: values.date, directorname: paramsValue.directorName, sourceSystem: paramsValue.sourceSystem, vmg: paramsValue.vmg, imppos2: paramsValue.imppos2, skipRows: values.skipRow,
            fetchRows: values.fetchRow, FilterType: values.filterType, value: values.searchValue, Sort: values.sort
        }
        return API_CALL('GET', 'GroomsDB/GetDailyThroughputChartDD', params, 'getGlobalRemoteTblData');
    }
    else if (callName == "DailyTrending") {
        var params = {
            Date: values.date, directorname: paramsValue.directorName, sourceSystem: paramsValue.sourceSystem, vmg: paramsValue.vmg, imppos2: paramsValue.imppos2, skipRows: values.skipRow,
            fetchRows: values.fetchRow, FilterType: values.filterType, value: values.searchValue, Sort: values.sort
        }
        return API_CALL('GET', 'GroomsDB/GetWIPDailyTrendingDD', params, 'getGlobalRemoteTblData');
    }
    else if (callName == "MonthlyTrending") {
        var params = {
            Date: values.date, directorname: paramsValue.directorName, sourceSystem: paramsValue.sourceSystem, vmg: paramsValue.vmg, imppos2: paramsValue.imppos2, skipRows: values.skipRow,
            fetchRows: values.fetchRow, FilterType: values.filterType, value: values.searchValue, Sort: values.sort
        }
        return API_CALL('GET', 'GroomsDB/GetWIPMonthlyTrendingDD', params, 'getGlobalRemoteTblData');
    }

    //WIP VIEW API
    else if (callName == "WIPAging") {
        var params = {
            Type: values.type, directorname: paramsValue.directorName, sourceSystem: paramsValue.sourceSystem, vmg: paramsValue.vmg, imppos2: paramsValue.imppos2, skipRows: values.skipRow,
            fetchRows: values.fetchRow, FilterType: values.filterType, value: values.searchValue, Sort: values.sort, 
        }
        return API_CALL('GET', 'GroomsDB/GetWIPAgingChartDD', params, 'getGlobalRemoteTblData');
    }
    else if (callName == "COP_Report") {
        var params = {
            Yearmonth: values.type, Phasename: values.phaseName, directorname: paramsValue.directorName, sourceSystem: paramsValue.sourceSystem, vmg: paramsValue.vmg, imppos2: paramsValue.imppos2,
            skipRows: values.skipRow, fetchRows: values.fetchRow, FilterType: values.filterType, value: values.searchValue, Sort: values.sort
        }
        return API_CALL('GET', 'GroomsDB/GetCOPReportsDD', params, 'getGlobalRemoteTblData');
    }

    //Phase Yield target
    else if (callName == "PhaseYieldTarget") {
        var params = {}
        return API_CALL('GET', 'GroomsDB/GetPhaseYieldtarget', params, 'getGlobalRemoteTblData');           
    }
}

export function getGlobalRemoteTblExport(values, callName) {
    var paramsValue = getParams();
    if (callName == "OrderRisk") {
        var params = { type: values.type, directorname: paramsValue.directorName, sourceSystem: paramsValue.sourceSystem, vmg: paramsValue.vmg, imppos2: paramsValue.imppos2, FilterType: values.filterType, value: values.searchValue }
        return API_CALL_Export('GET', 'GroomsDB/GetRiskOrdersExport', params, 'getGlobalRemoteTblExport');
    }
    else if (callName == "TaskProfileWIP") {
        var params = { Cuid: values.cuid, type: values.type, directorname: paramsValue.directorName, sourceSystem: paramsValue.sourceSystem, vmg: paramsValue.vmg, imppos2: paramsValue.imppos2, FilterType: values.filterType, value: values.searchValue }
        return API_CALL_Export('GET', 'GroomsDB/GetTaskProfileWIPExport', params, 'getGlobalRemoteTblExport');
    }
    else if (callName == "WIPPerformaceDD") {
        var params = { Phasename: values.phaseName, directorname: paramsValue.directorName, sourceSystem: paramsValue.sourceSystem, vmg: paramsValue.vmg, imppos2: paramsValue.imppos2, FilterType: values.filterType, value: values.searchValue }
        return API_CALL_Export('GET', 'GroomsDB/GetWIPPerformaceExport', params, 'getGlobalRemoteTblExport');
    }
    else if (callName == "WIPPerformaceSubDD") {
        var params = { SubintervalName: values.subinterval, Phasename: values.phaseName, directorname: paramsValue.directorName, sourceSystem: paramsValue.sourceSystem, vmg: paramsValue.vmg, imppos2: paramsValue.imppos2, FilterType: values.filterType, value: values.searchValue }
        return API_CALL_Export('GET', 'GroomsDB/GetWIPSubintervalExport', params, 'getGlobalRemoteTblExport');
    }

    //COP VIEW API
    else if (callName == "COPWidget") {
        var params = { EndDate: paramsValue.GblEndDate, Type: values.type, directorname: paramsValue.directorName, sourceSystem: paramsValue.sourceSystem, vmg: paramsValue.vmg, imppos2: paramsValue.imppos2, FilterType: values.filterType, value: values.searchValue }
        return API_CALL_Export('GET', 'GroomsDB/GetCompletedOrderExport', params, 'getGlobalRemoteTblExport');
    }
    else if (callName == "MonthlyThroughput") {
        var params = { Month: values.date, Type: values.type, directorname: paramsValue.directorName, sourceSystem: paramsValue.sourceSystem, vmg: paramsValue.vmg, imppos2: paramsValue.imppos2, FilterType: values.filterType, value: values.searchValue }
        return API_CALL_Export('GET', 'GroomsDB/GetMadeSLAMonthwiseExport', params, 'getGlobalRemoteTblExport');
    }
    else if (callName == "DailyThroughput") {
        var params = { Date: values.date, directorname: paramsValue.directorName, sourceSystem: paramsValue.sourceSystem, vmg: paramsValue.vmg, imppos2: paramsValue.imppos2, FilterType: values.filterType, value: values.searchValue }
        return API_CALL_Export('GET', 'GroomsDB/GetDailyThroughputChartExport', params, 'getGlobalRemoteTblExport');
    }
    else if (callName == "DailyTrending") {
        var params = { Date: values.date, directorname: paramsValue.directorName, sourceSystem: paramsValue.sourceSystem, vmg: paramsValue.vmg, imppos2: paramsValue.imppos2, FilterType: values.filterType, value: values.searchValue }
        return API_CALL_Export('GET', 'GroomsDB/GetWIPDailyTrendingExport', params, 'getGlobalRemoteTblExport');
    }
    else if (callName == "MonthlyTrending") {
        var params = { Date: values.date, directorname: paramsValue.directorName, sourceSystem: paramsValue.sourceSystem, vmg: paramsValue.vmg, imppos2: paramsValue.imppos2, FilterType: values.filterType, value: values.searchValue }
        return API_CALL_Export('GET', 'GroomsDB/GetWIPMonthlyTrendingExport', params, 'getGlobalRemoteTblExport');
    }
    else if (callName == "COP_Report") {
        var params = { Yearmonth: values.type, Phasename: values.phaseName, directorname: paramsValue.directorName, sourceSystem: paramsValue.sourceSystem, vmg: paramsValue.vmg, imppos2: paramsValue.imppos2, FilterType: values.filterType, value: values.searchValue }
        return API_CALL_Export('GET', 'GroomsDB/GetCOPReportsExport', params, 'getGlobalRemoteTblExport');
    }

    //WIP VIEW API
    else if (callName == "WIPAging") {
        var params = { Type: values.type, directorname: paramsValue.directorName, sourceSystem: paramsValue.sourceSystem, vmg: paramsValue.vmg, imppos2: paramsValue.imppos2, FilterType: values.filterType, value: values.searchValue }
        return API_CALL_Export('GET', 'GroomsDB/GetWIPAgingChartExport', params, 'getGlobalRemoteTblExport');
    }
    else if (callName == "CopReport") {
        var params = { Type: values.type, directorname: paramsValue.directorName, sourceSystem: paramsValue.sourceSystem, vmg: paramsValue.vmg, imppos2: paramsValue.imppos2, FilterType: values.filterType, value: values.searchValue }
        return API_CALL_Export('GET', 'GroomsDB/GetCOPReportsExport', params, 'getGlobalRemoteTblExport');
    }
}