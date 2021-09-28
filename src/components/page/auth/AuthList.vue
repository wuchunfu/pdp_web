<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 权限管理
                </el-breadcrumb-item>
                <el-breadcrumb-item>权限列表</el-breadcrumb-item>
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
                <el-input v-model="query.data.name" placeholder="名称" class="handle-input mr10"></el-input>
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
                <el-table-column prop="name" label="名称"></el-table-column>
                <el-table-column prop="authKey" label="权限标识"></el-table-column>
                <el-table-column prop="parentName" label="父权限"></el-table-column>
                <el-table-column prop="url" label="路径"></el-table-column>
                <el-table-column prop="sortNo" label="排列序号"></el-table-column>
                <el-table-column prop="clazz" label="权限样式"></el-table-column>
                <el-table-column prop="description" label="描述"></el-table-column>
                <el-table-column label="类型">
                    <template slot-scope="scope">
                        <p v-if="scope.row.type=='1'">菜单</p>
                        <p v-if="scope.row.type=='2'">按钮</p>
                        <p v-if="scope.row.type=='3'">权限</p>
                    </template>
                </el-table-column>
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
                <el-form-item label="名称" prop="name">
                    <el-input v-model="addForm.name"></el-input>
                </el-form-item>
                <el-form-item label="权限标识" prop="authKey">
                    <el-input v-model="addForm.authKey"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-select v-model="addForm.status" placeholder="请选择状态">
                        <el-option label="启用" value=1></el-option>
                        <el-option label="禁用" value=0></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="权限类型" prop="type">
                    <el-select v-model="addForm.type" placeholder="请选择权限类型">
                        <el-option label="菜单" value=1></el-option>
                        <el-option label="权限" value=0></el-option>
                        <el-option label="按钮" value=0></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="父权限">
                    <el-select v-model="editForm.parentId" placeholder="请选择父权限" clearable>
                        <el-option
                                v-for="item in authList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="路径">
                    <el-input v-model="addForm.url"></el-input>
                </el-form-item>
                <el-form-item label="排列序号" prop="sortNo">
                    <el-input v-model="addForm.sortNo"></el-input>
                </el-form-item>
                <el-form-item label="权限样式">
                    <el-input v-model="addForm.clazz"></el-input>
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
        <el-dialog title="添加" :visible.sync="editVisible" width="30%">
            <el-form ref="editForm" :model="editForm" :rules="rules" label-width="100px">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="editForm.name"></el-input>
                </el-form-item>
                <el-form-item label="权限标识" prop="authKey">
                    <el-input v-model="editForm.authKey"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-select v-model="editForm.status" placeholder="请选择状态">
                        <el-option label="启用" :value=1></el-option>
                        <el-option label="禁用" :value=0></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="类型" prop="type">
                    <el-select v-model="editForm.type" placeholder="请选择权限类型">
                        <el-option label="菜单" :value=1></el-option>
                        <el-option label="按钮" :value=0></el-option>
                        <el-option label="权限" :value=0></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="父权限">
                    <el-select v-model="editForm.parentId" placeholder="请选择父权限" clearable>
                        <el-option
                                v-for="item in authList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="路径">
                    <el-input v-model="editForm.url"></el-input>
                </el-form-item>
                <el-form-item label="排列序号" prop="sortNo">
                    <el-input v-model="editForm.sortNo"></el-input>
                </el-form-item>
                <el-form-item label="权限样式">
                    <el-input v-model="editForm.clazz"></el-input>
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
    import {selectAuthList, insertAuth, updateAuth, updateAuthStatus, selectAllAuth} from '../../../api/auth';

    export default {
        name: 'authList',
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
                tableData: [],
                rules: {
                    name: [
                        {required: true, message: '请输入名称', trigger: 'blur'},
                        {min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur'}
                    ],
                    authKey: [
                        {required: true, message: '请输入权限标识', trigger: 'blur'}
                    ],
                    status: [
                        {required: true, message: '请选择状态', trigger: 'change'}
                    ],
                    type: [
                        {required: true, message: '请选择类型', trigger: 'change'}
                    ],
                    sortNo: [
                        {required: true, message: '请输入排列序号', trigger: 'blur'}
                    ]
                },
                multipleSelection: [],
                authList: [],
                addVisible: false,
                editVisible: false,
                pageTotal: 0,
                addForm: {},
                editForm: {},
                idx: -1,
                id: -1
            };
        },
        created() {
            this.getData();
        },
        methods: {
            // 获取 easy-mock 的模拟数据
            getData() {
                selectAuthList(this.query).then(res => {
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
                this.$confirm('确定要删除[' + row.name + ']吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        updateAuthStatus({ids: row.id, status: 2}).then(res => {
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
                        name += this.multipleSelection[i].name
                    } else {
                        str += this.multipleSelection[i].id + ',';
                        name += this.multipleSelection[i].name + ','
                    }
                }
                this.$confirm('确定要删除[' + name + ']吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        updateAuthStatus({ids: str, status: 2}).then(res => {
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
                selectAllAuth().then(res => {
                    this.authList = res.data;
                });
                this.addVisible = true;
            },
            // 编辑操作
            handleEdit(index, row) {
                this.idx = index;
                this.editForm = row;
                if (row.parentId === 0){
                    row.parentId = '';
                }
                selectAllAuth().then(res => {
                    for (const auth in res.data){
                        console.log(auth)
                        if (!auth.parentId === row.parentId){
                            this.authList.push(auth)
                        } else {
                            this.authList.push(auth)
                        }
                    }
                });
                this.editVisible = true;
            },
            // 保存新增
            saveAdd(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        insertAuth(this.addForm).then(res => {
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
                        updateAuth(this.editForm).then(res => {
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
