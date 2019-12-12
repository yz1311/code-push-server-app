//返回所有类型的deployment，不是历史
import RequestUtils from "../utils/requestUtils";
import {packageModel} from "./home";

export type getDeploymentsModel = {
    deployments: Array<deploymentModel>
};

export type deploymentModel = {
    createdTime: number,  //1561617700000
    id: string,   //"5"
    key: string,  //"kQaWAKGhsuEyXPKRayJX0KPTUsoo4ksvOXqog"
    name: string,   //"Production"
    package: packageModel
};

export type getDeploymentsHistoryModel =  {
    history: Array<packageModel>
}

export type getDeploymentsMetricsModel =  {
    metrics: {
        [key:string]: deploymentsMetricsModel
    }
}

export type deploymentsMetricsModel = {
    active: number,  //0
    downloaded: number,  //2
    failed: number,  //0
    installed: number,  //2
};

export const getDeployments = (data:RequestModel<{appName:string}>)=>{
    return RequestUtils.get<getDeploymentsModel>(gServerPath+`apps/${data.request.appName}/deployments`);
}

export const addDeployment = (data:RequestModel<{appName:string,name:string}>)=>{
    return RequestUtils.post<any>(gServerPath+`apps/${data.request.appName}/deployments`,data.request);
}

//修改deployment的名称
export const modifyDeployment = (data:RequestModel<{appName:string,deploymentName:string,name:string}>)=>{
    return RequestUtils.patch(gServerPath+`apps/${data.request.appName}/deployments/${data.request.deploymentName}`,data.request);
}

//删除deployment
export const deleteDeployment = (data:RequestModel<{appName:string,deploymentName:string}>)=>{
    return RequestUtils.delete(gServerPath+`apps/${data.request.appName}/deployments/${data.request.deploymentName}`);
}

export const getDeploymentStatusByName = (data:RequestModel<{appName:string,deploymentName:string}>)=>{
    return RequestUtils.get<{deployment:{isFulfilled:boolean,isRejected:boolean}}>(gServerPath+`apps/${data.request.appName}/deployments/${data.request.deploymentName}`);
}

//获取发布历史
export const getDeploymentsHistory = (data:RequestModel<{appName:string,deploymentName:string}>)=>{
    return RequestUtils.get<getDeploymentsHistoryModel>(gServerPath+`apps/${data.request.appName}/deployments/${data.request.deploymentName}/history`);
}

//删除全部的历史
export const deleteDeploymentsHistory = (data:RequestModel<{appName:string,deploymentName:string}>)=>{
    return RequestUtils.delete(gServerPath+`apps/${data.request.appName}/deployments/${data.request.deploymentName}/history`);
}

//但是没有总的数量
export const getDeploymentsMetrics = (data:RequestModel<{appName:string,deploymentName:string}>)=>{
    return RequestUtils.get<getDeploymentsMetricsModel>(gServerPath+`apps/${data.request.appName}/deployments/${data.request.deploymentName}/metrics`);
}
