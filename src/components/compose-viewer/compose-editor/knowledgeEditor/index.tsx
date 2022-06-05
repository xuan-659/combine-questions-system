import { Component, Emit, Prop } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import Lang from '@/lang/lang';
import { EditorIndexMap } from '@/interfaces/compose-viewer';
import './style.scss'
import { Action } from 'vuex-class';

@Component({

})
export default class KnowledgeEditor extends mixins(Lang) {

    @Action('getKnowledgeData')
    getKnowledgeData!: (courseId:number) => any

    @Emit("changeKnowledge")
    public changeKnowledge() {
        return this.selected;
    }

    public selected = []

    public knowledgeData: any = []
    async created() {
        await this.getKnowledgeData( this.composeTestPaperData.courseId).then((res: any) => {
            console.log(res);
            this.knowledgeData.push(...res.data.map((item: any) => {
                return {
                    label: item.knowledgeContent,
                    key: item.knowledgeId
                }    
            }))
        })
        
        
    }

    beforeDestroy() {
        this.changeKnowledge()
        console.log("数据",this.selected);
        
    }


    filterMethod(query: any, item: any) {
        return item.label.indexOf(query) > -1;
    }

    @Prop()
    public title!: keyof typeof EditorIndexMap;

    @Prop()
    public composeTestPaperData!: any;

    render() {
        return (
            <div class='knowledge-editor' >
                <div class='knowledge-editor__title'>
                    { this.title }
                    <el-transfer
                        prop = {{
                            option:this.knowledgeData
                        }}
                        filterable
                        filter-method={this.filterMethod}
                        filter-placeholder="请输入知识点名称"
                        v-model={this.selected}
                        titles={['知识点', '已选']}
                        data={this.knowledgeData}>
                    </el-transfer>
                </div>
            </div>
        )
    }
}