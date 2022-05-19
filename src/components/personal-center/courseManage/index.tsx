import { ButtonType, BUTTON_TEXT_CANCEL, BUTTON_TEXT_CONFIRM, COURSEINFO } from "@/common/constants";
import { COURSEINFONUM, USERINFOENUM } from "@/common/constants/personal";
import Lang from "@/lang/lang";
import { mixins } from "vue-class-component";
import { Component } from "vue-property-decorator";
import { Action } from "vuex-class";
import "./style.scss";

@Component({})
export default class courseManage extends mixins(Lang) {
    private search = "";

    private courseData = {
        courseId: '',
        courseName: '',
    }

    private labelPosition = 'right'

    private loading = true;

    private tableData: any = [];

    private currentRow: any = undefined;

    private createDialogVisible: boolean = false;

    private changeDialogVisible: boolean = false;

    private deleteDialogVisible: boolean = false;

    @Action('getCourseInfo')
    private getCourseInfo !: () => any

    @Action('createCourse')
    private createCourse !: (courseInfo: any) => any

    @Action('changeCourse')
    private changeCourse !: (courseInfo: any) => any

    @Action('deleteCourse')
    private deleteCourse !: (courseInfo: any) => any

    private handleCurrentChange(currentRow: any) {
        this.courseData.courseId = currentRow.courseId;
        this.courseData.courseName = currentRow.courseName;
        this.currentRow = currentRow;
    }

    private handleCreateDialogOpen() {
        this.createDialogVisible = true;
    }

    private handleCreateDialogClose() {
        this.createDialogVisible = false;
    }

    private handleChangeDialogOpen() {
        if(this.currentRow === undefined) {
            this.$message({
                type: 'warning',
                message:'未选择用户，请点击表格对应用户'
            })
        } else {
            this.changeDialogVisible = true;
        }
    }

    private handleChangeDialogClose() {
        this.changeDialogVisible = false;
    }

    private handleDeleteDialogOpen() {
        if(this.currentRow === undefined) {
            this.$message({
                type: 'warning',
                message:'未选择用户，请点击表格对应用户'
            })
        } else {
            this.deleteDialogVisible = true;
        }
    }

    private handleDeleteDialogClose() {
        this.deleteDialogVisible = false;
    }

    private async handleCreate() {
        let code = 0;
        await this.createCourse({
            courseName: this.courseData.courseName
        }).then((res: any) => {
            code = res;
        });
        if (code == 200) {
            //弹出成功提示
            this.$message({
                type: 'success',
                message: '创建成功'
            })
            
        }
        
    }

    private async handleChange() {
        this.handleChangeDialogClose();
        this.currentRow = undefined;
        let code = 0;
        await this.changeCourse(this.courseData).then((res: any) => {
            code = res;
        });
        if (code == 200) {
            //弹出成功提示
            this.$message({
                type: 'success',
                message: '修改成功'
            })
        }
    }

    private async handleDelete() {
        this.handleDeleteDialogClose();
        this.currentRow = undefined;
        let code = 0;
        await this.deleteCourse({
            identityId: this.courseData.courseId,
        }).then((res: any) => {
            code = res;
        });
        if (code == 200) {
            //弹出成功提示
            this.$message({
                type: 'success',
                message: '删除成功'
            })
        }
    }

    async created() {        
        await this.getCourseInfo().then((res: any) => {
            this.tableData.push(...Array.from(res.data))
            console.log(this.tableData);
            this.loading = false;
        })
    }

    private renderCreateDialog() {
        return (
            <el-dialog
                title="创建用户"
                visible={this.createDialogVisible}
                onclose={this.handleCreateDialogClose}
                width="30%"
            >
                <el-form
                    label-position={this.labelPosition}
                    label-width="80px"
                    props={{
                        model : this.courseData
                    }}
                    
                >
                    <el-form-item label="课程名">
                        <el-input
                            v-model={this.courseData.courseName}
                        ></el-input>
                    </el-form-item>
                </el-form>
                <div class="dialog-footer">
                    <el-button
                        onclick={this.handleCreateDialogClose}
                    >
                        {this.t(BUTTON_TEXT_CANCEL)}
                    </el-button>
                    <el-button
                        type={ButtonType.PRIMARY}
                        onclick={this.handleCreate}
                    >
                        {this.t(BUTTON_TEXT_CONFIRM)}
                    </el-button>
                </div>
            </el-dialog>
        );
    }

    private renderChangeDialog() {
        return (
            <el-dialog
                title="修改用户信息"
                visible={this.changeDialogVisible}
                onclose={this.handleChangeDialogClose}
                width="30%"
            >
                <el-form
                    label-position={this.labelPosition}
                    label-width="80px"
                    props={{
                        model : this.courseData
                    }}
                    
                >
                    <el-form-item label="课程名">
                        <el-input
                            v-model={this.courseData.courseName}
                        ></el-input>
                    </el-form-item>
                </el-form>
                <div class="dialog-footer">
                    <el-button
                        onclick={this.handleChangeDialogClose}
                    >
                        {this.t(BUTTON_TEXT_CANCEL)}
                    </el-button>
                    <el-button
                        type={ButtonType.PRIMARY}
                        onclick={this.handleChange}
                    >
                        {this.t(BUTTON_TEXT_CONFIRM)}
                    </el-button>
                </div>
            </el-dialog>
        );
    }

    private renderDeleteDialog() {
        return (
            <el-dialog
                title="删除用户"
                visible={this.deleteDialogVisible}
                onclose={this.handleDeleteDialogClose}
                width="30%"
            >
                <div style="height: 50px; line-height: 50px">
                    确认删除课程<span style="color: red">{this.courseData.courseName}</span>的用户吗？此操作不可恢复！
                    </div>
                <div class="dialog-footer">
                    <el-button
                        onclick={this.handleDeleteDialogClose}
                    >
                        {this.t(BUTTON_TEXT_CANCEL)}
                    </el-button>
                    <el-button
                        type={ButtonType.DANGER}
                        onclick={this.handleDelete}
                    >
                        删除
                    </el-button>
                </div>
            </el-dialog>
        );
    }

    render() {
        return (
            <div class="course-manage">
                <div
                class="course-manage-container"
                v-loading={this.loading}
                >
                    <div class="container">
                        <el-input
                            v-model={this.search}
                            placeholder="查找课程"
                        ></el-input>
                        <el-table
                            max-height="450"
                            style="width: 100%"
                            highlight-current-row
                            on={{ "current-change": this.handleCurrentChange }}
                            data={this.tableData.filter(
                                (data: any) =>
                                    !this.search ||
                                    data.courseName
                                        .toLowerCase()
                                        .includes(this.search.toLowerCase())
                            )}
                        >
                            <el-table-column
                                type="index"
                                width="150"
                            ></el-table-column>
                            <el-table-column
                                label={this.t(COURSEINFO.COURSE_NAME)}
                                prop={COURSEINFONUM.COURSENAME}
                            ></el-table-column>
                        </el-table>
                        <div class="operator-area">
                            <el-button
                                type={ButtonType.PRIMARY}
                                onclick={this.handleCreateDialogOpen}
                            >
                                创建课程
                            </el-button>
                            <el-button
                                type={ButtonType.INFO}
                                onclick={this.handleChangeDialogOpen}
                            >
                                修改课程
                            </el-button>
                            <el-button
                                type={ButtonType.DANGER}
                                onclick={this.handleDeleteDialogOpen}
                            >
                                删除课程
                            </el-button>
                        </div>
                        {this.renderCreateDialog()}
                        {this.renderChangeDialog()}
                        {this.renderDeleteDialog()}
                    </div>
                </div>
            </div>
        );
    }
}
