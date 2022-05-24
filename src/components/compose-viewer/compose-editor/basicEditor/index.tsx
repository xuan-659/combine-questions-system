import { Component, Emit, Prop } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import Lang from '@/lang/lang';
import {
    EditorIndexMap,
    BaseEditorOperations
} from '@/interfaces/compose-viewer';

import './style.scss';
import { Action } from 'vuex-class';

@Component({
    
})
export default class BasicEditor extends mixins(Lang) {

    @Prop()
    public title!: keyof typeof EditorIndexMap;

    @Action('getCourseInfo')
    private getCourseInfo!: () => any;

    @Emit("changeBasicData")
    public changeBasicData() {
        return this.baseEditInfo
    }

    public courseInfo: any = []

    public baseEditInfo = {
        courseId: '',
        paperDifficulty: null
    }

    async created() {
        await this.getCourseInfo().then((res: any) => {
            this.courseInfo.push(...Array.from(res.data))
        })
    }

    beforeDestroy() {
        this.changeBasicData()
    }

    render() {
        return (
            <div class='base-editor'>
                <div class='base-editor__title'>
                    { this.title }
                </div>
                <div class='base-editor__content'>
                    <el-form
                        label-position="right"
                        label-width='120px'
                        props={{
                            model: this.baseEditInfo
                        }}
                    >
                        <el-form-item label={this.t(BaseEditorOperations.COURSE_NAME_SELECT)}>
                            <el-select v-model={this.baseEditInfo.courseId}>
                                {this.courseInfo.map((item:any) => {
                                    return (
                                        <el-option
                                         key={item.courseId}
                                         label={item.courseName}
                                         value={item.courseId}
                                        ></el-option>
                                    )
                                })}
                            </el-select>
                        </el-form-item>
                        <el-form-item label={this.t(BaseEditorOperations.PAPER_DIFFICULTY_SELECT)}>
                            <el-rate v-model={this.baseEditInfo.paperDifficulty}></el-rate>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        )
    }
}