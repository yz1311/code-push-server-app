import RequestUtils from "../utils/requestUtils";

export type userLoginRequest = RequestModel<{
    account: string,
    password: string,
    minutes?:number,
    serverPath: string  //本地字段，服务器地址
}>;

export type userInfoModel = {
    email: string,
    linkedProviders: Array<any>,  //返回的都是空的
    name: string,
};

export const userLogin = (data:userLoginRequest)=>{
    data.request.minutes = 43200;
    return RequestUtils.post(gServerPath+'auth/login',data.request);
}

export const getUserInfo = (data:RequestModel<{}>)=>{
    return RequestUtils.get<{account:userInfoModel}>(gServerPath+`account`);
}

export const checkEmailExists = (data:RequestModel<{email:string}>)=>{
    return RequestUtils.get(gServerPath+`/users/exists?email=${encodeURI(data.request.email)}`);
}


export const sendRegisterCode = (data:RequestModel<{email:string}>)=>{
    return RequestUtils.post(gServerPath+`users/registerCode`,data.request);
}

export const checkRegisterCodeExists = (data:RequestModel<{email:string,code:string}>)=>{
    return RequestUtils.get(gServerPath+`users/registerCode/exists?email=${encodeURI(data.request.email)}&token=${encodeURI(data.request.code)}`);
}

export const register = (data:RequestModel<{email:string,password:string,token:string}>)=>{
    return RequestUtils.post(gServerPath+`users`,data.request);
}

export const changePassword = (data:RequestModel<{oldPassword:string,newPassword:string}>)=>{
    return RequestUtils.patch(gServerPath+`users/password`,data.request);
}
