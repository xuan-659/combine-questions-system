import { Component, Emit, Prop } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import Lang from '@/lang/lang';
import { EditorIndexMap } from '@/interfaces/compose-viewer';
import { Action } from 'vuex-class';
import './style.scss'

@Component({

})
export default class CapacityEditor extends mixins(Lang) {


    @Prop()
    public title!: keyof typeof EditorIndexMap;

    @Prop()
    public composeTestPaperData!: any;

    @Action("getAbilityData")
    public getAbilityData!: (courseId: any) => any;

    @Emit("changeAbility")
    public changeAbility() {
        return this.selected;
    }

    public abilityData: any = []

    public selected = []

    filterMethod(query: any, item: any) {
        return item.label.indexOf(query) > -1;
    }

    async created() {
        await this.getAbilityData(this.composeTestPaperData.courseId).then((res: any) => {
            console.log(res);
            this.abilityData.push(...res.data.map((item: any) => {
                return {
                    label: item.abilityContent,
                    key: item.abilityId
                }    
            }))
        })
    }

    beforeDestroy() {
        this.changeAbility()
        console.log("数据",this.selected);
        
    }

    render() {
        return (
            <div class='knowledge-editor' >
                <div class='knowledge-editor__title'>
                    { this.title }
                    <el-transfer
                        prop = {{
                            option:this.abilityData
                        }}
                        filterable
                        filter-method={this.filterMethod}
                        filter-placeholder="请输入能力点名称"
                        v-model={this.selected}
                        titles={['能力点', '已选']}
                        data={this.abilityData}>
                    </el-transfer>
                </div>
            </div>
        )
    }
}