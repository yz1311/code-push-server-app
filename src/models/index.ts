import app,{IState as appState} from './app';
import test from "./test";
import loginIndex,{IState as loginIndexState} from './loginIndex';


export type ReduxState = {
    app: appState,
    loginIndex: loginIndexState,
};

export default [
    test,
    app,
    loginIndex,
]
