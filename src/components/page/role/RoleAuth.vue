<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 角色管理
                </el-breadcrumb-item>
                <el-breadcrumb-item>角色绑定权限</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-row>
                <el-col :span="6">
                    <div>
                        <span> 角色：</span>
                        <el-select v-model="roleId" placeholder="请选择" @change="changeAuth">
                            <el-option
                                    v-for="item in roleList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                </el-col>
                <el-col :span="18">
                    <div style="display: flex">
                        <span> 权限：</span>
                        <el-tree
                                :data="authList"
                                show-checkbox
                                node-key="id"
                                ref="tree"
                                :default-expand-all=true
                                :check-strictly=true
                                :props="defaultProps"
                                style="width: 50%">
                        </el-tree>
                    </div>
                </el-col>
            </el-row>
            <div style="width: 100%;">
                <el-button style="margin-left: 20%" type="primary" @click="insertRoleAndAuth">提交</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import {selectAllRole, selectAllAuthIdByRoleId, insertRoleAndAuth} from '../../../api/role';
    import {selectAuthTree} from '../../../api/auth';

    export default {
        name: 'baseform',
        data() {
            return {
                roleId: '',
                roleList: [],
                authList: [],
                defaultProps: {
                    children: 'children',
                    label: 'title'
                }
            };
        },
        created() {
            this.getData();
        },
        methods: {
            getData() {
                selectAllRole().then(res => {
                    if (res.code == "200") {
                        this.roleList = res.data;
                        selectAuthTree().then(data => {
                            this.authList = data.data
                        })
                    }
                });
            },
            changeAuth() {
                selectAllAuthIdByRoleId({roleId: this.roleId}).then(res => {
                    this.$refs.tree.setCheckedKeys(res.data);
                })
            },
            insertRoleAndAuth() {
                var authIds = this.$refs.tree.getCheckedKeys();
                if (this.roleId == ''){
                    this.$message.warning("请选择角色")
                    return false;
                }
                insertRoleAndAuth({roleId: this.roleId, authIds: authIds}).then(res => {
                    if (res.code == '200') {
                        this.$message.success(res.msg)
                    } else {
                        this.$message.error(res.msg)
                    }
                })
            }
        }
    };
</script>