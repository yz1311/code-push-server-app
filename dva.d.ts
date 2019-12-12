import { ReducersMapObject, Reducer, Dispatch, AnyAction, Action } from 'redux';

export interface EffectsCommandMap {
    put: <A extends Action>(action: A) => any;
    call: Function;
    select: Function;
    take: Function;
    cancel: Function;
    [key: string]: any;
}
// export type ActionWithPayload = { action: Action; payload: any; callback: Function };
export type Effect = (action: AnyAction, effects: EffectsCommandMap) => void;
export type EffectType = 'takeEvery' | 'takeLatest' | 'watcher' | 'throttle';
export type EffectWithType = [Effect, { type: EffectType }];
export interface EffectsMapObject {
    [key: string]: Effect | EffectWithType;
}

export interface ReducerEnhancer {
    (reducer: Reducer<any>): void;
}

// 使用redux-v4.x的ReducerMapObject会导致dva reducer中的action payload等参数无法确定类型（dva中使用的是3.x的redux）
// 这里从redux v3.x中找到了对应的ReducersMapObject以解决上述问题
export interface ReduxV3ReducersMapObject {
    [key: string]: Reducer<any>;
}

export type ReducersMapObjectWithEnhancer = [ReducersMapObject, ReducerEnhancer];

export interface SubscriptionAPI {
    dispatch: Dispatch<any>;
}
export type Subscription = (api: SubscriptionAPI, done: Function) => void;
export interface SubscriptionsMapObject {
    [key: string]: Subscription;
}

export default interface Model {
    namespace: string;
    state?: any;
    // reducers?: ReducersMapObject | ReducersMapObjectWithEnhancer;
    reducers?: ReduxV3ReducersMapObject | ReducersMapObjectWithEnhancer;
    effects?: EffectsMapObject;
    subscriptions?: SubscriptionsMapObject;
}
