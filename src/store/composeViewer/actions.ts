import { IAbilityItem, IBatchAbilityItem } from './../../interfaces/compose-viewer/ability.interface';
import { IComposeState } from './compose.interface';
import { IKnowledgeItem } from './../../interfaces/compose-viewer/knowledge.interface';
import AJAX from '@/utlis/ajax';
import { ActionTree } from 'vuex';
import { HTTPCODE } from '@/common/constants';
import { IRootState } from './../rootState.interface';
import * as types from './mutationTypes';
import AbilityCheck from '@/components/compose-viewer/ability-manage/abilityCheck';

const $http = new AJAX();

export const actions: ActionTree<IComposeState, IRootState> = {
    async submitKnowledgeData(context, payload: { courseId: number, knowledgeList: Array<IKnowledgeItem> }) {
        // 知识点录入
        const { courseId, knowledgeList } = payload;

        const data = knowledgeList.map(knowledgeItem => (
            {
                knowledgeCourseId: courseId,
                knowledgeContent: knowledgeItem.content,
                // parentIdCollection: knowledgeItem.chapterList,
                // childrenIdCollection: knowledgeItem.sectionList,
                knowledgeImportance: knowledgeItem.importance
            }
        ))
        const res = await $http.post('/knowledge/save', data)
        console.log("data:",data);
        // console.log("jjjjjjjjjjjjj");
        console.log("res",res);
        
        return true;
    },
    async submitAbilityData(context, payload: { courseId:number,abilityItem: IAbilityItem }) {
        // 能力点录入
      
        const { courseId, abilityItem } = payload;

        const data =
            {
                abilityCourseId: courseId,
                abilityContent: abilityItem.content,
                // parentIdCollection: knowledgeItem.chapterList,
                // childrenIdCollection: knowledgeItem.sectionList,
                abilityImportance:abilityItem.importance,
                knowledgeVOList:abilityItem.relatedKnowledgeId.map(kId=>(
                    {
                        knowledgeId:kId
                    }
                ))
            }
        console.log("dataaa:",data);
        
        const res = await $http.post('/ability/save',data)
      
        
        console.log("res",res);
        return res.status
     
    },
  
    async getKnowledgeData(context,courseId:number){
        
       
        const  res=await $http.get('/knowledge/listByCourseId?courseId='+courseId)
        console.log("knowledgedata：",res);
        return res.data
        
    },
    async getAbilityData(context,courseId:number){
        const  res=await $http.get('/ability/listByCourseId?courseId='+courseId)
        console.log("abilitydata：",res);
        return res.data
        
    },
    async deleteKnowledge(context,knowledgeId:number[]){
        const res = await $http.post('/knowledge/remove',knowledgeId)
        console.log("knowledgeId",knowledgeId);
        console.log("res",res);
        return res
    },
    async deleteAbility(context,Array:number[]){
        const res = await $http.post('/ability/remove',Array)
        console.log("knowledgeId",Array);
        console.log("res",res);
        return res
    },
}
