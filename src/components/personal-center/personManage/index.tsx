import {
    ButtonSize,
    ButtonType,
    BUTTON_TEXT_CANCEL,
    BUTTON_TEXT_CONFIRM,
    USERINFO,
} from "@/common/constants";
import { USERINFOENUM } from "@/common/constants/personal";
import { IInformation } from "@/interfaces";
import Lang from "@/lang/lang";
import { mixins } from "vue-class-component";
import { Component, Emit } from "vue-property-decorator";
import { Action } from "vuex-class";
import "./style.scss";

@Component({})
export default class personManage extends mixins(Lang) {
    private tableData: any[] = [];
    private userData = {
        id: undefined,
        identityId: "",
        password: "",
        roleId : 1,
    };

    private loading = true;

    private search = "";

    private roleIdList = [
        {
            value: 0,
            label: "管理员",
        },
        {
            value: 1,
            label: "老师",
        },
    ];

    private labelPosition = "right";

    private registDialogVisible = false;

    private changeDialogVisible = false;

    private deleteDialogVisible = false;

    private currentRow = undefined;

    get identityId() {
        return this.userData.identityId;
    }

    set identityId(val) {
        this.userData.identityId = val;
    }
    get password() {
        return this.userData.password;
    }

    set password(val) {
        this.userData.password = val;
    }
    get roleId() {
        return this.userData.roleId;
    }

    set roleId(val) {
        this.userData.roleId = val;
    }

    @Action("getAllUser")
    private getAllUser!: () => any;

    @Action("registUser")
    private registUser!: (userInfo: any) => any;

    @Action("changeUser")
    private changeUser !: (userInfo: any) => any

    @Action("deleteUser")
    private deleteUser !: (userInfo: any) => any

    public handleRegistDialogClose() {
        this.registDialogVisible = false;
    }

    public handleRegistDialogOpen() {
        this.userData = {
            id: undefined,
            identityId: "",
            password: "",
            roleId: 1,
        }
        this.registDialogVisible = true;
    }

    public handleChangeDialogClose() {
        this.changeDialogVisible = false;
    }

    public handleChangeDialogOpen() {
        if(this.currentRow === undefined) {
            this.$message({
                type: 'warning',
                message:'未选择用户，请点击表格对应用户'
            })
        } else {
            this.changeDialogVisible = true;
        }
        
    }

    public handleDeleteDialogClose() {
        this.deleteDialogVisible = false;
    }

    public handleDeleteDialogOpen() {
        if(this.currentRow === undefined) {
            this.$message({
                type: 'warning',
                message:'未选择用户，请点击表格对应用户'
            })
        } else {
            this.deleteDialogVisible = true;
        }
    }

    

    private async handleRegist() {
        this.handleRegistDialogClose();
        
        let code = 0;
        await this.registUser({
            identityId: this.userData.identityId,
            password: this.userData.password,
            roleId: this.userData.roleId
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

    private handleCurrentChange(currentRow: any) {
        this.userData.roleId = currentRow.roleId === "管理员" ? 0 : 1;
        this.userData.identityId = currentRow.identityId;
        this.userData.id = currentRow.id;
        this.currentRow = currentRow;
        console.log(this.currentRow);
        
    }

    private async handleChange() {
        this.handleChangeDialogClose();
        this.currentRow = undefined;
        let code = 0;
        await this.changeUser({
            id: this.userData.id,
            identityId: this.userData.identityId,
            roleId: this.userData.roleId
        }).then((res: any) => {
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
        await this.deleteUser({
            identityId: this.userData.identityId,
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
        await this.getAllUser().then((res: any) => {
            const data: any = Array.from(res.data);
            this.tableData.push(...data);
            for (let i = 0; i < this.tableData.length; i++) {
                this.tableData[i].roleId =
                    this.tableData[i].roleId == 0 ? "老师" : "管理员";
            }
            this.loading = false;
            console.log(this.tableData);
        });
    }

    private renderRegistDialog() {
        return (
            <el-dialog
                title="创建用户"
                visible={this.registDialogVisible}
                onclose={this.handleRegistDialogClose}
                width="30%"
            >
                <el-form
                    label-position={this.labelPosition}
                    label-width="80px"
                    props={{
                        model : this.userData
                    }}
                    
                >
                    <el-form-item label="工号">
                        <el-input
                            v-model={this.identityId}
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="密码">
                        <el-input
                            v-model={this.password}
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="权限">
                        <el-select
                            v-model={this.roleId}
                            placeholder="请选择"
                        >
                            {this.roleIdList.map((item) => {
                                return (
                                    <el-option
                                        key={item.value}
                                        label={item.label}
                                        value={item.value}
                                    ></el-option>
                                );
                            })}
                        </el-select>
                    </el-form-item>
                </el-form>
                <div class="dialog-footer">
                    <el-button
                        onclick={this.handleRegistDialogClose}
                    >
                        {this.t(BUTTON_TEXT_CANCEL)}
                    </el-button>
                    <el-button
                        type={ButtonType.PRIMARY}
                        onclick={this.handleRegist}
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
                        model : this.userData
                    }}
                    
                >
                    <el-form-item label="工号">
                        <el-input
                            v-model={this.identityId}
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="权限">
                        <el-select
                            v-model={this.roleId}
                            placeholder="请选择"
                        >
                            {this.roleIdList.map((item) => {
                                return (
                                    <el-option
                                        key={item.value}
                                        label={item.label}
                                        value={item.value}
                                    ></el-option>
                                );
                            })}
                        </el-select>
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
                    确认删除工号为<span style="color: red">{this.userData.identityId}</span>的用户吗？此操作不可恢复！
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
            <div class="person-manage">
                <div 
                class="person-manage-container"
                v-loading={this.loading}
                >
                    <el-input
                        v-model={this.search}
                        placeholder="按工号查找用户"
                    ></el-input>
                    <el-table
                        max-height="450"
                        style="width: 100%"
                        highlight-current-row
                        on={
                            {"current-change": this.handleCurrentChange}
                        }
                        current-change={this.handleCurrentChange}
                        data={this.tableData.filter(
                            (data) =>
                                !this.search ||
                                data.identityId
                                    .toLowerCase()
                                    .includes(this.search.toLowerCase())
                        )}
                    >
                        <el-table-column
                            type="index"
                            width="100"
                        ></el-table-column>
                        <el-table-column
                            label={this.t(USERINFO.IDENTIFY_ID)}
                            prop={USERINFOENUM.INDENTITY_ID}
                        ></el-table-column>
                        <el-table-column
                            label={this.t(USERINFO.USERNAME)}
                            prop={USERINFOENUM.USERNAME}
                        ></el-table-column>
                        <el-table-column
                            label={this.t(USERINFO.PHONE)}
                            prop={USERINFOENUM.PHONE}
                        ></el-table-column>
                        <el-table-column
                            label={this.t(USERINFO.COURSE_NAME)}
                            prop={USERINFOENUM.COURSENAME}
                        ></el-table-column>
                        <el-table-column
                            label="权限"
                            prop={USERINFOENUM.ROLEID}
                        ></el-table-column>
                    </el-table>
                    <div class="operator-area">
                        <el-button
                            type={ButtonType.PRIMARY}
                            onclick={this.handleRegistDialogOpen}
                        >
                            创建用户
                        </el-button>
                        <el-button
                         type={ButtonType.INFO}
                         onclick={this.handleChangeDialogOpen}
                         >
                            修改用户信息
                        </el-button>
                        <el-button
                         type={ButtonType.DANGER}
                         onclick={this.handleDeleteDialogOpen}
                         >删除用户</el-button>
                    </div>
                    {this.renderRegistDialog()}
                    {this.renderChangeDialog()}
                    {this.renderDeleteDialog()}
                </div>
            </div>
        );
    }
}
