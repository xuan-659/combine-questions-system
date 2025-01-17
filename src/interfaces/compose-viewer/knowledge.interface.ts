import {
    checkboxTableConfig,
    textTableConfig,
    inputTableConfig,
    cascaderTableConfig,
    selectTableConfig,
    IBaseInterface
} from '@/interfaces/common';

export interface IKnowledgeItem {
    // knowledgeId: number;
    content: string;
    // chapterList: Array<number>;
    // sectionList: number[] | number[][];
    courseId: number | Array<number>;
  
    importance: 1 | 2 | 3 | 4 | 5;
}//check用
export interface IKnowledgeItem1 {

    gmtCreate:null;
    gmtModified:null;
    knowledgeAbilityId:number;
    knowledgeContent:string;
    knowledgeCourseId:number;
    knowledgeId:number;
    knowledgeImportance:number;
    
    
    
   
}


export enum KnowledgeInputType {
    Single = 'single',
    Batch = 'batch'
}
//输出
export type KnowledegTableCheck=[
    checkboxTableConfig,
    // textTableConfig,
    textTableConfig,
    textTableConfig,
    textTableConfig,
    textTableConfig
]
/**
 * 采用元组的形式对不同界面的 inputTable 的 config 进行强制的类型限制
 */
//输入
export type KnowledgeTableConfig = [
    checkboxTableConfig,
  //  textTableConfig,
    inputTableConfig,
    inputTableConfig,
    
]

// export interface IKnowledge {
//     knowledgeInfo: IKnowledgeItem1
// }
export interface compose{
    knowledgeInfo: IKnowledgeItem1
}
