import { actionTypes } from './index';

const initialState = {
    modal: {
        modalType: '', //que , err , suc
        title: '',
        contents: '',
        Fn: {
            cancel: null,
            confirm: null
        }
    },
    csvLoading: false,
    data: {},
    searchDate: {
        startDate: null,
        endDate: null
    },
    singleDate: false
};

//2018/12/30 ~ 2019/01/29

const baseStore = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SINGLEDATE:
            return { ...state, singleDate: action.flag };
            break;
        case actionTypes.CHANGEDATE:
            if (action.flag === 'start') {
                return { ...state, searchDate: { ...state.searchDate, startDate: action.date } };
            } else if (action.flag === 'end') {
                return { ...state, searchDate: { ...state.searchDate, endDate: action.date } };
            } else {
                return { ...state, searchDate: { startDate: action.date, endDate: null } };
            }
            break;
        case actionTypes.MODAL:
            if (action) {
                const {
                    modalType,
                    title,
                    contents,
                    Fn = {
                        cancel: null,
                        confirm: null
                    }
                } = action;
                return {
                    ...state,
                    modal: {
                        ...state.modal,
                        modalType,
                        title,
                        contents,
                        Fn
                    }
                };
            }
            break;
        case actionTypes.CSV_CALL_REQUEST:
            if (action) {
                return {
                    ...state,
                    data: {},
                    csvLoading: true
                };
            }
            break;
        case actionTypes.CSV_CALL_SUCCESS:
            if (action) {
                const { noData } = action.data;
                if (!noData) {
                    return {
                        ...state,
                        csvLoading: false,
                        data: action.data
                    };
                }
                return {
                    ...state,
                    csvLoading: false,
                    data: {},
                    modal: {
                        modalType: 'err', //que , err , suc
                        title: 'Non Data',
                        contents: '정보가 없습니다.',
                        Fn: {
                            cancel: null,
                            confirm: null
                        }
                    }
                };
            }
            break;
        case actionTypes.CSV_CALL_FAILURE:
            if (action) {
                return {
                    ...state,
                    csvLoading: false,
                    data: {},
                    modal: {
                        modalType: 'err', //que , err , suc
                        title: 'API ERROR',
                        contents: '재시도 부탁드립니다.',
                        Fn: {
                            cancel: null,
                            confirm: null
                        }
                    }
                };
            }
            break;
        default:
            return state;
    }
};
export default baseStore;
