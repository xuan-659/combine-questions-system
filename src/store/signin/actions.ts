import {
    INFINITY_TIME,
    PERSONAL_CENTER_BASE_ROUTE,
    SESSION_ID_KEY
 } from '@/common/constants';
 import {
    IBindUserInfo,
    ILoginResponse,
    IForgotPwdData,
    IForgotPwdResponseData
} from '@/interfaces';
import Storage from '@/utlis/localStorage';
import AJAX from '@/utlis/ajax';
import { HTTPCODE } from '@/common/constants';
import { ISigninState } from './signin.interface';
import { IRootState } from './../rootState.interface';
import { ActionTree } from 'vuex';
import * as types from './mutationTypes';
import { personalFunctionList } from '@/common/mock/personal-center/function-list';
import personalViewer from '@/components/personal-center';
import { RouteConfig } from 'vue-router';
import router from '@/router'

const $http = new AJAX();
const $storage = new Storage();
//个人信息权限管理
const updateRoute:(roleId: (0 | 1)) => Array<RouteConfig> =  function(roleId) {
    return [{
    path: '/personal-center',
    redirect: () => {
      const defaultComponent = personalFunctionList.find(item => item.default);
      return PERSONAL_CENTER_BASE_ROUTE + defaultComponent?.path
    }, 
    component: personalViewer,
    children: personalFunctionList.filter((item: any) => {
        return item.roleId.includes(roleId)
    }).map((item): RouteConfig => {
      let res;
      if(item.children) {
        res = {
          path: item.path,
          component: item.component,
          children: item.children.map((child): RouteConfig => {
            return {
              path: child.path,
              component: child.component
            }
          }),
        }
      } else {
        res = {
          path: item.path,
          component: item.component,
        }
      }
      return res;
    })
  }]
}

export const actions: ActionTree<ISigninState, IRootState> = {
    handleInput(context, payload: { newModel: IBindUserInfo }) {
        context.commit(types.INPUT_USER_INFO, { 
            newModel: payload.newModel 
        })
    },

    /** 针对记住密码以后自动填充用户名密码时更新 state 里面的数据
     * 
     */
    autoFillUserInfo(context, payload: { userInfo: IBindUserInfo }) {
        context.commit(types.AUTO_FILL_USERINFO, {
            userInfo: payload.userInfo
        })
    },

    /** 处理登录
     *  @param {Object} payload 参数
     *  @param {IBindUserInfo} data 登录信息(用户名密码)
     */
    async handleUserLogin(context, payload: { data: IBindUserInfo }) {
        const { data } = payload;
        const res = await $http.post<ILoginResponse>('/user/login', {
            identityId: data.teacherId || data.administratorId,
            password: data.aPassword || data.tPassword
        });
        const { sessionId } = res.data.data;
        $storage.set(SESSION_ID_KEY, sessionId, INFINITY_TIME);
        if(res.status === HTTPCODE.SUCCESS) {
            // TODO: 处理跳转逻辑
            const res:any = await $http.get('/user/info');
            const roleId: any = res.data.data.roleId;
            console.log(roleId);
            router.addRoutes(updateRoute(roleId))
        }
    },

    /**
     * 处理用户修改密码
     * @param context 
     * @param payload 账号信息
     */
    async handleInfoSubmit(context, data: IForgotPwdData<string>) {
        return await $http.post<IForgotPwdResponseData>('/user/register', {
            password: data.password,
            phoneNumber: data.phone,
            smsCode: Number(data.authCode)
        });
    },

    /**
     * 发送短信验证码
     * @param context 
     * @param payload 参数对象，需要手机号
     */
    async handleSendCode(context, payload: { phoneNumber: string }) {
        const { phoneNumber } = payload;
        const res = await $http.post('/user/sms', {
            phoneNumber
        });
    }
}