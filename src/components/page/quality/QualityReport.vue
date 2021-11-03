<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-calendar"></i> 数据校验任务报告
        </el-breadcrumb-item>
        <el-breadcrumb-item>数据校验结果列表</el-breadcrumb-item>
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
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="systemName" label="系统名"></el-table-column>
        <el-table-column prop="dbName" label="库名"></el-table-column>
        <el-table-column prop="tableName" label="表名"></el-table-column>
        <el-table-column prop="sourceCount" label="数据源数据量"></el-table-column>
        <el-table-column prop="sinkCount" label="目标源数据量"></el-table-column>
        <el-table-column prop="result" label="校验结果是否合格">
          <template slot-scope="scope">
            <el-tag
            :type="scope.row.result===true ? 'success':(scope.row.result===false?'info':'')"
            >
              {{ scope.row.result === true ? '合格' : (scope.row.result === false ? '不合格' : '') }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column prop="updateTime" label="更新时间"></el-table-column>

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

import {selectCheckResultList} from "../../../api/qualityReport";

export default {
  name: 'qulityReportList',
  data() {
    return {
      exeStartTime: '2015-09-02 12:23:10',
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

      selectCheckResultList(this.query).then(res => {
        this.tableData = res.data;
        this.pageTotal = res.data.pageUtil.totalNumber || 50;
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

.table {
  width: 100%;
  font-size: 14px;
}



</style>
