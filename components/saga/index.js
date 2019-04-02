// import '@babel/polyfill';
import { put, takeLatest, takeEvery, all, call, delay, fork } from 'redux-saga/effects';
import { actionTypes } from '../redux';
import fetch from 'isomorphic-unfetch';
import csv from 'csvtojson';

function Fetch(apiForm) {
    const { url, path = '', params = {} } = apiForm;
    let mergeParams = '';
    if (Object.keys(params).length) {
        for (let paramsName in params) {
            if (params.hasOwnProperty(paramsName)) {
                mergeParams += `${mergeParams && '&'}${paramsName}=${
                    typeof params[paramsName] === 'object'
                        ? JSON.stringify(params[paramsName])
                        : params[paramsName]
                }`;
            }
        }
    }
    let apiUrl = url + path;
    if (mergeParams) {
        apiUrl += '?' + mergeParams;
    }
    return fetch(apiUrl).then(res => {
        if (res.ok && res.status && res.status === 200) {
            return res.json();
        } else return res.status;
    });
}
function* workerSaga(action) {
    const { apiForm } = action;
    try {
        // console.log('apiFormapiFormapiFormapiForm', apiForm);
        let initData = {};
        if (apiForm.path === 'all') {
        } else if (typeof apiForm.path !== 'string') {
        } else {
            const data = yield call(Fetch, apiForm);
            if (!data) {
                throw 'API Status Error';
            } else {
                initData = data;
                // console.log('datadatadata', data);
            }
        }
        // if (Array.isArray(apiForm)) {
        //     const parallelCall = [];

        //     apiForm.forEach((v, i) => {
        //         parallelCall.push(call(Fetch, apiForm[i]));
        //     });
        //     const data = yield all(parallelCall);
        //     if (data.length === apiForm.length) {
        //         data.forEach((v, i) => {
        //             if (!v === 200) {
        //                 throw 'API Status Error';
        //             } else {
        //                 if (apiForm[i].path) {
        //                     if (apiForm[i].path.indexOf('/') !== -1) {
        //                         initData[apiForm[i].path.split('/')[0]] = v;
        //                     } else initData[apiForm[i].path] = v;
        //                 } else {
        //                     initData['data_' + i] = v;
        //                 }
        //             }
        //         });
        //     } else throw 'API Status Error';
        // } else {
        //     const data = yield call(Fetch, apiForm);
        //     if (!data) {
        //         throw 'API Status Error';
        //     } else {
        //         initData = data;
        //         if (initData && initData.status && initData.status !== 200)
        //             throw 'API Status Error';
        //         if (apiForm.path && apiForm.path.indexOf('/count') !== -1)
        //             initData = initData.datas.count;
        //     }
        // }
        throw 'asdfasf';
        yield put({ type: 'CSV_CALL_SUCCESS', data: initData });
    } catch (error) {
        yield put({ type: 'CSV_CALL_FAILURE', error });
    }
}

export default function* rootSaga() {
    yield all([takeEvery('CSV_CALL_REQUEST', workerSaga)]);
}
