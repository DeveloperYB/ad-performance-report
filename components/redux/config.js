import { createStore, combineReducers, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import baseStore from './reducer';
import rootSaga from '../saga';

const reducers = combineReducers({
    baseStore
});
const middlewares = new Array();
const sagaMiddleware = createSagaMiddleware();
middlewares.push(sagaMiddleware);

const store = createStore(reducers, applyMiddleware(...middlewares));
sagaMiddleware.run(rootSaga);
export default store;
