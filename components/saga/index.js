// import '@babel/polyfill';
import { put, takeLatest, takeEvery, all, call, delay, fork } from 'redux-saga/effects';
import { actionTypes } from '../redux';
import fetch from 'isomorphic-unfetch';

function Fetch(apiForm) {
    const {
        method = 'GET',
        path,
        params = {},
        body,
        edges = false,
        version = 'v2',
        table = 'ims',
        headers,
        url,
        encodeUrl
    } = apiForm;
    let mergeParams = '';
    if (Object.keys(params).length) {
        for (let paramsName in params) {
            if (params.hasOwnProperty(paramsName)) {
                mergeParams += `${mergeParams && '&'}${paramsName}=${
                    encodeUrl
                        ? typeof params[paramsName] === 'object'
                            ? encodeURIComponent(JSON.stringify(params[paramsName]))
                            : encodeURIComponent(params[paramsName])
                        : typeof params[paramsName] === 'object'
                        ? JSON.stringify(params[paramsName])
                        : params[paramsName]
                }`;
            }
        }
    }
    let bodyData;
    if (body) {
        bodyData = new FormData();
        for (let key in body) {
            if (body.hasOwnProperty(key) && body[key] !== undefined && body[key] !== null) {
                bodyData.append(key, body[key]);
            }
        }
    }
    if (edges) mergeParams += `${mergeParams && '&'}edges=${JSON.stringify(edges)}`;

    let apiUrl;
    if (url) apiUrl = url;
    else apiUrl = `https://api.uneedcomms.com/${table}/${version}/${path}`;
    if (mergeParams) {
        apiUrl += '?' + mergeParams;
    }
    return fetch(apiUrl, {
        method: method,
        body: bodyData,
        headers: new Headers(
            headers
                ? headers
                : {
                      Authorization: CURRENT_USER.access_token
                  }
        )
    }).then(res => {
        if (res.ok && res.status && res.status === 200) return res.json();
        else return res.status;
    });
}
function* workerSaga(action) {
    const { dataInputTo, apiForm, modal } = action;
    try {
        let initData = {};
        if (Array.isArray(apiForm)) {
            const parallelCall = [];

            apiForm.forEach((v, i) => {
                parallelCall.push(call(Fetch, apiForm[i]));
            });
            const data = yield all(parallelCall);
            if (data.length === apiForm.length) {
                data.forEach((v, i) => {
                    if (!v === 200) {
                        throw 'API Status Error';
                    } else {
                        if (apiForm[i].path) {
                            if (apiForm[i].path.indexOf('/') !== -1) {
                                initData[apiForm[i].path.split('/')[0]] = v;
                            } else initData[apiForm[i].path] = v;
                        } else {
                            initData['data_' + i] = v;
                        }
                    }
                });
            } else throw 'API Status Error';
        } else {
            const data = yield call(Fetch, apiForm);
            if (!data) {
                throw 'API Status Error';
            } else {
                initData = data;
                if (initData && initData.status && initData.status !== 200)
                    throw 'API Status Error';
                if (apiForm.path && apiForm.path.indexOf('/count') !== -1)
                    initData = initData.datas.count;
            }
        }

        yield put({ type: 'API_CALL_SUCCESS', data: initData, dataInputTo, modal });
    } catch (error) {
        yield put({ type: 'API_CALL_FAILURE', error, dataInputTo });
    }
}
function* bookmarkSaga(action) {
    const { dataInputTo, apiForm, modal } = action;
    try {
        let initData = {};
        const parallelCall = [];

        apiForm.forEach((v, i) => {
            parallelCall.push(call(Fetch, apiForm[i]));
        });
        const data = yield all(parallelCall);
        let inputIdx;
        let subInputTo = [];
        if (data.length === apiForm.length) {
            data.forEach((v, i) => {
                if (!v === 200 && !v === 202) {
                    throw 'API Status Error';
                } else {
                    let pathSplit = apiForm[i].path.split('/');
                    inputIdx = pathSplit[pathSplit.length - 1];
                    subInputTo.push(inputIdx);
                    if (v.status === 200 && v.datas.length) {
                        let newData = {};
                        for (let key in v.datas) {
                            if (v.datas.hasOwnProperty(key)) {
                                newData[v.datas[key].data_bookmark_field] =
                                    v.datas[key].data_bookmark_name;
                            }
                        }
                        initData[inputIdx] = newData;
                    } else initData[inputIdx] = false;
                }
            });
        } else throw 'API Status Error';
        yield put({
            type: 'BOOKMARK_API_CALL_SUCCESS',
            data: initData,
            dataInputTo,
            subInputTo,
            modal
        });
    } catch (error) {
        yield put({ type: 'BOOKMARK_API_CALL_FAILURE', error, dataInputTo });
    }
}
function* audSaga(action) {
    const { dataInputTo, apiForm, modal } = action;
    try {
        let initData = {};
        const data = yield call(Fetch, apiForm);
        if (!data) {
            throw 'API Status Error';
        } else {
            initData = data;
            if (!data.workflow_data) throw 'API Status Error';
            else initData = data.workflow_data;
        }
        yield put({ type: 'API_CALL_SUCCESS', data: initData, dataInputTo, modal });
    } catch (error) {
        yield put({ type: 'API_CALL_FAILURE', error, dataInputTo });
    }
}
function* kakaoSaga(action) {
    const { dataInputTo, apiForm } = action;
    try {
        let initData = {};
        const data = yield call(Fetch, apiForm);
        if (!data) {
            throw 'API Status Error';
        } else {
            initData = { ...data, orign_url: apiForm.body.img_url };
        }
        yield put({ type: 'KAKAO_IMG_CALL_SUCCESS', data: initData, dataInputTo });
    } catch (error) {
        yield put({ type: 'KAKAO_IMG_CALL_FAILURE', error, dataInputTo });
    }
}
function* titleSaga(action) {
    const { dataInputTo, apiForm, wfData } = action;
    try {
        let initData = {};
        const workflowSenderData = yield call(Fetch, apiForm);
        if (!workflowSenderData) {
            throw 'ERROR';
        } else {
            if (!workflowSenderData.action_id || !workflowSenderData.workflow_sender_title)
                throw 'ERROR';
            else {
                initData.ims_workflow_senders = workflowSenderData;
                const workflowData = yield call(Fetch, {
                    method: 'PUT',
                    path: `ims_workflows/${WF_LIST_INDEX}`,
                    body: { workflow_data: wfData },
                    params: {
                        read: true
                    }
                });
                if (!workflowData.workflow_data) throw 'ERROR';
                else {
                    initData.workflow_data = workflowData.workflow_data;
                }
            }
        }
        yield put({ type: 'TITLE_API_SUCCESS', data: initData, dataInputTo });
    } catch (error) {
        yield put({ type: 'TITLE_API_FAILURE', error, apiForm });
    }
}

function* wdDataSaga(action) {
    const { apiForm } = action;
    try {
        let data;
        const wdData = yield call(Fetch, apiForm);
        if (!wdData || !wdData.workflow_data) {
            throw 'ERROR';
        } else {
            data = wdData.workflow_data;
        }
        yield put({ type: 'WF_DATA_API_SUCCESS', data });
    } catch (error) {
        yield put({ type: 'WF_DATA_API_FAILURE', error });
    }
}

function* senderContentsSaga(action) {
    console.log(action);
    const { keyInUseArr, queryStringParams, state, dataInputIdx, workflow_data } = action;
    try {
        if (queryStringParams.table_idx) {
            if (keyInUseArr.length) {
                const apiForm = {
                    method: 'POST',
                    url: `https://storage.uneedcomms.com/api/fm/v2/${
                        CURRENT_USER.domain_id
                    }/keyinuse`,
                    params: {
                        ...queryStringParams,
                        key: keyInUseArr.toString()
                    },
                    body: { ims_domain_idx: CURRENT_USER.ims_domain.ims_domain_idx },
                    headers: {
                        'X-API-KEY': CURRENT_USER.access_token
                    },
                    encodeUrl: true
                };
                yield fork(Fetch, apiForm);
            }
            const stateApiForm = {
                method: 'PUT',
                path: `ims_sender_contents/${queryStringParams.table_idx}`,
                body: { ...state },
                params: {
                    read: true
                }
            };
            const senderContentsData = yield call(Fetch, stateApiForm);
            if (!senderContentsData || !senderContentsData.content_idx) {
                throw 'ERROR';
            } else {
                let data = senderContentsData;
                yield delay(1000);
                yield put({
                    type: 'SENDER_CONTENTS_API_SUCCESS',
                    data,
                    dataInputIdx,
                    apiType: 'PUT'
                });
            }
        } else {
            const stateApiForm = {
                method: 'POST',
                path: `ims_sender_contents`,
                body: { ...state },
                params: {
                    read: true
                }
            };
            const senderContentsData = yield call(Fetch, stateApiForm);
            if (!senderContentsData || !senderContentsData.content_idx) {
                throw 'ERROR';
            } else {
                if (keyInUseArr.length) {
                    queryStringParams.table_idx = senderContentsData.content_idx;
                    const apiForm = {
                        method: 'POST',
                        url: `https://storage.uneedcomms.com/api/fm/v2/${
                            CURRENT_USER.domain_id
                        }/keyinuse`,
                        params: {
                            ...queryStringParams,
                            key: keyInUseArr.toString()
                        },
                        body: { ims_domain_idx: CURRENT_USER.ims_domain.ims_domain_idx },
                        headers: {
                            'X-API-KEY': CURRENT_USER.access_token
                        },
                        encodeUrl: true
                    };
                    yield fork(Fetch, apiForm);
                }
                let data = senderContentsData;
                workflow_data.ims_workflow_action.workflow[0].setting.sender.cms[
                    queryStringParams.desc.senderCode
                ] = { idx: senderContentsData.content_idx };
                if (workflow_data) {
                    const workflowData = yield call(Fetch, {
                        method: 'PUT',
                        path: `ims_workflows/${WF_LIST_INDEX}`,
                        body: { workflow_data: JSON.stringify(workflow_data) },
                        params: {
                            read: true
                        }
                    });
                    if (!workflowData.workflow_data) throw 'ERROR';
                    else {
                        yield delay(1000);
                        yield put({
                            type: 'SENDER_CONTENTS_API_SUCCESS',
                            data,
                            dataInputIdx,
                            apiType: 'POST',
                            workflowData: workflowData.workflow_data
                        });
                    }
                }
            }
        }
    } catch (error) {
        yield put({ type: 'SENDER_CONTENTS_API_FAILURE', error });
    }
}

function* wfFlagSaga(action) {
    const { apiForm } = action;
    try {
        let data;
        const wdData = yield call(Fetch, apiForm);
        if (!wdData || !wdData.status) {
            throw 'ERROR';
        } else {
            data = wdData;
        }
        yield put({ type: 'WF_FLAG_API_CALL_SUCCESS', data });
    } catch (error) {
        yield put({ type: 'WF_FLAG_API_CALL_FAILURE', error });
    }
}

export default function* rootSaga() {
    yield all([
        takeEvery('API_CALL_REQUEST', workerSaga),
        takeEvery('BOOKMARK_API_CALL_REQUEST', bookmarkSaga),
        takeEvery('AUD_API_CALL_REQUEST', audSaga),
        takeEvery('KAKAO_IMG_CALL_REQUEST', kakaoSaga),
        takeEvery('TITLE_API_REQUEST', titleSaga),
        takeEvery('WF_DATA_API_REQUEST', wdDataSaga),
        takeEvery('SENDER_CONTENTS_API_REQUEST', senderContentsSaga),
        takeEvery('WF_FLAG_API_CALL_REQUEST', wfFlagSaga)
    ]);
}
