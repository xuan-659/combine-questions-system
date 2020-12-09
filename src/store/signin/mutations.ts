import { 
    IUserInfo as IUserState,
    IBaseInfo,
    ITeacherInfo, 
    IStudentInfo 
} from '@/interfaces';
import { MutationTree } from 'vuex';
import * as types from './mutationTypes';

export const mutations: MutationTree<IUserState> = {
    [types.INPUT_USER_INFO](state, payload: { newModel: ITeacherInfo | IStudentInfo }) {
        const { newModel } = payload;
        if(newModel && newModel.hasOwnProperty('employeeId')) {
            state.teacherInfo = newModel as ITeacherInfo;
        } else {
            state.studentInfo = newModel as IStudentInfo;
        }
    },
    [types.AUTO_FILL_USERINFO](state, payload: { userInfo: ITeacherInfo | IStudentInfo }) {
        const { userInfo } = payload;
        if(userInfo && userInfo.hasOwnProperty('employeeId')) {
            state.teacherInfo = userInfo as ITeacherInfo;
        } else {
            state.studentInfo = userInfo as IStudentInfo;
        }
    }
}