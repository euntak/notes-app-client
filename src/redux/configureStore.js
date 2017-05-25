import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from './reducers';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger'

const loggerMiddleware = createLogger();

export default function configureStore() {
    return createStore(
        rootReducer,
        compose(
            applyMiddleware(
                thunkMiddleware,
                loggerMiddleware,
            ),
            window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
        )
    );
}