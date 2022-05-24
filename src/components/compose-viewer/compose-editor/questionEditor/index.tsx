import { Component, Emit, Prop } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import Lang from '@/lang/lang';
import { EditorIndexMap } from '@/interfaces/compose-viewer';
import ListTransfer from '../listTransfer';

import './style.scss';
import { CreateElement } from 'vue';

@Component({
    components: {
        ListTransfer
    }
})
export default class QuestionEditor extends mixins(Lang) {

    @Prop()
    public title!: keyof typeof EditorIndexMap;

    @Emit('changeQuestionTypeList')
    public save(val: any) {
        console.log("question",val);
        
    }

    public renderList(h: CreateElement) {
        return h(this.$options.components!['ListTransfer'], {
            on: {
                "changeQuestionTypeList" : this.save
            }
        })
    }

    render(h:CreateElement) {
        return (
            <div class='question-editor'>
                <div class='question-editor__title'>
                    { this.title }
                </div>
                <div class='question-editor__content'>
                    {this.renderList(h)}
                </div>
            </div>
        )
    }
}