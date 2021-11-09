<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-calendar"></i> 工作流监控
        </el-breadcrumb-item>
        <el-breadcrumb-item>工作流实例</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-input v-model="query.data.project_name" placeholder="项目名称" class="handle-input mr10"></el-input>
        <el-input v-model="query.data.ds_id" placeholder="实例编号" class="handle-input mr10"></el-input>
        <el-input v-model="query.data.process_name" placeholder="工作流名称" class="handle-input mr10"></el-input>
        <el-input v-model="query.data.state" placeholder="工作流状态" class="handle-input mr10"></el-input>
        <el-input v-model="query.data.scheduling_time" placeholder="调度时间" class="handle-input mr10"></el-input>
        <el-input v-model="query.data.executor" placeholder="执行用户" class="handle-input mr10"></el-input>
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
        <el-table-column prop="dsId" label="实例编号"></el-table-column>
        <el-table-column prop="projectName" label="项目名称"></el-table-column>
        <el-table-column prop="processName" label="工作流名称"></el-table-column>
        <el-table-column prop="state" label="工作流状态"></el-table-column>
        <el-table-column prop="runType" label="运行类型"></el-table-column>
        <el-table-column prop="schedulingTime" label="调度时间"></el-table-column>
        <el-table-column prop="startTime" label="开始时间"></el-table-column>
        <el-table-column prop="endTime" label="结束时间"></el-table-column>
        <el-table-column prop="duration" label="运行时长"></el-table-column>
        <el-table-column prop="runTimes" label="运行次数"></el-table-column>
        <el-table-column prop="executor" label="执行用户"></el-table-column>
        <el-table-column prop="host" label="执行主机"></el-table-column>
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
  </div>
</template>

<script>
import {
  selectProcessInstanceList
} from '../../../api/processInstance';
export default {
  name: 'processInstanceList',
  data() {
    return {
      query: {
        data: {},
        currentPage: 1,
        pageNumber: 10
      },

      tableData: [],
      pageTotal: 0,
      idx: -1
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      selectProcessInstanceList(this.query).then(res => {
        this.tableData = res.data.list;
        this.pageTotal = res.data.pageUtil.totalNumber || 50;
      });
    },
    // 触发搜索按钮
    handleSearch() {
      this.$set(this.query, 'currentPage', 1);
      this.getData();
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
  width: 239px;
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
