import { createStore, combineReducers, applyMiddleware } from 'redux';
import { logger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import baseStore from './reducer';
import rootSaga from '../saga';

const reducers = combineReducers({
    baseStore
});
const middlewares = new Array();
const sagaMiddleware = createSagaMiddleware();
middlewares.push(sagaMiddleware);
middlewares.push(logger);

const store = createStore(reducers, applyMiddleware(...middlewares));
sagaMiddleware.run(rootSaga);
export default store;
