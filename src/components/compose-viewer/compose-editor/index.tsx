import { CreateElement } from 'vue'
import { Component } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import Lang from '@/lang/lang';
import BaseEditor from './basicEditor';
import KnowledgeEditor from './knowledgeEditor';
import CapacityEditor from './capacityEditor';
import QuestionEditor from './questionEditor';
import EditorSwitch from './editorSwitch';
import {
    EditorIndexMap,
    EditorNameMap
} from '@/interfaces/compose-viewer';

import './style.scss'
import { editorSteps } from './mock/editor-steps';
import {
    NEXT_STEP,
    FINISH_EDIT
} from '@/common/constants/lang';
import ListTransfer from './listTransfer';
import { Action } from 'vuex-class';
import { ButtonSize, ButtonType } from '@/common/constants';

@Component({
    components: {
        BaseEditor,
        KnowledgeEditor,
        CapacityEditor,
        QuestionEditor,
        EditorSwitch,
        ListTransfer
    }
})
export default class ComposeEditor extends mixins(Lang) {

    public activeStep: number = 0;

    @Action('composeTestPaper')
    public composeTestPaper!: (data: any) => any

    @Action('downloadPaper')
    public downloadPaper!: (id: any) => any;

    public composeTestPaperData: any = {
        courseId: '',
        paperDifficulty: '',
        questionTypeList: [],
        abilityIdList: [],
        knowledgeIdList:[]
    }

    public paperList: any = [
        // {
        //     gmtCreate:"quis Lorem irure reprehenderit",
        //     gmtLastUse:"aliquip",
        //     gmtModified:"sint laboris magna Ut",
        //     paperCourseId:15,
        //     paperDifficulty:72,
        //     paperId:1,
        //     paperName:"验意解体总验",
        //     paperStatus:99,
        //     paperUsedTimes:239393957625,
        //     questionIdList:null,
        //     teacherName:"即干任里总都"

        // }
    ];

    public changeBasicData(data: any) {
        this.composeTestPaperData.courseId = Number(data.courseId),
        this.composeTestPaperData.paperDifficulty = Number(data.paperDifficulty)
    }

    public changeKnowledge(data: any) {
        this.composeTestPaperData.knowledgeIdList.push(...data)
    }

    public changeAbility(data: any) {
        this.composeTestPaperData.abilityIdList.push(...data)
    }

    public changeQuestionTypeList(data: any) {
        this.composeTestPaperData.questionTypeList = data
    }


    public readonly stepLength: number = 4;

    public get rightButtonText() {
        return this.activeStep === this.stepLength - 1 ? FINISH_EDIT : NEXT_STEP
    }

    public renderStepComponents(h: CreateElement) {
        const componentName: keyof typeof EditorIndexMap = (EditorIndexMap[this.activeStep] as keyof typeof EditorIndexMap);
        console.log(EditorNameMap[componentName]);
        return h(this.$options.components![componentName], {
            props: {
                title: EditorNameMap[componentName],
                composeTestPaperData: this.composeTestPaperData
            },
            on: {
                "changeBasicData": this.changeBasicData,
                "changeKnowledge": this.changeKnowledge,
                "changeAbility": this.changeAbility,
                "changeQuestionTypeList": this.changeQuestionTypeList
            }
        })
    }

    public handleNextStep() {
        this.activeStep++;
    }

    public handleLastStep() {
        this.activeStep--;
    }

    public handleFinishEdit() {
        this.activeStep = this.stepLength;
        setTimeout(async () => {
            await this.composeTestPaper(this.composeTestPaperData).then((res: any) => {
                console.log("试卷",res);
                
                if(res) {
                    this.paperList.push(...res);
                } else {
                    this.$message.error('组卷失败')
                }
                
            })
        }, 1000)
        
        
    }

    public renderEditorSwitchComponent(h: CreateElement) {
        return h(this.$options.components!['EditorSwitch'], {
            props: {
                activeIndex: this.activeStep,
                stepLength: this.stepLength,
                rightButtonText: this.rightButtonText
            },
            on: {
                handleNextStep: this.handleNextStep,
                handleFinishEdit: this.handleFinishEdit,
                handleLastStep: this.handleLastStep
            }
        })
    }

    public async download(id: any) {
        await this.downloadPaper(id).then((res: any) => {   
            console.log("试卷", res);
            
            // const {paperFileName, answerFileName} =  res;
            const paperFileName = res.paperFileName
            const answerFileName = res.answerFileName
            console.log(paperFileName, answerFileName);
        const a1 = document.createElement('a');
        a1.href =  paperFileName;
        a1.download = `试卷${id}.docx`;
        a1.style.display = "none";
        document.body.appendChild(a1);
        a1.click(); // 模拟点击了a标签，会触发a标签的href的读取，浏览器就会自动下载了
        a1.remove(); // 一次性的，用完就删除a标签
        const a2 = document.createElement('a');
        a2.href =  paperFileName;
        a2.download = `答案${id}.docx`;
        a2.style.display = "none";
        document.body.appendChild(a2);
        a2.click(); // 模拟点击了a标签，会触发a标签的href的读取，浏览器就会自动下载了
        a2.remove(); // 一次性的，用完就删除a标签
        })
        
        
    }

    public renderEditResult() {
        return (
            <div>
                {this.paperList?.map((item: any, index: any) => {
                return (<el-button
                    onclick={() =>this.download(item.paperId)}
                    type={ButtonType.PRIMARY} 
                >下载试卷{index + 1}</el-button>)
            })}
            </div>
            
        )
    }

    render(h: CreateElement) {
        return (
            <div class='compose-editor'>
                <div class='compose-editor__container'>
                    <div class='editor-steps'>
                        <div class='el-step__height-container'>
                            <el-steps 
                                direction="vertical" 
                                active={this.activeStep}
                                finish-status="success"
                            >
                                {
                                    editorSteps.map(step => {
                                        return (
                                            <el-step></el-step>
                                        )
                                    })
                                }
                            </el-steps>
                        </div>
                    </div>
                    <div class='editor-content'>
                        { this.renderStepComponents(h) }
                        {
                            this.activeStep !== this.stepLength
                            ? this.renderEditorSwitchComponent(h)
                            : this.renderEditResult()
                        }
                    </div>
                </div>
            </div>
        )
    }
}