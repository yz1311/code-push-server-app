import RequestUtils from "../utils/requestUtils";
import {ReleaseMethods} from "./release";

export type getProductsModel = {
    apps: Array<productModel>
};

export type productModel = {
    collaborators: collaboratorsModel,
    deployments: Array<string>,  //"Production"  "Staging"
    id: number,   //1
    name: string,   //"ych_android"
    os: string,   //"Android"
    platform: string,   //"React-Native"
    collect?: boolean,  //是否收藏，本地新增字段
};

export type collaboratorsModel = {
    [key:string]: {
        isCurrentAccount: boolean,   //true
        permission: string,   //"Owner"
    }
};

export type parsedCollaboratorsModel = {
    name: string,
    isCurrentAccount: boolean,   //true
    permission: string,   //"Owner"
};

export type packageModel = {
    appVersion: string,   //"1.5.0"
    blobUrl: string,   //"https://codepush.zhaoyang.info/download/lv/lvBGDXAgjEsl6aXCZ1zf4fJiqD_w"
    description: string,   //"{"description":"2019/11/02-1 1.货盘添加已定船功能，订单详情添加船合同价","isSilent":false}"
    diffPackageMap: string,   //null
    isDisabled: boolean,   //false
    isMandatory: boolean,   //false
    label: string,   //"v12"
    manifestBlobUrl: string,   //"https://codepush.zhaoyang.info/download/fh/FhJZ50zMv6RpekiL-XWPOwEHrfwF"
    originalDeployment: string,   //""
    originalLabel: string,   //""
    packageHash: string,   //"9dafb11ba87a4a885d47852ece1ebd44fa448817ba450330e8a565a8ce8b2f87"
    releaseMethod: ReleaseMethods,   //"Upload"
    releasedBy: string,   //"lisong2010@gmail.com"
    rollout: number,  //100
    size: number,  4348602
    uploadTime: number,  1572707459000
};

export const getProducts = (data:RequestModel<{}>)=>{
    return RequestUtils.get<getProductsModel>(gServerPath+'apps',data.request);
}

export const addProduct = (data:RequestModel<{name:string,os:string,platform:string}>)=>{
    return RequestUtils.post<getProductsModel>(gServerPath+'apps',data.request);
}

//获取参与者
export const listCollaborators = (data:RequestModel<{appName:string}>)=>{
    return RequestUtils.get<{collaborators: collaboratorsModel }>(gServerPath+`apps/${data.request.appName}/collaborators`);
}

//添加参与者
export const addCollaborator = (data:RequestModel<{appName:string,email:string}>)=>{
    return RequestUtils.post(gServerPath+`apps/${data.request.appName}/collaborators/${encodeURI(data.request.email)}`);
}

//删除参与者
export const deleteCollaborator = (data:RequestModel<{appName:string,email:string}>)=>{
    return RequestUtils.delete(gServerPath+`apps/${data.request.appName}/collaborators/${encodeURI(data.request.email)}`);
}

//删除app
export const deleteApp = (data:RequestModel<{appName:string}>)=>{
    return RequestUtils.delete(gServerPath+`apps/${data.request.appName}`);
}

//修改app名称
export const modifyApp = (data:RequestModel<{appName:string,name:string}>)=>{
    return RequestUtils.patch(gServerPath+`apps/${data.request.appName}`,data.request);
}

export const transferApp = (data:RequestModel<{appName:string,email:string}>)=>{
    return RequestUtils.post(gServerPath+`apps/${data.request.appName}/transfer/${encodeURI(data.request.email)}`);
}
