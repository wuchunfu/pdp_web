<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="24">
                <el-card shadow="hover" class="mgb20" style="height:252px;">
                    <div class="user-info">
                        <img src="../../assets/img/img.jpeg" class="user-avator" alt />
                        <div class="user-info-cont">
                            <div class="user-info-name">{{name}}</div>
                            <div>{{roleName}}</div>
                        </div>
                    </div>
                    <div class="user-info-list">
                        登录时间：
                        <span>{{time}}</span>
                    </div>
                    <div class="user-info-list">
                        登录地点：
                        <span>{{address}}</span>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="24">
                <el-card shadow="hover">
                    <div slot="header" class="clearfix">
                        <span>登陆日志</span>
                    </div>
                    <el-table
                            :data="tableLogData"
                            max-height="500"
                            style="width: 100%;">
                        <el-table-column
                                prop="userName"
                                label="姓名">
                        </el-table-column>
                        <el-table-column
                                prop="ip"
                                label="IP地址">
                        </el-table-column>
                        <el-table-column
                                prop="time"
                                label="登录时间">
                        </el-table-column>
                        <el-table-column
                                prop="isLine"
                                label="状态">
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button
                                        size="mini"
                                        @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                                <el-button
                                        size="mini"
                                        type="danger"
                                        @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import Schart from 'vue-schart';
import {selectLoginLogList} from '../../api/login';
export default {
    name: 'dashboard',
    data() {
        return {
            name: localStorage.getItem('ms_username'),
            roleName: JSON.parse(localStorage.getItem('roleEntities'))[0].name,
            time: localStorage.getItem('time'),
            address: localStorage.getItem('address') === ''?"获取失败":localStorage.getItem('address'),
            tableLogData: [],
        };
    },
    components: {
        Schart
    },
    mounted() {
        this.selectLoginLogList();
    },
    methods: {
        selectLoginLogList() {
            selectLoginLogList(null).then(res => {
                if (res.code === '200') {
                    this.tableLogData = res.data.list
                } else {
                    this.$message.error(res.msg);
                    return false;
                }
            }).catch((res)=>{
                console.log("异常:"+res)
            });
        },
    }
};
</script>


<style scoped>

.user-info {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 2px solid #ccc;
    margin-bottom: 20px;
}

.user-avator {
    width: 120px;
    height: 120px;
    border-radius: 50%;
}

.user-info-cont {
    padding-left: 50px;
    flex: 1;
    font-size: 14px;
    color: #999;
}

.user-info-cont div:first-child {
    font-size: 30px;
    color: #222;
}

.user-info-list {
    font-size: 14px;
    color: #999;
    line-height: 25px;
}

.user-info-list span {
    margin-left: 70px;
}

.mgb20 {
    margin-bottom: 20px;
}

</style>
