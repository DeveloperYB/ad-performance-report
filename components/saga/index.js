import { put, takeLatest, takeEvery, all, call, delay, fork } from 'redux-saga/effects';
import { actionTypes } from '../redux';
import fetch from 'isomorphic-unfetch';

function Fetch(apiForm) {
    const { url, path = '', params = {} } = apiForm;
    let mergeParams = '';
    if (Object.keys(params).length) {
        for (let paramsName in params) {
            if (params.hasOwnProperty(paramsName)) {
                mergeParams += `${mergeParams && '&'}${paramsName}=${
                    typeof params[paramsName] === 'object' ? JSON.stringify(params[paramsName]) : params[paramsName]
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
        const data = yield call(Fetch, apiForm);
        if (!data) {
            throw 'API Status Error';
        }
        // throw 'asdfasf';
        yield put({ type: 'CSV_CALL_SUCCESS', data });
    } catch (error) {
        yield put({ type: 'CSV_CALL_FAILURE', error });
    }
}

export default function* rootSaga() {
    yield all([takeEvery('CSV_CALL_REQUEST', workerSaga)]);
}
