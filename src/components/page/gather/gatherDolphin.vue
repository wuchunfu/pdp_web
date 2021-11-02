<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-calendar"></i> Dolphin数据采集任务管理
        </el-breadcrumb-item>
        <el-breadcrumb-item>Dolphin数据采集任务列表</el-breadcrumb-item>
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
        <el-input v-model="query.data.gather_context" placeholder="任务说明" class="handle-input mr10" clearable></el-input>
        <el-input v-model="query.data.database_name_input" placeholder="输入数据源库名" class="handle-input mr10"
                  clearable></el-input>
        <el-select v-model="query.data.sync_type" placeholder="同步方式" class="handle-input mr10" clearable>
          <el-option
              v-for="item in syncTypeList"
              :key="item.id"
              :label="item.syncType"
              :value="item.id">
          </el-option>
        </el-select>
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
        <el-table-column prop="id" label="序号" width="55" align="center"></el-table-column>
        <el-table-column prop="gatherJobId" label="任务ID"></el-table-column>
        <el-table-column prop="gatherContext" label="任务说明"></el-table-column>
        <el-table-column prop="datasourceInput" label="输入数据源">
          <template slot-scope="scope">
            {{
              datasourcesList.find((item) => {
                return scope.row.datasourceInput === item.id;
              }).dataSourceContext
            }}
          </template>
        </el-table-column>
        <el-table-column prop="databaseNameInput" label="输入数据源库名"></el-table-column>
        <el-table-column prop="tableName" label="输入数据源表名"></el-table-column>
        <el-table-column prop="datasourceOutput" label="输出数据源">
          <template slot-scope="scope">
            {{
              datasourcesList.find((item) => {
                return scope.row.datasourceOutput === item.id;
              }).dataSourceContext
            }}
          </template>
        </el-table-column>
        <el-table-column prop="syncType" label="同步方式">
          <template slot-scope="scope">
            {{
              syncTypeList.find((item) => {
                return scope.row.syncType === item.id;
              }).syncType
            }}
          </template>
        </el-table-column>
        <el-table-column prop="datasourceDolphin" label="Dolphin源">
          <template slot-scope="scope">
            {{
              datasourcesList.find((item) => {
                return scope.row.datasourceDolphin === item.id;
              }).dataSourceContext
            }}
          </template>
        </el-table-column>
        <el-table-column prop="dolphinProjectName" label="Dolphin项目名"></el-table-column>
        <el-table-column prop="createHiveTable" label="创建hive表" align="center">
          <template slot-scope="scope">
            <el-tag
                :type="scope.row.createHiveTable===true?'success':(scope.row.createHiveTable===false?'info':'')"
            >{{ scope.row.createHiveTable === true ? 'YES' : (scope.row.createHiveTable === false ? 'NO' : '') }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="isOnline" label="dolphin任务状态" align="center">
          <template slot-scope="scope">
            <el-tag
                :type="scope.row.online===true?'success':(scope.row.online===false?'info':'')"
            >{{ scope.row.online === true ? 'onLine' : (scope.row.online === false ? 'offLine' : '') }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="crontab" label="定时"></el-table-column>
        <el-table-column prop="gatherJobInfo" label="Dolphin任务信息">
          <template scope="scope">
            <el-button v-if="scope.row.gatherJobInfo!=''" @click="handleJson(scope.$index, scope.row)" type="primary" align="center" size="small">查看</el-button>
          </template>
        </el-table-column>
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

        <el-table-column label="操作" width="120" align="center">
          <template slot-scope="scope">
            <el-dropdown trigger="click" split-button type="primary">操作
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="scope.row.syncType==2" style="font-size: medium" @click.native="initJob(scope.$index,scope.row)">create init job
                </el-dropdown-item>
                <el-dropdown-item style="font-size: medium" @click.native="createJobByTemplate(scope.$index,scope.row)">
                  create job by temp
                </el-dropdown-item>
                <el-dropdown-item style="font-size: medium" @click.native="onLine(scope.$index,scope.row)">上线任务
                </el-dropdown-item>
                <el-dropdown-item style="font-size: medium" @click.native="offLine(scope.$index,scope.row)">下线任务
                </el-dropdown-item>
                <el-dropdown-item style="font-size: medium" @click.native="delJob(scope.$index,scope.row)">删除任务
                </el-dropdown-item>
                <el-dropdown-item style="font-size: medium" @click.native="syncDolphinJob(scope.$index,scope.row)">同步job
                  json
                </el-dropdown-item>
                <el-dropdown-item style="font-size: medium" @click.native="createJobByJson(scope.$index,scope.row)">
                  create job by json
                </el-dropdown-item>
                <el-dropdown-item style="font-size: medium" @click.native="handleEdit(scope.$index,scope.row)">编辑
                </el-dropdown-item>
                <el-dropdown-item style="font-size: medium" @click.native="handleDelete(scope.$index,scope.row)">删除
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
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

    <!--    job json编辑框-->
    <el-dialog title=" 修改job json" :visible.sync="jobJsonVisible" modal-append-to-body="false">
      <el-form ref="jobJson" :model="jobJsonForm" label-width="100px">
        <vue-json-editor label="job json" prop="gatherJobInfo" v-model="jobJsonForm.gatherJobInfo"></vue-json-editor>
        <el-form-item>
          <template scope="scope">
                 <span slot="footer" class="dialog-footer">
                <el-button @click="jobJsonVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveJson('jobJsonForm')">修改</el-button>
            </span>
          </template>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 新增弹出框 -->
    <el-dialog title="添加" :visible.sync="addVisible" width="25%">
      <el-form ref="addForm" :model="addForm" :rules="rules" label-width="130px">
        <el-form-item label="任务说明" prop="gather_context" style="width: 69%">
          <el-input v-model="addForm.gatherContext" clearable></el-input>
        </el-form-item>
        <el-form-item label="输入数据源" prop="datasource_input">
          <el-select v-model="addForm.datasourceInput" v-on:change="inputDBAjax($event)" placeholder="请选择输入数据源"
                     clearable filterable allow-create>
            <el-option
                v-for="item in datasourcesList"
                :key="item.id"
                :label="item.dataSourceContext"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="输入数据源库名" prop="database_name_input">
          <el-select v-model="addForm.databaseNameInput" v-on:change="inputTableAjax($event)" placeholder="请选择输入数据源库名"
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
          <el-select v-model="addForm.tableName" placeholder="请选择输入数据源表名"
                     clearable filterable allow-create>
            <el-option
                v-for="item in tableList"
                :key="item.tableName"
                :label="item.tableName"
                :value="item.tableName">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="输出数据源(hive)" prop="datasource_output">
          <el-select v-model="addForm.datasourceOutput" placeholder="请选择输入数据源库名" clearable filterable allow-create>
            <el-option
                v-for="item in datasourcesList"
                :key="item.id"
                :label="item.dataSourceContext"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建hive表" prop="create_hive_table">
          <el-select v-model="addForm.createHiveTable" placeholder="请选择是否创建hive表" clearable>
            <el-option label="创建" :value=true></el-option>
            <el-option label="不创建" :value=false></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="同步方式" prop="sync_type">
          <el-select v-model="addForm.syncType" placeholder="请选择同步方式" clearable>
            <el-option
                v-for="item in syncTypeList"
                :key="item.id"
                :label="item.syncType"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Dolphin源" prop="datasource_dolphin">
          <el-select v-model="addForm.datasourceDolphin" v-on:change="inputDolphinAjax($event)"
                     placeholder="请选择Dolphin源"
                     clearable filterable allow-create>
            <el-option
                v-for="item in datasourcesList"
                :key="item.id"
                :label="item.dataSourceContext"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Dolphin项目名" prop="dolphin_project_name">
          <el-select v-model="addForm.dolphinProjectName" placeholder="请选择Dolphin项目名" clearable filterable allow-create>
            <el-option
                v-for="item in dolphinProjectList"
                :key="item.dbName"
                :label="item.dbName"
                :value="item.dbName">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="crontab表达式" prop="crontab">
          <template>
            <el-input v-model="addForm.crontab" :autoFormCreate="addForm.crontab = this.crontab"
                      placeholder="请输入crontab表达式" style="width: 59%" clearable></el-input>&#8195;

            <el-button type="primary" @click="showDialog">生成cron</el-button>
            <el-dialog title="crontab配置" :visible.sync="showCron">
              <vcrontab @hide="showCron=false" @fill="crontabFill" :expression="expression"></vcrontab>
            </el-dialog>
          </template>
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
        <el-form-item label="任务说明" prop="gather_context" style="width: 69%">
          <el-input v-model="editForm.gatherContext" clearable></el-input>
        </el-form-item>
        <el-form-item label="输入数据源" prop="datasource_input">
          <el-select v-model="editForm.datasourceInput" v-on:change="inputDBAjax($event)" placeholder="请选择输入数据源"
                     clearable filterable allow-create>
            <el-option
                v-for="item in datasourcesList"
                :key="item.id"
                :label="item.dataSourceContext"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="输入数据源库名" prop="database_name_input">
          <el-select v-model="editForm.databaseNameInput" v-on:change="inputTableAjax($event)" placeholder="请选择输入数据源库名"
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
          <el-select v-model="editForm.tableName" placeholder="请选择输入数据源表名"
                     clearable filterable allow-create>
            <el-option
                v-for="item in tableList"
                :key="item.tableName"
                :label="item.tableName"
                :value="item.tableName">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="输出数据源(hive)" prop="datasource_output">
          <el-select v-model="editForm.datasourceOutput" placeholder="请选择输入数据源库名" clearable filterable allow-create>
            <el-option
                v-for="item in datasourcesList"
                :key="item.id"
                :label="item.dataSourceContext"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建hive表" prop="create_hive_table">
          <el-select v-model="editForm.createHiveTable" placeholder="请选择是否创建hive表" clearable>
            <el-option label="创建" :value=true></el-option>
            <el-option label="不创建" :value=false></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="同步方式" prop="sync_type">
          <el-select v-model="editForm.syncType" placeholder="请选择同步方式" clearable>
            <el-option
                v-for="item in syncTypeList"
                :key="item.id"
                :label="item.syncType"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Dolphin源" prop="datasource_dolphin">
          <el-select v-model="editForm.datasourceDolphin" v-on:change="inputDolphinAjax($event)"
                     placeholder="请选择Dolphin源"
                     clearable filterable allow-create>
            <el-option
                v-for="item in datasourcesList"
                :key="item.id"
                :label="item.dataSourceContext"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Dolphin项目名" prop="dolphin_project_name">
          <el-select v-model="editForm.dolphinProjectName" placeholder="请选择Dolphin项目名" clearable filterable allow-create>
            <el-option
                v-for="item in dolphinProjectList"
                :key="item.dbName"
                :label="item.dbName"
                :value="item.dbName">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="crontab表达式" prop="crontab">
          <el-input v-model="editForm.crontab" placeholder="请输入crontab表达式" style="width: 59%" clearable></el-input>
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
  selectGatherDolphinList,
  selectSyncType,
  selectTableByDB,
  offLineDolphinJob,
  delJobOnDolphin,
  createJobByTemplate,
  createJobByJson,
  syncDolphinJobJson,
  initJob,
  insertGatherDolphin, deleteGatherDolphin, updateGatherDolphinsInfo, onLineDolphinJob
} from "../../../api/gatherDolphin";
import {selectAllDatasources, selectDataSourcesType} from "../../../api/datasource";
import vcrontab from 'vcrontab'
import {selectUserList} from "../../../api/user";

import vueJsonEditor from 'vue-json-editor'

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
      jobJsonForm: [],
      jobJsonVisible: false,
      expression: "",
      jobInfoJson: "",
      showCron: false,
      tableData: [],
      datasourcesList: [],
      datasourcesDBList: [],
      inputDbList: [],
      dolphinProjectList: [],
      outputDbList: [],
      tableList: [],
      usersList: [],
      dataSourcesTypeList: [],
      databaseNameInput: '',
      datasourceInput: '',
      datasourceOutput: '',
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
  components: {
    vcrontab,
    vueJsonEditor,
  },
  created() {
    this.getData();
  },
  methods: {
    crontabFill(value) {
      this.crontab = value;
    },
    showDialog() {
      this.expression = this.crontab;
      " this.expression ", this.expression;
      this.showCron = true;
    },
    getData() {
      selectAllDatasources().then(res => {
        this.datasourcesList = res.data;
      });
      selectSyncType().then(res => {
        this.syncTypeList = res.data;
      });
      selectUserList(this.query).then(res => {
        this.usersList = res.data.list;
      });
      selectGatherDolphinList(this.query).then(res => {
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
      this.$confirm('确定要删除[' + row.gatherContext + ']吗？', '提示', {
        type: 'warning'
      })
          .then(() => {
            deleteGatherDolphin({ids: row.id}).then(res => {
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
      let gatherContexts = '';
      for (let i = 0; i < length; i++) {
        if (i + 1 == length) {
          str += this.multipleSelection[i].id
          gatherContexts += this.multipleSelection[i].gatherContext
        } else {
          str += this.multipleSelection[i].id + ',';
          gatherContexts += this.multipleSelection[i].gatherContext + ','
        }
      }
      this.$confirm('确定要删除[' + gatherContexts + ']吗？', '提示', {
        type: 'warning'
      })
          .then(() => {
            deleteGatherDolphin({ids: str}).then(res => {
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
    //异步请求db
    outputDBAjax(event) {
      selectDBByDatasource({id: event}).then(res => {
        this.outputDbList = res.data;
      });
      this.datasourceOutput = event
    },
    //异步请求dolphin project list
    inputDolphinAjax(event) {
      selectDBByDatasource({id: event}).then(res => {
        this.dolphinProjectList = res.data;
      });
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
      selectDataSourcesType().then(res => {
        this.dataSourcesTypeList = res.data;
      });
      this.editVisible = true;
    },
    //编辑json
    handleJson: function (index, row) {
      this.idx = index;
      this.jobJsonForm = row;//jobJsonForm，即为模态框中显示的信息。
      this.jobJsonVisible = true;//显示模态框
    },
    // 保存json
    saveJson() {
      updateGatherDolphinsInfo(this.jobJsonForm).then(res => {
        if (res.code == '200') {
          this.$message.success(res.msg)
          this.jobJsonVisible = false;
          this.getData();
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 保存新增
    saveAdd(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          insertGatherDolphin(this.addForm).then(res => {
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
          updateGatherDolphinsInfo(this.editForm).then(res => {
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
    },
    // init任务
    initJob(index, row) {
      // 二次确认删除
      this.$confirm('确定要创建初始化[' + row.gatherContext + ']任务吗？创建完成后需要手动执行任务', '提示', {
        type: 'warning'
      })
          .then(() => {
            initJob({ids: row.id}).then(res => {
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
    // 上线任务
    onLine(index, row) {
      // 二次确认上线
      this.$confirm('确定要上线[' + row.gatherContext + ']吗？', '提示', {
        type: 'warning'
      })
          .then(() => {
            onLineDolphinJob({ids: row.id}).then(res => {
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
    // 下线任务
    offLine(index, row) {
      // 二次确认删除
      this.$confirm('确定要下线[' + row.gatherContext + ']吗？', '提示', {
        type: 'warning'
      })
          .then(() => {
            offLineDolphinJob({ids: row.id}).then(res => {
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
    // 删除dolphin任务
    delJob(index, row) {
      // 二次确认删除
      this.$confirm('确定要删除[' + row.gatherContext + ']吗？', '提示', {
        type: 'warning'
      })
          .then(() => {
            delJobOnDolphin({ids: row.id}).then(res => {
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
    // 同步dolphin任务
    syncDolphinJob(index, row) {
      // 二次确认删除
      this.$confirm('原有json会被覆盖，确定要同步[' + row.gatherContext + ']吗？', '提示', {
        type: 'info'
      })
          .then(() => {
            syncDolphinJobJson({ids: row.id}).then(res => {
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
    // createJobByJson
    createJobByJson(index, row) {
      // 二次确认删除
      this.$confirm('原有任务会被删除，确定要通过json创建[' + row.gatherContext + ']吗？', '提示', {
        type: 'warning'
      })
          .then(() => {
            createJobByJson({ids: row.id}).then(res => {
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
    // createJobByTemplate
    createJobByTemplate(index, row) {
      // 二次确认删除
      this.$confirm('确定要创建[' + row.gatherContext + ']吗？', '提示', {
        type: 'info'
      })
          .then(() => {
            createJobByTemplate({ids: row.id}).then(res => {
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
