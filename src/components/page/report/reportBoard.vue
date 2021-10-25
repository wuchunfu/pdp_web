<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-calendar"></i> 报表开发
        </el-breadcrumb-item>
        <el-breadcrumb-item>报表看板</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div>
        <div v-for="(item) in tableData" style="margin-top: 10px;:width:searchTableWidth;
        :height:searchTableHeight"
             >
          <p style="height: 50px;font-size: 22px;">
            <a :href="item.url" target="_blank" style="color:deepskyblue">
              {{ item.name }}
            </a>
          </p>
          <iframe
              style="border:none"
              width=100%;
              height=1000px
              v-bind:src="item.url"
          ></iframe>
        </div>
      </div>

    </div>
  </div>
</template>
<script>
import {selectReportBoardLinkList} from "../../../api/platformLink";

export default {
  name: 'reportList',
  data() {
    return {
      query: {
        data: {},
        currentPage: 1,
        pageNumber: 10
      },
      searchTableHeight: 0,
      searchTableWidth: 0,
      tableData: [],
      usersList: [],
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
  mounted() {
    // document.getElementsByName('content-wrapper');
    window.onresize = () => {
      this.widthHeight(); // 自适应高宽度
    };
    this.$nextTick(function () {
      this.widthHeight();
    });
  },
  methods: {
    getData() {

      selectReportBoardLinkList(this.query).then(res => {
        this.tableData = res.data;
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },


    widthHeight() {
      this.searchTableHeight = window.innerHeight;
      this.searchTableWidth = window.innerWidth - 50
    },

    handleRemove(file) {
      console.log(file);
    },
    handlePictureCardPreview(file) {
      // window.window.open('http://www.baidu.com', "_blank");
      // this.dialogImageUrl = "http://www.baidu.com";
      this.addForm.name = file.file;
      this.dialogVisible = true;
    },
    handleDownload(file) {
      console.log(file);
    }
  }
}
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