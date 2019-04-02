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
    let result = [];

    fs.readdir(dirCsv, (err, files) => {
        if (err) {
            res.json({ data: [], status: 404 });
        }
        // console.log(files);
        if (!getFlag.length) {
            allFilePath = files;
        } else {
            getFlag.map(v => {
                if (files.indexOf(v + '.csv') !== -1) {
                    allFilePath.push(v + '.csv');
                }
            });
        }
        if (!allFilePath.length) res.json({ data: [], status: 200 });
        else {
            results = Promise.all(
                allFilePath.map(v => {
                    return csv({ headers: ['user', 'event', 'count'] })
                        .fromFile(dirCsv + '/' + v)
                        .then(jsonObj => {
                            return {
                                date: v.replace(/\.csv$/, ''),
                                report: jsonObj
                            };
                        });
                })
            );
            results.then(v => {
                if (v.length) {
                    res.json({ data: v, status: 200 });
                } else {
                    res.json({ data: [], status: 200 });
                }
            });
        }
    });
});

module.exports = router;
