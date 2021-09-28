<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 用户管理
                </el-breadcrumb-item>
                <el-breadcrumb-item>用户列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button
                        type="primary"
                        icon="el-icon-delete"
                        class="handle-del mr10"
                        @click="delAllSelection"
                >批量删除
                </el-button>
                <el-button
                        type="primary"
                        icon="el-icon-lx-add"
                        class="handle-del mr10"
                        @click="handleAdd()"
                >添加
                </el-button>
                <el-input v-model="query.data.name" placeholder="姓名" class="handle-input mr10"></el-input>
                <el-input v-model="query.data.account" placeholder="账号" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
                    @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="userName" label="姓名"></el-table-column>
                <el-table-column prop="account" label="账号">
                </el-table-column>
                <el-table-column prop="roleName" label="角色名称">
                </el-table-column>
                <el-table-column prop="phone" label="手机号"></el-table-column>
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        <el-tag
                                :type="scope.row.status===1?'success':(scope.row.status===0?'danger':'')"
                        >{{scope.row.status===1?'启用':(scope.row.status===0?'禁用':'')}}
                        </el-tag>
                    </template>
                </el-table-column>

                <el-table-column prop="createTime" label="创建时间"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click="handleEdit(scope.$index, scope.row)"
                        >编辑
                        </el-button>
                        <el-button
                                type="text"
                                icon="el-icon-delete"
                                class="red"
                                @click="handleDelete(scope.$index, scope.row)"
                        >删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                        background
                        layout="total, prev, pager, next"
                        :current-page="query.pageIndex"
                        :page-size="query.pageSize"
                        :total="pageTotal"
                        @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 新增弹出框 -->
        <el-dialog title="添加" :visible.sync="addVisible" width="30%">
            <el-form ref="addForm" :model="addForm" :rules="rules" label-width="100px">
                <el-form-item label="用户名" prop="userName">
                    <el-input v-model="addForm.userName"></el-input>
                </el-form-item>
                <el-form-item label="账号" prop="account">
                    <el-input v-model="addForm.account"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                    <el-input v-model="addForm.phone"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-select v-model="addForm.status" placeholder="请选择状态">
                        <el-option label="启用" value=1></el-option>
                        <el-option label="禁用" value=0></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="角色" prop="roleId">
                    <el-select v-model="addForm.roleId" placeholder="请选择角色">
                        <el-option
                                v-for="item in roleList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input
                            type="textarea"
                            autosize
                            placeholder="请输入内容"
                            v-model="addForm.description">
                    </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAdd('addForm')">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="editForm" :model="editForm" :rules="rules" label-width="100px">
                <el-form-item label="用户名" prop="userName">
                    <el-input v-model="editForm.userName"></el-input>
                </el-form-item>
                <el-form-item label="账号" prop="account">
                    <el-input v-model="editForm.account"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                    <el-input v-model="editForm.phone"></el-input>
                </el-form-item>
                <el-form-item label="请选择状态" prop="status">
                    <el-select v-model="editForm.status" placeholder="请选择状态">
                        <el-option label="启用" :value=1></el-option>
                        <el-option label="禁用" :value=0></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="请选择角色" prop="roleId">
                    <el-select v-model="editForm.roleId" placeholder="请选择角色">
                        <el-option
                                v-for="item in roleList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input
                            type="textarea"
                            autosize
                            placeholder="请输入内容"
                            v-model="editForm.description">
                    </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit('editForm')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {selectUserList, insertUser, updateUser, deleteUser} from '../../../api/user';
    import {selectAllRole} from '../../../api/role';

    export default {
        name: 'userList',
        data() {
            return {
                query: {
                    data: {
                        address: '',
                        name: '',
                    },
                    currentPage: 1,
                    pageNumber: 10
                },
                rules: {
                    userName: [
                        {required: true, message: '请输入用户名', trigger: 'blur'},
                        {min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur'}
                    ],
                    account: [
                        {required: true, message: '请输入账号', trigger: 'blur'},
                        {min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur'}
                    ],
                    phone: [
                        {required: true, message: '请输入手机号', trigger: 'blur'},
                        {
                            validator: function (rule, value, callback) {
                                if (/^1[34578]\d{9}$/.test(value) == false) {
                                    callback(new Error("手机号格式错误"));
                                } else {
                                    callback();
                                }
                            },
                            trigger: "blur"
                        }

                    ],
                    roleId: [
                        {required: true, message: '请选择角色', trigger: 'change'}
                    ],
                    status: [
                        {required: true, message: '请选择状态', trigger: 'change'}
                    ]
                },
                tableData: [],
                roleList: [],
                multipleSelection: [],
                editVisible: false,
                addVisible: false,
                pageTotal: 0,
                addForm: {},
                editForm: {},
                idx: -1
            };
        },
        created() {
            this.getData();
        },
        methods: {
            getData() {
                selectUserList(this.query).then(res => {
                    this.tableData = res.data.list;
                    this.pageTotal = res.data.pageUtil.totalNumber || 50;
                });
            },
            // 触发搜索按钮
            handleSearch() {
                this.$set(this.query, 'currentPage', 1);
                this.getData();
            },
            // 删除操作
            handleDelete(index, row) {
                // 二次确认删除
                this.$confirm('确定要删除[' + row.userName + ']吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        deleteUser({ids: row.id}).then(res => {
                            if (res.code == '200') {
                                this.$message.success(res.msg)
                                this.addVisible = false;
                                this.getData();
                            } else {
                                this.$message.error(res.msg)
                            }
                        })
                    })
                    .catch(() => {
                    });
            },
            // 多选操作
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            delAllSelection() {
                const length = this.multipleSelection.length;
                if (length == 0) {
                    this.$message({
                        message: '请至少选择一条数据！',
                        type: 'error'
                    });
                    return;
                }
                let str = '';
                let name = '';
                for (let i = 0; i < length; i++) {
                    if (i + 1 == length) {
                        str += this.multipleSelection[i].id
                        name += this.multipleSelection[i].userName
                    } else {
                        str += this.multipleSelection[i].id + ',';
                        name += this.multipleSelection[i].userName + ','
                    }
                }
                this.$confirm('确定要删除[' + name + ']吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        deleteUser({ids: str}).then(res => {
                            if (res.code == '200') {
                                this.$message.success(res.msg)
                                this.addVisible = false;
                                this.getData();
                            } else {
                                this.$message.error(res.msg)
                            }
                        })
                    })
                    .catch(() => {
                    });
                this.multipleSelection = [];
            },
            // 添加操作
            handleAdd() {
                selectAllRole().then(res => {
                    this.roleList = res.data;
                });
                this.addVisible = true;
            },
            // 编辑操作
            handleEdit(index, row) {
                this.idx = index;
                this.editForm = row;
                selectAllRole().then(res => {
                    this.roleList = res.data;
                });
                this.editVisible = true;
            },
            // 保存新增
            saveAdd(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        insertUser(this.addForm).then(res => {
                            if (res.code == '200') {
                                this.$message.success(res.msg)
                                this.addVisible = false;
                                this.getData();
                            } else {
                                this.$message.error(res.msg)
                            }
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            // 保存编辑
            saveEdit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        updateUser(this.editForm).then(res => {
                            if (res.code == '200') {
                                this.$message.success(res.msg)
                                this.editVisible = false;
                                this.getData();
                            } else {
                                this.$message.error(res.msg)
                            }
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            // 分页导航
            handlePageChange(val) {
                this.$set(this.query, 'currentPage', val);
                this.getData();
            }
        }
    };
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }

    .table {
        width: 100%;
        font-size: 14px;
    }

    .red {
        color: #ff0000;
    }

    .mr10 {
        margin-right: 10px;
    }

    .table-td-thumb {
        display: block;
        margin: auto;
        width: 40px;
        height: 40px;
    }
</style>
