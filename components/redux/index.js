export const actionTypes = {
    CSV_CALL_REQUEST: 'CSV_CALL_REQUEST',
    CSV_CALL_SUCCESS: 'CSV_CALL_SUCCESS',
    CSV_CALL_FAILURE: 'CSV_CALL_FAILURE',
    MODAL: 'MODAL'
};

export const actions = {
    MODAL: (modalType, title, contents, Fn) => ({
        type: actionTypes.MODAL,
        modalType,
        title,
        contents,
        Fn
    })
};
