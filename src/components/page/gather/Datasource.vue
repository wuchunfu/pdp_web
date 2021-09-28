<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-calendar"></i> 数据源管理
        </el-breadcrumb-item>
        <el-breadcrumb-item>数据源列表</el-breadcrumb-item>
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
        <el-input v-model="query.data.data_source_context" placeholder="数据源说明" class="handle-input mr10"></el-input>
        <el-input v-model="query.data.url" placeholder="连接串" class="handle-input mr10"></el-input>
        <el-input v-model="query.data.data_source_type" placeholder="数据源类型" class="handle-input mr10"></el-input>
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
        <el-table-column prop="dataSourceContext" label="数据源说明"></el-table-column>
        <el-table-column prop="dataSourceType" label="数据源类型"></el-table-column>
        <el-table-column prop="driver" label="驱动"></el-table-column>
        <el-table-column prop="url" label="连接串"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
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
        <el-form-item label="数据源说明" prop="data_source_context">
          <el-input v-model="addForm.dataSourceContext"></el-input>
        </el-form-item>
        <el-form-item label="数据源类型" prop="data_source_type">
          <el-select v-model="addForm.dataSourceType" placeholder="请选择数据源类型" clearable>
            <el-option
                v-for="item in dataSourcesTypeList"
                :key="item.id"
                :label="item.sourcesType"
                :value="item.sourcesType">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="驱动" prop="driver">
          <el-input v-model="addForm.driver"></el-input>
        </el-form-item>
        <el-form-item label="连接串" prop="url">
          <el-input v-model="addForm.url"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
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
        <el-form-item label="数据源说明" prop="data_source_context">
          <el-input v-model="editForm.dataSourceContext"></el-input>
        </el-form-item>
        <el-form-item label="数据源类型" prop="data_source_type">
          <el-select v-model="editForm.dataSourceType" placeholder="请选择数据源类型" clearable>
            <el-option
                v-for="item in dataSourcesTypeList"
                :key="item.id"
                :label="item.sourcesType"
                :value="item.sourcesType">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="驱动" prop="driver">
          <el-input v-model="editForm.driver"></el-input>
        </el-form-item>
        <el-form-item label="连接串" prop="url">
          <el-input v-model="editForm.url"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="editForm.password"></el-input>
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
import {
  selectDatasourcesList,
  insertDatasource,
  selectDataSourcesType,
  deleteDatasource,
  updateDatasourcesInfo
} from '../../../api/datasource';

export default {
  name: 'datasourceList',
  data() {
    return {
      query: {
        data: {
        },
        currentPage: 1,
        pageNumber: 10
      },

      tableData: [],
      dataSourcesTypeList: [],
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
      selectDatasourcesList(this.query).then(res => {
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
      this.$confirm('确定要删除[' + row.dataSourceContext +']吗？', '提示', {
        type: 'warning'
      })
          .then(() => {
            deleteDatasource({ids: row.id}).then(res => {
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
      let dataSourceContext = '';
      for (let i = 0; i < length; i++) {
        if (i + 1 == length) {
          str += this.multipleSelection[i].id
          dataSourceContext += this.multipleSelection[i].dataSourceContext
        } else {
          str += this.multipleSelection[i].id + ',';
          dataSourceContext += this.multipleSelection[i].dataSourceContext + ','
        }
      }
      this.$confirm('确定要删除[' + dataSourceContext + ']吗？', '提示', {
        type: 'warning'
      })
          .then(() => {
            deleteDatasource({ids: str}).then(res => {
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
      selectDataSourcesType().then(res => {
        this.dataSourcesTypeList = res.data;
      });
      this.addVisible = true;
    },
    // 编辑操作
    handleEdit(index, row) {
      this.idx = index;
      this.editForm = row;
      selectDataSourcesType().then(res => {
        this.dataSourcesTypeList = res.data;
      });
      this.editVisible = true;
    },
    // 保存新增
    saveAdd(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          insertDatasource(this.addForm).then(res => {
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
          updateDatasourcesInfo(this.editForm).then(res => {
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
