import { Component } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import Lang from '@/lang/lang';
import { 
    renderQuestionContents,
    isFillQues,
    isSelectQues,
    getQuestionTypes,
    createArray,
    isSubjective,
    valueof
} from '@/utlis';
import './style.scss';
import RegMap from '@/common/regexp';
import { 
    IQuestionItem,
    QuestionNameMap
} from '@/interfaces/compose-viewer';
import { 
    InputType,
    ButtonType,
    ButtonSize,
    choicesBaseNum,
    Alphabet,
    INPUT_MODULE
} from '@/common/constants';
import { keyRenderClass } from '@/common/regexp/editor';
import { PreviewContentKey } from '@/interfaces';
import { CreateElement } from 'vue';
import { manager } from '@/store/composeViewer/question_manager'
import { send } from '@/store/composeViewer/question_input'
@Component({

})
export default class QuestionManage extends mixins(Lang) {
    async created(){
        var list:any =0
         await send.getCourse().then((res:any)=>{
         this.data.list =res.data.data.map((item:any)=>{
            return item.courseName;
        })
        })
    }
    mounted(){
        this.prewViewQuestionContent()
    }
    public questionData: IQuestionItem = {
        questionId: 0,
        questionTypeId: 0,
        courseId:  0,
        questionContentChoice: ['1','2','3','4'],
        questionScore: 1,
        questionDifficulty: 1,
        knowledgeIdList: [],
        abilityIdList: [],
        questionContent: '123213213',
        questionSubContent: [],
        questionContentSupplement: '',
        questionAnswer: ['aaaa'],
        questionAnswerSupplement: '',
        questionStatus: 1,
        questionOperatorId: 0,
        questionGmtUpdate: 0,
        questionUpdateTimes: 0,
        questionGmtLastUsed: 0,
        questionUsedTimes: 0,
    }
    public arrlist:any=[this.questionData,this.questionData]
    public data:any={
        currentPage:5,
        pagesize:[1],
        total:100,
        questionTypeId:0,
        list:[],
        show:true,
    }
    public getQuetionList(){
        var arr ={
            courseId:this.questionData.courseId,
            questionTypeId:this.questionData.questionTypeId,
            pageNumber:this.data.currentPage,
            pageSize:2
        }
        manager.getQuestionlist(arr).then((res:any)=>{
            this.questionData.questionContentChoice=res.data.data[0].optionList
            this.questionData.questionContent=res.data.data[0].questionContent
            this.questionData.questionContentSupplement=res.data.data[0].questionPicture
            this.questionData.questionAnswer=res.data.data[0].answer
            this.questionData.questionAnswerSupplement=res.data.data[0].answerPicture
            this.questionData.questionStatus=res.data.data[0].questionStatus
            if(res.data.data[0].questionStatus==0){
                this.data.show=false
            }else{
                this.data.show=true
            }
        })
    }
    public $refs!: {
        typesetElement: HTMLDivElement,
        type2: HTMLDivElement
    }
    public clearPreview() {
        console.log(this.$refs.typesetElement)
        Array.from(this.$refs.typesetElement.children).forEach(child => {
            child.innerHTML = '';
        })
    }
    public changetype(){
      this.getQuetionList()
      this.prewViewQuestionContent()
      console.log('bbb')
    }

    public arr_list(){
        return this.arrlist
    }
    public prewViewQuestionContent() {
        this.clearPreview();
        console.log('aaa')
        let content = '';
        const payload: any = {};
        const { questionTypeId: type, questionContent } = this.questionData;
        if(isFillQues(type)) {
            // 填空题替换 ？ 为 _____
            content = questionContent.replace(RegMap.fillBlankRules, '\\_\\_\\_\\_\\_\\_')
        }
        const { typesetElement } = this.$refs;
        const children = Array.from(typesetElement.children)
        const nodeKeyClass = children.map(child => {
            const key = (child.getAttribute('class') as string)
            .replace(keyRenderClass, (substring: string, ...args: any[]) => {
                return args[1];
            })
            return {
                key: (key as valueof<typeof PreviewContentKey>),
                node: child,
                content: isFillQues(type) && key === 'questionContent' ? content : this.questionData[key]
            }
        });
        renderQuestionContents({
            type,
            value: nodeKeyClass
        })
    }
    
    public handleSizeChange(){
        this.getQuetionList()
        this.prewViewQuestionContent()
        console.log('aaa')
    }
    public handleCurrentChange(){
        this.getQuetionList()
        this.prewViewQuestionContent()
        console.log('aaa')
    }
    public currentPage(){
        this.getQuetionList()
        return this.data.currentPage
    }
    public pagesizes(){
        return this.data.pagesize
    }
    public total(){
        return this.data.total
    }
    public renderCourseType() {
        return (
            <el-form-item label='课程选择'>
                <el-select 
                v-model={this.questionData.courseId}
                on={
                    {'change':this.changetype}
                }
                >
                   {
                        this.data.list.map((item:any) => (
                            <el-option 
                                label={item} 
                                value={item}>
                            </el-option>
                        ))
                   }
                </el-select>
            </el-form-item>
        )
    }
    public renderQuestionType() {
        return (
            <el-form-item label='题型选择'>
                <el-select 
                v-model={this.data.questionTypeId}
                on={{
                    'change':this.changetype
                }}
                >
                    {
                        [...getQuestionTypes()].map(questionTypeItem => (
                            <el-option 
                                label={questionTypeItem.name} 
                                value={questionTypeItem.id}>
                            </el-option>
                        ))
                    }
                </el-select>
            </el-form-item>
        )
    }
    public renderbutton(){
        if(this.data.show){
            return(
                <el-form-item >
                {
                    <div>
                       <el-button 
                                type={ButtonType.PRIMARY}
                                size={ButtonSize.MEDIUM}
                                onclick={() => {manager.stop(this.questionData.questionId)}}
                        >禁用题目</el-button>
                    </div>
                }
             </el-form-item>
            )
        }else{
            return(
                <el-form-item >
                {
                    <div>
                       <el-button 
                                type={ButtonType.PRIMARY}
                                size={ButtonSize.MEDIUM}
                                onclick={() => {manager.open(this.questionData.questionId)}}
                        >启用题目</el-button>
                    </div>
                }
             </el-form-item>
            )
        }
    }
    public renderlist(){
        return(
            <el-form-item >
               {
                   [...this.arr_list()].map(item=>(
                       <div>
                           <div>{item.questionContent}</div>
                           <div style='display:flex' v-show>
                               <div> A.{item.questionContentChoice[0]}</div>
                               <div>B.{item.questionContentChoice[1]}</div>
                           </div>
                           <div style='display:flex'>
                               <div>C.{item.questionContentChoice[2]}</div>
                               <div>D.{item.questionContentChoice[3]}</div>
                           </div>
                       </div>
                   ))
               }
            </el-form-item>
        )
    }
    public renderTest() {
        return(
            <el-form-item label='课程选择'>
                <el-select v-model={this.data.questionTypeId}>
                    {
                        [...getQuestionTypes()].map(questionTypeItem => (
                            <el-option 
                                label={questionTypeItem.name} 
                                value={questionTypeItem.id}>
                            </el-option>
                        ))
                    }
                </el-select>
            </el-form-item>
        )
    }
    public renderAll(){
        return[
            this.renderQuestionType(),
            this.renderCourseType(),
            this.renderbutton()
        ]
    }
    render(h: CreateElement) {
        return (
            <div>
                <div>question-manage</div>
                <div>
                <el-form class='editor-form'>
                            {
                                this.renderAll()
                            }
                </el-form>
                </div>
                <div>
                </div>
                <div class='preview__content' ref='typesetElement'>
                            {/* 题干 */}
                            <div class='preview__questionContent-content'></div>
                            {/* 选择题选项 */}
                            <div class='preview__questionContentChoice-content'></div>
                            {/* 小问（主观题） */}
                            <div class='preview__questionSubContent-content'></div>
                            {/* 试题内容补充（图片链接） */}
                            <div class='preview__questionContentSupplement-content'></div>
                            {/* 答案 */}
                            <div class='preview__questionAnswer-content'></div>
                            {/* 答案补充（图片链接） */}
                            <div class='preview__questionAnswerSupplement-content'></div>
                </div>
                <div class="block">
                    <el-pagination
                    on={{'size-change':this.handleSizeChange, 
                         'current-change':this.handleCurrentChange,
                        }}
                    current-page={this.currentPage()}
                    page-sizes={this.pagesizes()}
                    total={this.total()}
                    layout="total, sizes, prev, pager, next, jumper"
                    >
                    </el-pagination>
                </div>
                <div>
                <el-form class='editor-form'>
                            {
                                // this.renderlist()
                            }
                </el-form>
                </div>
            </div>
        )
    }
}