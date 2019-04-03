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
            res.json({ data: [], status: 404 });
        }
        // console.log(files);
        if (!getFlag.length) {
            allFilePath = files;
        } else {
            getFlag.map(v => {
                allFilePath.push(v + '.csv');
            });
        }
        if (!allFilePath.length) res.json({ data: [], status: 200 });
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
            ).then(v => {
                const searchRange = allFilePath
                    .map(v => {
                        return Number(v.replace(/\.csv$/, ''));
                    })
                    .sort((a, b) => {
                        return a - b;
                    });
                if (v.length) {
                    res.json({ data: v, status: 200, searchRange });
                } else {
                    res.json({ data: [], status: 200, searchRange });
                }
            });
        }
    });
});

module.exports = router;
