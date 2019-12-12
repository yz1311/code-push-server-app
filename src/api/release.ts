import RequestUtils from "../utils/requestUtils";
import {userInfoModel} from "./login";
import {packageModel} from "./home";

export enum ReleaseMethods  {
    RELEAS_EMETHOD_PROMOTE = 'Promote',
    RELEAS_EMETHOD_UPLOAD = 'Upload',
    //通过回滚发布的
    RELEAS_EMETHOD_ROLLBACK = 'Rollback',
}

export enum DeploymentStatus {
    DEPLOYMENT_SUCCEEDED = 1,
    DEPLOYMENT_FAILED = 1,
}

export type modifyPackageModel = Pick<packageModel, "label">&Partial<
    Pick<packageModel, "appVersion">
    &Pick<packageModel, "description">
    &Pick<packageModel, "isMandatory">
    &Pick<packageModel, "isDisabled">
    &Pick<packageModel, "rollout">>;

//修改已发布的release
export const modifyRelease = (data:RequestModel<{appName:string,deploymentName:string,packageInfo:modifyPackageModel }>)=>{
    return RequestUtils.patch(gServerPath+`${data.request.appName}/deployments/${data.request.deploymentName}/release`,data.request);
}

/**
 * 回滚package
 * 如果label为空，会查找最近的可回滚包(releaseMethod为RELEAS_EMETHOD_UPLOAD或者RELEAS_EMETHOD_PROMOTE)进行回滚操作
 * @param data
 */
export const rollbackRelease = (data:RequestModel<{appName:string,deploymentName:string,label?:string }>)=>{
    return RequestUtils.post(gServerPath+`apps/${data.request.appName}/deployments/${data.request.deploymentName}/rollback${data.request.label?('/'+data.request.label):''}`,data.request);
}
