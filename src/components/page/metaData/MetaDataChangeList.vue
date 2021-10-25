<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 元数据变更管理
                </el-breadcrumb-item>
                <el-breadcrumb-item>元数据变更列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-table
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
                    @selection-change="handleSelectionChange"
            >
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="systemName" label="系统名称"></el-table-column>
                <el-table-column prop="dbName" label="数据库名称"></el-table-column>
                <el-table-column prop="tableName" label="数据库表名称"></el-table-column>
                <el-table-column prop="sourceAddCloumns" label="数据库表添加的字段"></el-table-column>
                <el-table-column prop="sourceDeleteCloumns" label="数据库表删除的字段"></el-table-column>
                <el-table-column prop="createTime" label="创建时间"></el-table-column>
                <el-table-column prop="updateTime" label="更新时间"></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import { getMetaDataChangeList } from '../../../api/metaData';

    export default {
        name: 'roleList',
        data() {
            return {
                query: {
                    data: {
                        name: '',
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
                addForm: {},
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
              getMetaDataChangeList(this.query).then(res => {
                this.tableData = res.data;
              });
            },
        }
    };
</script>

<style scoped>
    .table {
        width: 100%;
        font-size: 14px;
    }
</style>
