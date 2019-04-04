const express = require('express');
const router = express.Router();
const csv = require('csvtojson');
const path = require('path');
const dirCsv = path.resolve(__dirname, '../../static/csv');
const fs = require('fs');

router.get('/data', (req, res) => {
    let getFlag = [];
    if (req.query.data && JSON.parse(req.query.data).length) {
        getFlag = JSON.parse(req.query.data);
    }
    let allFilePath = [];

    fs.readdir(dirCsv, (err, files) => {
        if (err) {
            res.json({ data: {}, status: 404, noData: true });
        }
        if (!getFlag.length) {
            allFilePath = files;
        } else {
            getFlag.map(v => {
                allFilePath.push(v + '.csv');
            });
        }
        if (!allFilePath.length) res.json({ data: {}, status: 200, noData: true });
        else {
            Promise.all(
                allFilePath.map(v => {
                    return csv({ headers: ['user', 'event', 'count'] })
                        .fromFile(dirCsv + '/' + v)
                        .then(jsonObj => {
                            return {
                                date: v.replace(/\.csv$/, ''),
                                report: jsonObj
                            };
                        })
                        .catch(e => {
                            return {
                                date: v.replace(/\.csv$/, ''),
                                report: []
                            };
                        });
                })
            ).then(val => {
                const totalData = {};
                const searchRange = allFilePath
                    .map(fv => {
                        return Number(fv.replace(/\.csv$/, ''));
                    })
                    .sort((a, b) => {
                        return a - b;
                    });
                let noData = true;
                if (val.length) {
                    let dataObj = {};

                    val.map(v => {
                        dataObj[v.date] = v.report;
                        if (v.report.length) {
                            noData = false;
                            v.report.map(rv => {
                                if (totalData[rv.user]) {
                                    if (totalData[rv.user][rv.event]) {
                                        totalData[rv.user][rv.event] = totalData[rv.user][rv.event] + Number(rv.count);
                                    } else {
                                        totalData[rv.user][rv.event] = Number(rv.count);
                                    }
                                } else {
                                    totalData[rv.user] = {};
                                    totalData[rv.user][rv.event] = Number(rv.count);
                                }
                            });
                        }
                    });

                    res.json({ data: dataObj, status: 200, searchRange, totalData, noData });
                } else {
                    res.json({ data: {}, status: 200, searchRange, totalData, noData });
                }
            });
        }
    });
});

module.exports = router;
