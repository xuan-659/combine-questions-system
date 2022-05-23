import { INFINITY_TIME, SESSION_ID_KEY } from "@/common/constants";
import { IInformation, IUserInfoResponse } from "@/interfaces";
import AJAX from "@/utlis/ajax";
import { ActionTree } from "vuex";
import { IRootState } from "../rootState.interface";
import { IUserState } from "./personCenter.interface";
import  Storage from "@/utlis/localStorage"


const $http = new AJAX();
const $storage = new Storage();

export const actions: ActionTree<IUserState, IRootState> = {
    /** 获取用户信息
     * 
     * @param context 
     */
    async getUserInfo(context) {
        const res = await $http.get('/user/info');
        const data = <IUserInfoResponse>res.data;
        
        context.commit("GET_USER_INFO",{
            userInfo: data.data
        });
        console.log(res.data);
        
    },
    /** 修改用户信息
     * 
     * @param context 
     */
    async changeUserInfo(context, data:IInformation) {
        const pramas = {
            userName:data.userName,
            courseName:data.courseName
        }
        const res: any = await $http.post('/user/update/info', pramas);
        const sessionId = res.data.data
        $storage.set(SESSION_ID_KEY, sessionId, INFINITY_TIME);
        console.log(res);
    },

    /**
     * 
     * 获取课程信息
     */
    async getCourseInfo() {
        const res = await $http.get('/course/list')
        return res.data
        
    },
    /**
     * 获取所有用户信息
     */
    async getAllUser() {
        const res = await $http.get('/user/user-manage/find')
        return res.data
        
    },

    /** 创建用户
     * 
     * @param context 
     * @param userInfo 用户信息 
     * @returns 
     */
    async registUser(context, userInfo) {
        const res = await $http.post('/user/user-manage/register', userInfo)
        return res.status
        
    },

    /** 修改用户信息
     * 
     * @param context 
     * @param userInfo  用户信息 
     * @returns 
     */
    async changeUser(context, userInfo) {
        const res = await $http.post('/user/user-manage/update', userInfo)
        return res.status
    },

    /** 删除用户
     * 
     * @param context 
     * @param userInfo  用户信息 
     * @returns 
     */
     async deleteUser(context, userInfo) {
        const res = await $http.post('/user/user-manage/update', userInfo)
        return res.status
    },

    /** 创建课程
     * 
     * @param context 
     * @param courseInfo 课程信息 
     * @returns 
     */
     async createCourse(context, courseInfo) {
        const res = await $http.post('/course/course-manage/add', courseInfo)
        return res.status
        
    },

    /** 修改课程信息
     * 
     * @param context 
     * @param courseInfo  课程
     * @returns 
     */
    async changeCourse(context, courseInfo) {
        const res = await $http.post('/course/course-manage/update', courseInfo)
        return res.status
    },

    /** 删除课程
     * 
     * @param context 
     * @param courseInfo  课程信息 
     * @returns 
     */
     async deleteCourse(context, courseInfo) {
        const res = await $http.post('/user/user-manage/update', courseInfo)
        return res.status
    }
}

