import { actionTypes } from './index';

const initialState = {
    modal: {
        modalType: '',
        title: '',
        contents: '',
        Fn: {}
    },
    csvLoading: false,
    data: {},
    searchDate: {
        startDate: null,
        endDate: null
    }
};
const baseStore = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.CHANGEDATE:
            if (action) {
                console.log(action);
                return state;
            }
        case actionTypes.MODAL:
            if (action) {
                console.log(action);
                return state;
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
