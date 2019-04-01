import { actionTypes } from './index';
import { Map, List, fromJS, removeIn, is } from 'immutable';
const initialState = fromJS({
    modal: {
        flag: false,
        title: '',
        contents: '',
        size: 'xs',
        Fn: {}
    },
    loading: { hoc: false },
    error: false,
    data: {}
});
const baseStore = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.IMGINPUTREADY:
            return state.set('imgInputReady', action.dom);
            break;
        case actionTypes.IMGINPUTQUE:
            if (action) {
                const { dom, url, origin } = action;
                return state
                    .setIn(['imgInputQue', dom], Map({ img_url: url, origin_url: origin }))
                    .set('imgInputReady', '');
            }
            break;
        case actionTypes.ERRORHANDLER:
            return state.set('error', action.flag);
            break;
        case actionTypes.MODAL:
            return state.set(
                'modal',
                Map({
                    flag: action.flag,
                    modalType: action.modalType,
                    title: action.title || '',
                    contents: action.contents || '',
                    size: action.size || 'xs',
                    Fn: Map(action.Fn || {})
                })
            );
            break;
        case actionTypes.API_CALL_REQUEST:
            if (action.dataInputTo.length) {
                return state
                    .setIn(['loading', 'hoc'], true)
                    .setIn(['loading'].concat(action.dataInputTo[0]), true)
                    .set('error', false);
            }
            return state.setIn(['loading', 'hoc'], true).set('error', false);
            break;
        case actionTypes.API_CALL_SUCCESS:
            if (action) {
                let reStateAPI;
                if (action.dataInputTo.length) {
                    reStateAPI = state
                        .setIn(['loading', 'hoc'], false)
                        .removeIn(['loading'].concat(action.dataInputTo[0]))
                        .set('error', false)
                        .setIn(
                            ['data'].concat(action.dataInputTo),
                            action.data && fromJS(action.data)
                        );
                } else {
                    reStateAPI = state
                        .setIn(['loading', 'hoc'], false)
                        .set('error', false)
                        .setIn(
                            ['data'].concat(action.dataInputTo),
                            action.data && fromJS(action.data)
                        );
                }
                if (action.modal) {
                    let {
                        flag = true,
                        modalType = '',
                        title = '',
                        contents = '',
                        size = 'xs',
                        Fn = {}
                    } = action.modal;
                    reStateAPI = reStateAPI.set(
                        'modal',
                        Map({
                            flag,
                            modalType,
                            title,
                            contents,
                            size,
                            Fn
                        })
                    );
                }
                return reStateAPI;
            }
            break;
        case actionTypes.API_CALL_FAILURE:
            if (action.dataInputTo.length) {
                return state
                    .setIn(['loading', 'hoc'], false)
                    .removeIn(['loading'].concat(action.dataInputTo[0]))
                    .set('error', true);
            }
            return state.setIn(['loading', 'hoc'], false).set('error', true);
            break;
        case actionTypes.BOOKMARK_API_CALL_REQUEST:
            if (action.dataInputTo.length) {
                return state
                    .setIn(['loading', 'hoc'], true)
                    .setIn(['loading'].concat(action.dataInputTo[0]), true)
                    .set('error', false);
            }
            return state.setIn(['loading', 'hoc'], true).set('error', false);
            break;
        case actionTypes.BOOKMARK_API_CALL_SUCCESS:
            if (action) {
                let reStateBookMark;
                reStateBookMark = state.setIn(['loading', 'hoc'], false).set('error', false);
                if (action.dataInputTo.length)
                    reStateBookMark = reStateBookMark.removeIn(
                        ['loading'].concat(action.dataInputTo[0])
                    );

                for (let idx = 0; idx < action.subInputTo.length; idx++) {
                    reStateBookMark = reStateBookMark.setIn(
                        ['data'].concat(action.dataInputTo).concat(action.subInputTo[idx]),
                        action.data[action.subInputTo[idx]] &&
                            fromJS(action.data[action.subInputTo[idx]])
                    );
                }

                if (action.modal) {
                    let {
                        flag = true,
                        modalType = '',
                        title = '',
                        contents = '',
                        size = 'xs',
                        Fn = {}
                    } = action.modal;
                    reStateBookMark = reStateBookMark.set(
                        'modal',
                        Map({
                            flag,
                            modalType,
                            title,
                            contents,
                            size,
                            Fn
                        })
                    );
                }
                return reStateBookMark;
            }
            break;
        case actionTypes.BOOKMARK_API_CALL_FAILURE:
            if (action.dataInputTo.length) {
                return state
                    .setIn(['loading', 'hoc'], false)
                    .removeIn(['loading'].concat(action.dataInputTo[0]))
                    .set('error', true);
            }
            return state.setIn(['loading', 'hoc'], false).set('error', true);
            break;

        case actionTypes.AUD_API_CALL_REQUEST:
            if (action.dataInputTo.length) {
                return state
                    .setIn(['loading', 'hoc'], true)
                    .setIn(['loading'].concat(action.dataInputTo[0]), true)
                    .set('error', false);
            }
            return state.setIn(['loading', 'hoc'], true).set('error', false);
            break;

        case actionTypes.KAKAO_IMG_CALL_REQUEST:
            if (action.dataInputTo.length) {
                return state
                    .setIn(['loading', 'hoc'], true)
                    .setIn(['loading'].concat(action.dataInputTo[0]), true)
                    .set('error', false);
            }
            return state.setIn(['loading', 'hoc'], true).set('error', false);
            break;
        case actionTypes.KAKAO_IMG_CALL_SUCCESS:
            if (action) {
                let reStateAPI;
                if (action.dataInputTo.length) {
                    reStateAPI = state
                        .setIn(['loading', 'hoc'], false)
                        .removeIn(['loading'].concat(action.dataInputTo[0]))
                        .set('error', false);
                } else {
                    reStateAPI = state.setIn(['loading', 'hoc'], false).set('error', false);
                }
                if (!action.data.img_url && action.data.message) {
                    let flag = true;
                    let modalType = 'error';
                    let title = '이미지 부적합';
                    let contents = action.data.message;
                    let size = 'xs';
                    let Fn = {};
                    reStateAPI = reStateAPI
                        .set(
                            'modal',
                            Map({
                                flag,
                                modalType,
                                title,
                                contents,
                                size,
                                Fn
                            })
                        )
                        .removeIn(['data'].concat(action.dataInputTo));
                } else {
                    reStateAPI = reStateAPI.setIn(
                        ['data'].concat(action.dataInputTo),
                        Map({
                            img_url: action.data.img_url,
                            origin_url: action.data.orign_url
                        })
                    );
                }
                return reStateAPI;
            }
            break;
        case actionTypes.KAKAO_IMG_CALL_FAILURE:
            if (action.dataInputTo.length) {
                return state
                    .setIn(['loading', 'hoc'], false)
                    .removeIn(['loading'].concat(action.dataInputTo[0]))
                    .set('error', true);
            }
            return state.setIn(['loading', 'hoc'], false).set('error', true);
            break;
        case actionTypes.TITLE_API_REQUEST:
            return state.setIn(['loading', 'hoc'], true).setIn(['loading', 'titleAPI'], true);
            break;
        case actionTypes.TITLE_API_SUCCESS:
            if (action) {
                const {
                    data: { ims_workflow_senders, workflow_data },
                    dataInputTo
                } = action;
                if (dataInputTo.length === 2) {
                    return state
                        .updateIn(['data'].concat(dataInputTo), arr => {
                            if (arr) {
                                return arr.push(fromJS(ims_workflow_senders));
                            } else {
                                return fromJS([ims_workflow_senders]);
                            }
                        })
                        .setIn(['data', 'ims_workflows', 'workflow_data'], workflow_data)
                        .setIn(['loading', 'hoc'], false)
                        .removeIn(['loading', 'titleAPI']);
                } else {
                    return state
                        .setIn(['data'].concat(dataInputTo), fromJS(ims_workflow_senders))
                        .setIn(['data', 'ims_workflows', 'workflow_data'], workflow_data)
                        .setIn(['loading', 'hoc'], false)
                        .removeIn(['loading', 'titleAPI']);
                }
            }
            break;
        case actionTypes.TITLE_API_FAILURE:
            if (action) {
                const method = action.apiForm.method;
                const flag = true;
                const modalType = 'error';
                const title = method === 'POST' ? '제목 저장 실패' : '제목 변경 실패';
                const contents =
                    method === 'POST'
                        ? '제목 저장을 실패하였습니다.'
                        : '제목 변경을 실패하였습니다.';
                const size = 'xs';
                const Fn = {};
                return state
                    .setIn(['loading', 'hoc'], false)
                    .removeIn(['loading', 'titleAPI'])
                    .set(
                        'modal',
                        Map({
                            flag,
                            modalType,
                            title,
                            contents,
                            size,
                            Fn
                        })
                    );
            }
            break;
        case actionTypes.WF_DATA_API_REQUEST:
            return state.setIn(['loading', 'hoc'], true).setIn(['loading', 'wfData'], true);
            break;
        case actionTypes.WF_DATA_API_SUCCESS:
            if (action) {
                const flag = true;
                const modalType = 'success';
                const title = '발송채널 정보 저장완료';
                const contents = '발송채널 정보를 저장하였습니다.';
                const size = 'xs';
                const Fn = {};
                const { data } = action;
                return state
                    .setIn(['data', 'ims_workflows', 'workflow_data'], data)
                    .setIn(['loading', 'hoc'], false)
                    .removeIn(['loading', 'wfData'])
                    .set(
                        'modal',
                        Map({
                            flag,
                            modalType,
                            title,
                            contents,
                            size,
                            Fn
                        })
                    );
            }
            break;
        case actionTypes.WF_DATA_API_FAILURE:
            if (action) {
                const flag = true;
                const modalType = 'error';
                const title = '발송채널 정보 저장 실패';
                const contents = '발송채널 정보 저장을 실패하였습니다.';
                const size = 'xs';
                const Fn = {};
                return state
                    .setIn(['loading', 'hoc'], false)
                    .removeIn(['loading', 'wfData'])
                    .set(
                        'modal',
                        Map({
                            flag,
                            modalType,
                            title,
                            contents,
                            size,
                            Fn
                        })
                    );
            }
            break;
        case actionTypes.SENDER_CONTENTS_API_REQUEST:
            return state
                .setIn(['loading', 'hoc'], true)
                .setIn(['loading', 'senderContentsData'], true);
            break;
        case actionTypes.SENDER_CONTENTS_API_SUCCESS:
            if (action) {
                const { data, dataInputIdx, apiType, workflowData } = action;
                const flag = true;
                const modalType = 'success';
                const title = `센더 컨탠츠 ${apiType === 'PUT' ? '변경 성공' : '저장 성공'}`;
                const contents = `센더 컨탠츠 정보를 ${
                    apiType === 'PUT' ? '변경 성공' : '저장 성공'
                }하였습니다.`;
                const size = 'xs';
                const Fn = {};
                let returnState = state
                    .setIn(['loading', 'hoc'], false)
                    .removeIn(['loading', 'senderContentsData'])
                    .set(
                        'modal',
                        Map({
                            flag,
                            modalType,
                            title,
                            contents,
                            size,
                            Fn
                        })
                    );

                if (apiType === 'PUT') {
                    returnState = returnState.setIn(
                        ['data', 'ims_workflows', 'ims_sender_contents', dataInputIdx],
                        fromJS(data)
                    );
                } else {
                    returnState = returnState.updateIn(
                        ['data', 'ims_workflows', 'ims_sender_contents'],
                        arr => {
                            if (arr) {
                                return arr.push(fromJS(data));
                            } else {
                                return fromJS([data]);
                            }
                        }
                    );

                    returnState = returnState.setIn(
                        ['data', 'ims_workflows', 'workflow_data'],
                        workflowData
                    );
                }
                return returnState;
            }
            break;
        case actionTypes.SENDER_CONTENTS_API_FAILURE:
            if (action) {
                const flag = true;
                const modalType = 'error';
                const title = '센더 컨탠츠 저장 실패';
                const contents = '컨탠츠 저장을 다시 시도해주세요.';
                const size = 'xs';
                const Fn = {};
                return state
                    .setIn(['loading', 'hoc'], false)
                    .removeIn(['loading', 'senderContentsData'])
                    .set(
                        'modal',
                        Map({
                            flag,
                            modalType,
                            title,
                            contents,
                            size,
                            Fn
                        })
                    );
            }
            break;
        case actionTypes.WF_FLAG_API_CALL_REQUEST:
            return state.setIn(['loading', 'hoc'], true).setIn(['loading', 'wfFlagApi'], true);
            break;
        case actionTypes.WF_FLAG_API_CALL_SUCCESS:
            if (action) {
                const { status, workflow_name } = action.data;

                const flag = true;
                const modalType = 'success';
                const title = `${status === 'active' ? '활성화' : '비활성화'} 성공`;
                const contents = `워크플로우 "${workflow_name}" ${
                    status === 'active' ? '활성화' : '비활성화'
                } 하였습니다.`;
                const size = 'xs';
                const Fn = {};
                return state
                    .setIn(['loading', 'hoc'], false)
                    .removeIn(['loading', 'wfFlagApi'])
                    .set(
                        'modal',
                        Map({
                            flag,
                            modalType,
                            title,
                            contents,
                            size,
                            Fn
                        })
                    )
                    .setIn(['data', 'ims_workflows', 'status'], status);
            }
            break;
        case actionTypes.WF_FLAG_API_CALL_FAILURE:
            if (action) {
                const flag = true;
                const modalType = 'error';
                const title = '활성화 여부 변경 실패';
                const contents = '워크플로우 활성화 여부 변경을 실패 하였습니다.';
                const size = 'xs';
                const Fn = {};
                return state
                    .setIn(['loading', 'hoc'], false)
                    .removeIn(['loading', 'wfFlagApi'])
                    .set(
                        'modal',
                        Map({
                            flag,
                            modalType,
                            title,
                            contents,
                            size,
                            Fn
                        })
                    );
            }
            break;
        default:
            return state;
    }
};
export default baseStore;
