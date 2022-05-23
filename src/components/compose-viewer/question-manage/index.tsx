import { Component } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import Lang from '@/lang/lang';

@Component({

})
export default class QuestionManage extends mixins(Lang) {
    public data:any={
        currentPage:'',
    }
    public handleSizeChange(){
        console.log('aaa')
    }
    public handleCurrentChange(){
        console.log('aaa')
    }
    render() {
        return (
            <div>
                <div>question-manage</div>
                <div class="block">
                    <el-pagination
                    on={{'@size-change':this.handleSizeChange, 
                         '@current-change':this.handleCurrentChange,
                         'current-page':this.data.currentPage,
                         'page-sizes':"[100, 200, 300, 400]",
                         'page-size':'100',
                         'total':'400'
                        }}
                    layout="total, sizes, prev, pager, next, jumper"
                    >
                    </el-pagination>
                </div>
            </div>
        )
    }
}