import RequestUtils from "../utils/requestUtils";
import {userLoginRequest} from "./login";

export type accessKeyModel = {
    "name": string,   //"(hidden)",
    "createdTime": number,   //1573645145000,
    "createdBy": string,   //"ZhaodeMacBook-Pro.local",
    "expires": number,   //1576237145000,
    "friendlyName": string,   //"Login-1573645145464",
    "description": string,   //"Login-1573645145464"
};

export type addAccessKeyModel = {
    createdBy: string,
    friendlyName: string,
    ttl: number,
    description: string,
    isSession: boolean
};

export const getAccessKeys = (data:RequestModel<{}>)=>{
    return RequestUtils.get<{accessKeys:Array<accessKeyModel>}>(gServerPath+'accessKeys',data.request);
}

//就是创建token，给别人登录使用的
export const addAccessKey = (data:RequestModel<Partial<addAccessKeyModel>>)=>{
    // let time = (new Date()).getTime();
    // let friendlyName = `Login-${time}`;
    // let ttl = 30*2*24*60*60*1000;
    // let createdBy = friendlyName;
    // let isSession = true;
    return RequestUtils.post<{accessKey:accessKeyModel}>(gServerPath+`accessKeys`,data.request);
}

//是name，不是friendlyName
export const removeAccessKey = (data:RequestModel<{name: string}>)=>{
    return RequestUtils.delete<any>(gServerPath+`accessKeys/${encodeURI(data.request.name)}`);
}
