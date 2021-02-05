export interface IKnowledgeItem {
    knowledgeId: number;
    content: string;
    chapterList: Array<number>;
    sectionList: Array<number>;
    courseId: Array<number>;
    importance: 1 | 2 | 3 | 4 | 5;
}

export type BatchKnowledgeItem = Omit<IKnowledgeItem, 'courseId'>;