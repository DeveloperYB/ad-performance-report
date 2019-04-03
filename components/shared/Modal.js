import React from 'react';
import { connect } from 'react-redux';
import { actions } from '../../components/redux';
import styled from 'styled-components';

const ModalContainer = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 11;
    .bg {
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.3);
    }
    .modalContents {
        position: absolute;
        top: 50%;
        left: 50%;
        background: #fff;
        transform: translate(-50%, -50%);
        width: 300px;
        border: 2px solid #00a47b;
        border-radius: 5px;
        .titleWrap {
            position: relative;
            padding: 10px;
            background: #00a47b;
            color: #fff;
            text-align: center;
            .icon {
                font-size: 3em;
            }
            .tit {
                margin-top: 10px;
            }
            .cancelBtn {
                position: absolute;
                top: 5px;
                right: 5px;
                cursor: pointer;
                &:hover {
                    color: #ccc;
                }
            }
        }
        .contents {
            padding: 10px;
            text-align: center;
        }
        .btns {
            overflow: hidden;
            padding: 10px 0;
            > div {
                float: right;
                cursor: pointer;
                margin: 0 5px;
                padding: 0 15px;
                background: #00a47b;
                border: 1px solid #00a47b;
                font-size: 0.7em;
                text-align: center;
                color: #fff;
                line-height: 2;
                margin-top: 10px;
                cursor: pointer;
                border-radius: 5px;
                &.cancel {
                    color: #00a47b;
                    background: #fff;
                }
            }
        }
    }
`;

const Modal = props => {
    const {
        modal: {
            modalType,
            title,
            contents,
            Fn: { cancel, confirm }
        },
        modalFlag
    } = props;
    return (
        <ModalContainer modalType={modalType}>
            <div
                className="bg"
                onClick={
                    cancel
                        ? cancel
                        : () => {
                              //modalType, title, contents, Fn
                              modalFlag('', '', '', {
                                  cancel: null,
                                  confirm: null
                              });
                          }
                }
            />
            <div className="modalContents">
                <div className="titleWrap">
                    <div className="icon">
                        {modalType === 'que' ? (
                            <i className="far fa-question-circle" />
                        ) : modalType === 'err' ? (
                            <i className="fas fa-exclamation-triangle" />
                        ) : (
                            modalType === 'suc' && <i className="far fa-check-circle" />
                        )}
                    </div>
                    <div className="tit">{title}</div>
                    <div
                        className="cancelBtn"
                        onClick={
                            cancel
                                ? cancel
                                : () => {
                                      //modalType, title, contents, Fn
                                      modalFlag('', '', '', {
                                          cancel: null,
                                          confirm: null
                                      });
                                  }
                        }
                    >
                        <i className="fas fa-times" />
                    </div>
                </div>
                <div className="contents">{contents}</div>
                <div className="btns">
                    {cancel && (
                        <div className="cancel" onClick={cancel}>
                            취소
                        </div>
                    )}
                    {(confirm || (cancel === null && confirm === null)) && (
                        <div
                            className="confirm"
                            onClick={
                                confirm
                                    ? confirm
                                    : () => {
                                          //modalType, title, contents, Fn
                                          modalFlag('', '', '', {
                                              cancel: null,
                                              confirm: null
                                          });
                                      }
                            }
                        >
                            확인
                        </div>
                    )}
                </div>
            </div>
        </ModalContainer>
    );
};
const mapStateToProps = state => {
    const { modal } = state.baseStore;
    return {
        modal
    };
};
const mapDispatchProps = dispatch => {
    return {
        modalFlag: (modalType, title, contents, Fn) => {
            dispatch(actions.MODAL(modalType, title, contents, Fn));
        }
    };
};
export default connect(
    mapStateToProps,
    mapDispatchProps
)(Modal);
