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
    }
};

//2018/12/30 ~ 2019/01/29

const baseStore = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.CHANGEDATE:
            if (action.flag === 'start') {
                return { ...state, searchDate: { ...state.searchDate, startDate: action.date } };
            } else if (action.flag === 'end') {
                return { ...state, searchDate: { ...state.searchDate, endDate: action.date } };
            } else {
                return { ...state, searchDate: { startDate: action.date, endDate: null } };
            }
        case actionTypes.MODAL:
            if (action) {
                const { modalType, title, contents, Fn } = action;
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
        case actionTypes.API_CALL_REQUEST:
            if (action) {
                console.log(action);
                return state;
            }
            break;
        case actionTypes.API_CALL_SUCCESS:
            if (action) {
                console.log(action);
                return state;
            }
            break;
        case actionTypes.API_CALL_FAILURE:
            if (action) {
                console.log(action);
                return state;
            }
            break;
        default:
            return state;
    }
};
export default baseStore;
