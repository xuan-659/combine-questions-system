import { CreateElement } from 'vue';
import { Component, Emit } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import Lang from '@/lang/lang';
import TransferCard from './transferCard';
import './style.scss';
import {
    QuestionTypeMap,
    ITransferDataItem
} from '@/interfaces/compose-viewer';
import { IDialogConfig } from '@/interfaces/common';
import { getQuestionTypes } from '@/utlis';

@Component({
    components: {
        TransferCard
    }
})
export default class ListTransfer extends mixins(Lang) {

    @Emit("changeQuestionTypeList")
    public changeQuestionTypeList(val: any){
        console.log('save');
        console.log(val);
        
        return val
    }

    public transferSourceData: ITransferDataItem[] = [];

    public transferTargetData: ITransferDataItem[] = [];

    public renderTransferCard(h: CreateElement, params: any) {
        const { type, title, ...config } = params;
        return h(this.$options.components!['TransferCard'], {
            props: {
                transferType: type,
                title,
                dataSource: type === 'source' ? this.transferSourceData : this.transferTargetData,
                config
            },
            on: {
                transferItemDelete: this.deleteTransferItem,
                transferItemAdd: this.addTransferItem,
                transferItemSave: this.saveTransferItem
            }
        })
    }

    public saveTransferItem(val: any ) {
        this.changeQuestionTypeList(val)
    }

    /**
     * 删除（单个删除或者批量删除）
     * @param deleteOptions 单个删除为需要删除的项的下标，批量删除为要删除的目标数组
     */
    public deleteTransferItem(deleteOptions: number | ITransferDataItem[]) {
        if(typeof deleteOptions === 'number') {
            this.transferTargetData.splice(deleteOptions, 1);
        } else {
            deleteOptions.forEach(deleteItem => {
                const index = this.transferTargetData.findIndex(item => item.id === deleteItem.id)
                if(typeof index !== 'undefined') {
                    this.transferTargetData.splice(index, 1);
                }
            })
        }
    }

    public addTransferItem(addOptions: number | ITransferDataItem[]) {
        if(typeof addOptions === 'number') {
            this.transferTargetData.push(this.transferSourceData[addOptions]);
        } else {
            this.transferTargetData.push(...addOptions);
        }
    }

    mounted() {
        this.transferSourceData = [...getQuestionTypes()];   
    }

    render(h: CreateElement) {
        return (
            <div class='list-transfer'>
                <div class='list-transfer-container'>
                    <div class='list-transfer-container__source'>
                        {
                            this.renderTransferCard(h, {
                                    type: 'source',
                                    title: '试题类型列表',
                                    batchEdit: false
                                }
                            )
                        }
                    </div>
                    <div class='list-transfer-container__target'>
                        {
                            this.renderTransferCard( h, {
                                    type: 'target',
                                    title: '目标试题类型',
                                    batchEdit: false
                                }
                            )
                        }
                    </div>
                </div>
            </div>
        )
    }
}