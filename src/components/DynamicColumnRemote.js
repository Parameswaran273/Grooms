import React from 'react';
import { customFilter } from 'react-bootstrap-table2-filter';

import RemoteTblFilter from './RemoteTblFilter';

export const dynamicColumn = (datas,callName) => {
    var values = [];
    for (var key in datas) {
        let header = key.length;
        let value = 0;
        let TotalCount = 0;
        if (datas[key] != null) {
            value = datas[key].length;
        }
        if (value == undefined) {
            value = 0;
        }
        if (header > value) {
            if (header < 6) {
                TotalCount = (header * 10) + 50;
            }
            else if (header < 9) {
                TotalCount = (header * 10) + 20;
            }
            else if (header < 10) {
                TotalCount = (header * 10) + 15;
            }
            else if (header < 11) {
                TotalCount = (header * 10) + 15;
            }
            else if (header < 12) {
                TotalCount = (header * 10) + 20;
            }
            else if (header < 13) {
                TotalCount = (header * 10) + 30;
            }
            else if (header < 15) {
                TotalCount = (header * 10) + 10;
            }
            else if (header < 17) {
                TotalCount = (header * 10) - 10;
            }
            else if (header < 19) {
                TotalCount = (header * 10) - 25;
            }
            else if (header > 20) {
                TotalCount = (header * 10) - 30;
            }
            else {
                TotalCount = (header * 10);
            }
        }
        else {
            if (value < 6) {
                TotalCount = (value * 10) + 50;
            }
            else if (value < 7) {
                TotalCount = (value * 10) + 30;
            }
            else if (value < 9) {
                TotalCount = (value * 10) + 20;
            }
            else if (value < 12) {
                TotalCount = (value * 10) + 15;
            }
            else if (value < 15) {
                TotalCount = (value * 10);
            }
            else if (value < 17) {
                TotalCount = (value * 10) - 10;
            }
            else if (value < 19) {
                TotalCount = (value * 10) - 30;
            }
            else if (value < 20) {
                TotalCount = (value * 10) - 30;
            }
            else if (value < 21) {
                TotalCount = (value * 10) - 40;
            }
            else if (value > 22) {
                TotalCount = 250;
            }
            else {
                TotalCount = (value * 10);
            }
        }
        if (callName == 'GlobalTbl') {
            if (key == 'OrderId') {
                values.push({
                    dataField: key, text: key, sort: true, headerStyle: { width: TotalCount }
                });
            }
            else if (key == 'Owner') {
                values.push({
                    dataField: key, text: key, sort: true, headerStyle: { width: TotalCount }, formatter: (cell, row) => {
                        return cell != null ? <Tooltip placement="top" className="modal-tool-tip" title="Open Team">
                            <span onClick={() => openTeams(row)}><span className="microsoft-team-icon" /> <a className="open-team-chart">{cell}</a></span>
                        </Tooltip> : <span />
                    }
                });
            }
            else {
                values.push({
                    dataField: key, text: key, sort: true, headerStyle: { width: TotalCount }
                });
            }
        }
        else {
            if (key == 'OrderId') {
                values.push({
                    dataField: key, text: key, sort: true, headerStyle: { width: 120 }, filter: customFilter(),
                    filterRenderer: (onFilter, column) => <RemoteTblFilter onFilter={onFilter} column={column} />
                });
            }
            else if (key == 'Owner') {
                values.push({
                    dataField: key, text: key, sort: true, headerStyle: { width: TotalCount }, formatter: (cell, row) => {
                        return cell != null ? <Tooltip placement="top" className="modal-tool-tip" title="Open Team">
                            <span onClick={() => openTeams(row)}><span className="microsoft-team-icon" /> <a className="open-team-chart">{cell}</a></span>
                        </Tooltip> : <span />
                    }
                });
            }
            else {
                values.push({
                    dataField: key, text: key, sort: true, headerStyle: { width: TotalCount }, filter: customFilter(),
                    filterRenderer: (onFilter, column) => <RemoteTblFilter onFilter={onFilter} column={column} />
                });
            }
        }
    }
    return values;
};

export const openTeams = (e) => {
    let message = "Hello " + e.Owner
    let url = 'https://teams.microsoft.com/l/chat/0/0?users=' + e.OwnerEmail + '&message=' + message
    return window.open(url, '_blank')
}