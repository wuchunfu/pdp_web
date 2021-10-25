<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 平台链接管理
                </el-breadcrumb-item>
                <el-breadcrumb-item>链接列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button
                        type="primary"
                        icon="el-icon-lx-add"
                        class="handle-del mr10"
                        @click="handleAdd()"
                >添加
                </el-button>
                <el-input v-model="query.data.name" placeholder="平台名称" class="handle-input mr10"></el-input>
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
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="name" label="名称"></el-table-column>
                <el-table-column prop="url" label="url">
                  <template slot-scope="scope">
                    <a :href="scope.row.url" target="_blank" class="buttonText">{{scope.row.url}}</a>
                  </template>
                </el-table-column>
                <el-table-column prop="urlType" label="url类型">
                  <template slot-scope="scope">
                    <el-tag
                        :type="scope.row.urlType===0?'success':(scope.row.urlType===1?'success':'')"
                    >{{ scope.row.urlType === 0 ? '平台入口url' : (scope.row.urlType === 1 ? '报表url' : '') }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="urlSort" label="url优先级"></el-table-column>
                <el-table-column prop="createTime" label="创建时间"></el-table-column>
                <el-table-column prop="updateTime" label="更新时间"></el-table-column>
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
        </div>

        <!-- 新增弹出框 -->
        <el-dialog title="添加" :visible.sync="addVisible" width="30%">
            <el-form ref="addForm" :model="addForm" :rules="rules" label-width="100px">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="addForm.name"></el-input>
                </el-form-item>
                <el-form-item label="url地址" prop="url">
                  <el-input v-model="addForm.url"></el-input>
                </el-form-item>
                <el-form-item label="url类型" prop="urlType">
                  <el-select v-model="addForm.urlType" placeholder="请选择url类型">
                    <el-option label="平台入口url" :value=0></el-option>
                    <el-option label="报表url" :value=1></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="url优先级" prop="urlSort" v-if="addForm.urlType == '1'">
                  <el-input v-model="addForm.urlSort" ></el-input>
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
              <el-form-item label="名称" prop="name">
                <el-input v-model="editForm.name"></el-input>
              </el-form-item>
              <el-form-item label="url地址" prop="url">
                <el-input v-model="editForm.url"></el-input>
              </el-form-item>
              <el-form-item label="url类型" prop="urlType">
                <el-select v-model="editForm.urlType" placeholder="请选择url类型">
                  <el-option label="平台入口url" :value=0></el-option>
                  <el-option label="报表url" :value=1></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="url优先级" prop="urlSort" v-if="editForm.urlType == '1'">
                <el-input v-model="editForm.urlSort" ></el-input>
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
    import {selectPlatformLinkList, insertPlatformLink, updatePlatformLink, updatePlatformLinkStatus} from '../../../api/platformLink';

    export default {
        name: 'roleList',
        data() {
            return {
                query: {
                    data: {
                    },
                    currentPage: 1,
                    pageNumber: 10
                },
                rules: {
                    name: [
                        {required: true, message: '请输入名称', trigger: 'blur'},
                        {min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur'}
                    ],
                    url: [
                        {required: true, message: '请输入url', trigger: 'change'}
                    ]
                },
                tableData: [],
                multipleSelection: [],
                roleList: [],
                addVisible: false,
                editVisible: false,
                pageTotal: 0,
                addForm: { urlSort: 1 },
                editForm: {},
                idx: -1
            };
        },
        created() {
            this.getData();
        },
        methods: {
            // 获取 easy-mock 的模拟数据
            getData() {
                selectPlatformLinkList(this.query).then(res => {
                    this.tableData = res.data;
                });
            },
            // 触发搜索按钮
            handleSearch() {
                this.getData();
            },
            // 删除操作
            handleDelete(index, row) {
                // 二次确认删除
                this.$confirm('确定要删除[' + row.name + ']吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                      row.status = 2;
                      updatePlatformLink(row).then(res => {
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
                      updatePlatformLink({ids: str, status: 2}).then(res => {
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
                this.addVisible = true;
            },
            // 编辑操作
            handleEdit(index, row) {
                this.idx = index;
                this.editForm = row;
                this.editVisible = true;
            },
            // 保存新增
            saveAdd(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                      insertPlatformLink(this.addForm).then(res => {
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
                      updatePlatformLink(this.editForm).then(res => {
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
