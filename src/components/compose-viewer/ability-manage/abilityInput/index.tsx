import { Component, Prop, Watch } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import InputTable from '@/components/common/inputTable';
import Lang from '@/lang/lang';
import { ColumnTemType, ITableConfig, ISelectItem } from '@/interfaces/common';
import { ButtonType, INPUT_MODULE, SUBMIT } from '@/common/constants';
import { AbilityinputType, AbilityTableConfig, AbilityType, IAbilityItem, KnowType, RelatedKnowledgeItem } from '@/interfaces/compose-viewer/ability.interface';
import './style.scss';
import { AbilityRules } from '@/common/rules/compose-viewer/ability-manage';
import { ICourseItem } from '@/interfaces/compose-viewer/course.interface';
import { deepclone } from '@/utlis';
import KnowledgeCheck from '../../knowledge-manage/knowledegCheck';
import { IKnowledgeItem1, KnowledgeInputType } from '@/interfaces/compose-viewer/knowledge.interface';
import { Action } from 'vuex-class';

const {
    INPUT_ABILITY,
    INPUT_ABILITY_CONTENT,
    RELATED_KNOWLEDGE,
    SELECT_ABILITY_TYPE,
    SELECT_ABILITY_COURSE,
    SELECT_RELATEDKNOWLEDGE
} = INPUT_MODULE;

@Component({
    components: {
        InputTable
    }
})
export default class AbilityInput extends mixins(Lang) {
    @Action('submitAbilityData')
    public submitBathcAbilityData!: (payload: { courseId:number, abilityItem: IAbilityItem }) => Promise<boolean>;
    @Prop()
    public knowledgeList!:IKnowledgeItem1[];

    @Watch('courseId')
    courseChanged(newVal: number) {
     //    this.courseId = newVal
    //  console.log("jj");
     
     this.changeKnowledgeTable().then(()=>{
        // this.$forceUpdate()
    
    });
     }
 
    @Action('getCourseInfo')
    private getCourseInfo!: () => any;

    @Action('getKnowledgeData')
    private getKnowledgeData!: (courseid:number) => any;

    public batchKownledgeOptions: ISelectItem[] = [];


    @Prop()
     public courseId!: number;
    //关联知识点
    public relatedKnowledgeData:IKnowledgeItem1[]=[
        // {
        //     id:0,
        //     content: "h1"
        // },
        // {
        //     id:1,
        //     content: "h2"
        // },
        // {
        //     id:2,
        //     content: "h3"
        // }
    ];
    // public knowList:KnowType[]=[];///
    //知识点数组，应在mount函数中初始化
    public courseData:ICourseItem[]=[
   
    ];
    public tableConfig: AbilityTableConfig = [
        {
            type: ColumnTemType.CHECKBOX,
            prop: 'isCheck',
            propInit: false,
            name: ''
        },
        // {
        //     type: ColumnTemType.TEXT,
        //     prop: 'id',
        //     propInit: 1,
        //     name: '序号'
        // },
        {
            type: ColumnTemType.INPUT,
            prop: 'content',
            propInit: '',
            name: '能力点内容',
            placeholder: INPUT_ABILITY,
        },
        {
            type: ColumnTemType.SELECT,
            prop: 'relaterKnowledge',
            propInit: [],//可多选
            name: '关联知识点',
            placeholder: RELATED_KNOWLEDGE,
            // selectOptions: {
            //     multiple: false
            // },
            selectData: this.scaleKnowledgeKeys(this.relatedKnowledgeData)
        },
        {
            type: ColumnTemType.INPUT,
            prop: 'importance',
            propInit: '',
            name: '能力点重要程度',
            placeholder: '',
        }
    ]
    // singleAbilityData: any;
    public singleAbilityData: IAbilityItem = {
        content: "",
    importance:1,
    relatedKnowledgeId:[],
    // courseId:this.courseId
    }
   

      //加载课程
   public  async created() {
     
    await this.getCourseInfo().then((res:any) => {
       
        const data:ICourseItem[] = Array.from(res.data)
        // this.CourseInfo.CourseInfo = res
            this.courseData.push(...data)
            // console.log(this.courseData);
        // console.log("coursedata:",res[0]);
        
    })
    
}
public async changeKnowledgeTable(){
    // this.$forceUpdate()
    await this.getKnowledgeData(this.courseId).then((res:any) => {

    // console.log("knowlist:",this.knowledgeList);
    
        this.relatedKnowledgeData = Array.from(res.data)

        console.log(this.relatedKnowledgeData);
    }) 
}

    
    public scaleKnowledgeKeys(data:IKnowledgeItem1[]): ISelectItem[] {
        const copy = deepclone<typeof data>(data);
        if(!copy.length) {
            return [];
        }
       
            return (copy as IKnowledgeItem1[]).map((knowledge: IKnowledgeItem1) => {
                return {
                    value: knowledge.knowledgeId,
                    label: knowledge.knowledgeContent,
                    // children: this.scaleKnowledgeKeys(chapter.sections)
                }
            });
      
    }

    
    public async handleSubmitSingle() {
        // this.singleAbilityData.sectionList = this.cascaderData.map(item => item[1]);
        // TODO: 提交单个知识点
        console.log("hhh",this.singleAbilityData);
        
       await this.submitBathcAbilityData({
           courseId:this.courseId,
            abilityItem: this.singleAbilityData
        }).then(()=>{
                 alert("录入成功")
                 location.reload()
                //  this.$forceUpdate()
        })
        
        
           
        
    }
    // public async handleSubmitSingle() {
    //     const validateRes = await validateInput(this.singleKonwledgeData, KnowledgeRules, 0)
    //     if(typeof validateRes === 'object') {
    //         this.$message.error('输入数据有误')
    //     } else {
    //         this.submitKnowledgeData({
    //             knowledgeList: [this.singleKonwledgeData]
    //         })
    //     }
    // }

    public mounted() {
        // for(let item in this.knowList) {
        //     const isValue = parseInt(item, 10) >= 0;
        //     if(isValue) {
        //         this.abilityTypeSelectList.push({
        //             id: parseInt(item),
        //             label: this.knowList[item].content,
        //             value: parseInt(item)
        //         })
        //     }
        // }
    }

    // public getCascaderData(tableConfig: ITableConfig, rowData: any, index: number) {
    //     const { link } = tableConfig;
    //     if(link) {
    //         const linkData = rowData[link];
    //         const chapterData = chapterMockData.filter(chapter => {
    //             if(linkData.indexOf(chapter.chapterId) !== -1) {
    //                 return chapter;
    //             }
    //         });
    //         const res = this.scaleChapterKeys(chapterData);
    //         // 在 batchCascaderOptions 对应下标位置插入改变过字段的数据
    //         this.batchCascaderOptions.splice(index, 0, res);
    //     }
    // }

    public render() {
        return (
            <div class='knowledge-input'>
          
                    <el-form
                        label-width='120px'
                        label-position='right'
                    >
                        <el-form-item 
                            label={this.t(SELECT_ABILITY_COURSE)}
                        >
                            <el-select 
                                v-model={this.courseId}
                                placeholder={this.t(SELECT_ABILITY_COURSE)}
                            >
                                {/* <el-option label='计算机通信与网络' value={0}></el-option> */}
                                {
                            this.courseData.map((option:any,index:number)=>{
                                return(
                                    <el-option 
                                    key={index}
                                    label={option.courseName}
                                    value={option.courseId}
                                    ></el-option>
                                )
                            })
                        }
                            </el-select>
                        </el-form-item>
                        <el-form-item  
                            label={this.t(INPUT_ABILITY_CONTENT)}
                        >
                            <el-input
                                v-model={this.singleAbilityData.content}
                                placeholder={this.t(INPUT_ABILITY_CONTENT)}
                            />
                        </el-form-item>
                        <el-form-item label={this.t(SELECT_RELATEDKNOWLEDGE)}>
                            <el-select
                                class='multiple-select'
                                v-model={this.singleAbilityData.relatedKnowledgeId}
                                multiple
                            >
                                {
                                    this.relatedKnowledgeData.map(knowledge => (
                                        <el-option
                                            label={knowledge.knowledgeContent}
                                            value={knowledge.knowledgeId}
                                            key={knowledge.knowledgeId}
                                        />
                                    ))
                                }
                            </el-select>
                        </el-form-item>
                       
                        <el-form-item class='el-form-item__rate' label='知识点重要程度'>
                            <el-rate v-model={this.singleAbilityData.importance }></el-rate>
                            <el-tooltip effect="dark" content='默认重要程度为1颗星' placement="top-end">
                                <i class='iconfont icon-tishi'></i>
                            </el-tooltip>
                        </el-form-item>
                        <el-form-item class='el-form-item__button'>
                            <el-button 
                                onclick={this.handleSubmitSingle}
                                type={ButtonType.PRIMARY}
                            >{this.t(SUBMIT)}</el-button>
                        </el-form-item>
                    </el-form>
               
                </div>
        )
    }
}

