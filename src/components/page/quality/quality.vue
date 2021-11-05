<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-calendar"></i> 数据校验任务管理
        </el-breadcrumb-item>
        <el-breadcrumb-item>数据校验任务列表</el-breadcrumb-item>
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
        <el-input v-model="query.data.system_name" placeholder="系统名" class="handle-input mr10" clearable></el-input>
        <el-input v-model="query.data.source_db" placeholder="输入数据源库名" class="handle-input mr10"
                  clearable></el-input>
        <el-input v-model="query.data.source_table" placeholder="输入数据源表名" class="handle-input mr10"
                  clearable></el-input>
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
        <el-table-column prop="id" label="任务ID" width="70" align="center"></el-table-column>
        <el-table-column prop="checkContext" label="任务说明"></el-table-column>
        <el-table-column prop="datasourceInputId" label="输入数据源">
          <template slot-scope="scope">
            {{
              datasourcesList.find((item) => {
                return scope.row.datasourceInputId === item.id;
              }).dataSourceContext
            }}
          </template>
        </el-table-column>
        <el-table-column prop="systemName" label="系统名"></el-table-column>
        <el-table-column prop="sourceDb" label="数据库名"></el-table-column>
        <el-table-column prop="sourceTable" label="表名"></el-table-column>
        <el-table-column prop="rulesId" label="校验规则"></el-table-column>
        <el-table-column prop="countErrorRange" label="误差率"></el-table-column>
        <el-table-column prop="createUserId" label="创建人">
          <template slot-scope="scope">
            {{
              usersList.find((item) => {
                return scope.row.createUserId === item.id;
              }).userName
            }}
          </template>
        </el-table-column>
        <el-table-column prop="updateUserId" label="更新人">
          <template slot-scope="scope">
            {{
              usersList.find((item) => {
                return scope.row.updateUserId === item.id;
              }).userName
            }}
          </template>
        </el-table-column>

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
        <!--            <el-dropdown-menu slot="dropdown">-->
        <!--              <el-dropdown-item command="handleEdit"><i class="el-icon-document-copy"></i>编辑</el-dropdown-item>-->

        <!--            </el-dropdown-menu>-->
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
    <el-dialog title="添加" :visible.sync="addVisible" width="25%">
      <el-form ref="addForm" :model="addForm" :rules="rules" label-width="130px">
        <el-form-item label="任务说明" prop="gather_context" style="width: 70%">
          <el-input v-model="addForm.checkContext" clearable></el-input>
        </el-form-item>
        <el-form-item label="输入数据源" prop="datasource_input_id">
          <el-select v-model="addForm.datasourceInputId" v-on:change="inputDBAjax($event)" placeholder="请选择输入数据源"
                     clearable filterable allow-create>
            <el-option
                v-for="item in datasourcesList"
                :key="item.id"
                :label="item.dataSourceContext"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="系统名" prop="system_name">
          <el-select v-model="addForm.systemName" placeholder="请输入系统名"
                     clearable filterable allow-create>
            <el-option
                v-for="item in datasourcesList"
                :key="item.id"
                :label="item.systmeName"
                :value="item.systemName">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据库名" prop="source_db">
          <el-select v-model="addForm.sourceDb" v-on:change="inputTableAjax($event)" placeholder="请选择输入数据源库名"
                     clearable filterable allow-create>
            <el-option
                v-for="item in inputDbList"
                :key="item.dbName"
                :label="item.dbName"
                :value="item.dbName">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="表名" prop="source_table">
          <el-select v-model="addForm.sourceTable" placeholder="请选择输入表名"
                     clearable filterable allow-create>
            <el-option
                v-for="item in tableList"
                :key="item.tableName"
                :label="item.tableName"
                :value="item.tableName">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="校验规则" prop="rules_id">
          <el-select v-model="addForm.rulesId" placeholder="请选择校验规则" multiple
                     clearable>
            <el-option
                v-for="item in checkRules"
                :key="item.id"
                :label="item.ruleName"
                :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="误差" prop="count_error_range" style="width: 70%">
          <el-input  v-model="addForm.countErrorRange" placeholder="请输入误差" clearable></el-input>
        </el-form-item>


      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAdd('addForm')">确 定</el-button>
            </span>
    </el-dialog>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" :visible.sync="editVisible" width="25%">
      <el-form ref="editForm" :model="editForm" :rules="rules" label-width="130px">
        <el-form-item label="任务说明" prop="check_context" style="width: 70%">
          <el-input v-model="editForm.checkContext" clearable></el-input>
        </el-form-item>
        <el-form-item label="输入数据源" prop="datasource_input_id">
          <el-select v-model="editForm.datasourceInputId" v-on:change="inputDBAjax($event)" placeholder="请选择输入数据源"
                     clearable filterable allow-create>
            <el-option
                v-for="item in datasourcesList"
                :key="item.id"
                :label="item.dataSourceContext"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="系统名" prop="system_name">
          <el-select v-model="editForm.systemName"  placeholder="请选择输入数据源"
                     clearable filterable allow-create>
            <el-option
                v-for="item in datasourcesList"
                :key="item.id"
                :label="item.systemName"
                :value="item.systemName">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="输入数据源库名" prop="database_name_input">
          <el-select v-model="editForm.sourceDb" v-on:change="inputTableAjax($event)" placeholder="请选择输入数据源库名"
                     clearable filterable allow-create>
            <el-option
                v-for="item in inputDbList"
                :key="item.dbName"
                :label="item.dbName"
                :value="item.dbName">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="输入数据源表名" prop="table_name">
          <el-select v-model="editForm.sourceTable" placeholder="请选择输入数据源表名"
                     clearable filterable allow-create>
            <el-option
                v-for="item in tableList"
                :key="item.tableName"
                :label="item.tableName"
                :value="item.tableName">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="校验规则" prop="check_rule">
          <el-input v-model="editForm.rulesId" placeholder="请输入校验规则" style="width: 70%" clearable></el-input>
        </el-form-item>


        <el-form-item label="误差" prop="count_error_range">
          <el-input v-model="editForm.countErrorRange" placeholder="请输入误差" style="width: 70%" clearable filterable allow-create></el-input>
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
  selectDBByDatasource,
  selectTableByDB
} from "../../../api/gatherDolphin";
import {selectAllDatasources} from "../../../api/datasource";
import {selectUserList} from "../../../api/user";
import {insertGatherQuality,selectGatherQualityList, selectQualityRules,deleteGatherQuality,updateGatherQuality} from "../../../api/gatherQuality";

export default {
  name: 'gatherDolphinList',
  data() {
    return {
      exeStartTime: '2015-09-02 12:23:10',
      query: {
        data: {},
        currentPage: 1,
        pageNumber: 10
      },
      tableData: [],
      datasourcesList: [],
      datasourcesDBList: [],
      checkRules: [],
      inputDbList: [],
      tableList: [],
      usersList: [],
      databaseNameInput: '',
      datasourceInput: '',
      multipleSelection: [],
      editVisible: false,
      addVisible: false,
      pageTotal: 0,
      addForm: {},
      editForm: {},
      editDolphinJsonFrom: {},
      idx: -1
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      selectAllDatasources().then(res => {
        this.datasourcesList = res.data;
      });
      selectUserList(this.query).then(res => {
        this.usersList = res.data.list;
      });
     selectGatherQualityList(this.query).then(res => {
        this.tableData = res.data.list;
        this.pageTotal = res.data.pageUtil.totalNumber || 50;
      });
      selectQualityRules().then(res => {
        this.checkRules = res.data;
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
      this.$confirm('确定要删除[' + row.checkContext + ']吗？', '提示', {
        type: 'warning'
      })
          .then(() => {
            deleteGatherQuality({ids: row.id}).then(res => {
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
      let checkContexts = '';
      for (let i = 0; i < length; i++) {
        if (i + 1 == length) {
          str += this.multipleSelection[i].id
          checkContexts += this.multipleSelection[i].checkContext
        } else {
          str += this.multipleSelection[i].id + ',';
          checkContexts += this.multipleSelection[i].checkContext + ','
        }
      }
      this.$confirm('确定要删除[' + checkContexts + ']吗？', '提示', {
        type: 'warning'
      })
          .then(() => {
            deleteGatherQuality({ids: str}).then(res => {
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
    //异步请求db
    inputDBAjax(event) {
      selectDBByDatasource({id: event}).then(res => {
        this.inputDbList = res.data;
      });
      this.datasourceInput = event
    },
    //异步请求table
    inputTableAjax(event) {
      selectTableByDB({id: this.datasourceInput, db: event}).then(res => {
        this.tableList = res.data;
      });
    },
    // 编辑操作
    handleEdit(index, row) {
      this.idx = index;
      this.editForm = row;
      selectQualityRules().then(res => {
        this.checkRules = res.data;
      });
      this.editVisible = true;
    },
    // 保存新增
    saveAdd(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          insertGatherQuality(this.addForm).then(res => {
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
          updateGatherQuality(this.editForm).then(res => {
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
