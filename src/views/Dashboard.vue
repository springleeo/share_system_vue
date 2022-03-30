<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-card shadow="hover" class="mgb20" style="height:252px;">
                    <div class="user-info">
                        <img :src="'http://127.0.0.1:8080'+avatar" class="user-avator" alt />
                        <div class="user-info-cont">
                            <div class="user-info-name">{{ username }}</div>
                            <div>{{ role }}</div>
                        </div>
                    </div>
                    <div class="user-info-list">
                        上次登录时间：
                        <span>{{lastlogin}}</span>
                    </div>
                
                    <div class="user-info-list">
                        本机 IP 地 址：
                        <span>{{ip}}</span>
                    </div>
                </el-card>
                <el-card shadow="hover" style="height:252px;">
                    <template #header>
                        <div class="clearfix">
                            <span>人员详情</span>
                        </div>
                    </template>
                    超级管理员<el-progress :percentage="adminPer" color="#42b983"></el-progress>
                    普通管理员<el-progress :percentage="puPer" color="#f1e05a"></el-progress>
                    员工<el-progress :percentage="staffPer"></el-progress>
                </el-card>
            </el-col>
            <el-col :span="16">
                <el-row :gutter="20" class="mgb20">
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{ padding: '0px' }">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-user-solid grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{totalFiles}}</div>
                                    <div>总文件数量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{ padding: '0px' }">
                            <div class="grid-content grid-con-2">
                                <i class="el-icon-message-solid grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{shareFiles}}</div>
                                    <div>共享文件数量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{ padding: '0px' }">
                            <div class="grid-content grid-con-3">
                                <i class="el-icon-s-goods grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{personalFiles}}</div>
                                    <div>私有文件数量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
                <el-card shadow="hover" style="height:440px;">
                    <el-col :span="30">
                        <el-card shadow="hover">
                            <schart ref="line" class="schart" canvasId="line" :options="options2"></schart>
                        </el-card>
                    </el-col>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>


<script>
import Schart from "vue-schart";

export default {
  components: { Schart },
  data() {
    return {
      username: "",
      role: "",
      avatar: "",
      lastlogin: "",
      ip: "",
      totalFiles: 0,
      shareFiles: 0,
      personalFiles: 0,
      adminPer: 0,
      puPer: 0,
      staffPer: 0,
      options2: {
        type: "line",
        title: {
          text: "各类文件数量走势图",
        },
        labels: [
          "1月",
          "2月",
          "3月",
          "4月",
          "5月",
          "6月",
          "7月",
          "8月",
          "9月",
          "10月",
          "11月",
          "12月",
        ],
        datasets: [
          {
            label: "私有文件",
            data: [98, 78, 31, 33, 145, 234, 278, 270, 190, 230, 213, 113],
          },
          {
            label: "部门文件",
            data: [31, 56, 69, 52, 111, 164, 178, 150, 135, 160, 267, 129],
          },
          {
            label: "共享文件",
            data: [90, 235, 200, 114, 145, 74, 218, 100, 135, 190, 112, 198],
          },
        ],
      },
    };
  },

  mounted() {
    this.getIndexData();
  },
  methods: {
    getIndexData() {
      this.$axios
        .get("/index", 
        // {
          // 携带token，main.js中请求拦截器中设置了携带token需求
          // headers: {
          //   Authorization: "Bearer " + localStorage.getItem("token"),
          // },
        // }
        )
        .then((rep) => {
          if (rep.status == 200) {
            console.log(rep)
            this.username = rep.data.user.username;
            this.role = rep.data.role;
            this.avatar = rep.data.user.avatar;
            this.lastlogin = rep.data.user.last_login_date;
            this.ip = rep.data.user.ip;
            this.totalFiles = rep.data.totalFiles;
            this.shareFiles = rep.data.shareFiles;
            this.personalFiles = rep.data.personalFiles;
            this.adminPer = rep.data.adminPer;
            this.puPer = rep.data.puPer;
            this.staffPer = rep.data.staffPer;
            this.options2.labels = rep.data.schart_data.labels;
            this.options2.datasets[0].data = rep.data.schart_data.datas[0];
            this.options2.datasets[1].data = rep.data.schart_data.datas[1];
            this.options2.datasets[2].data = rep.data.schart_data.datas[2];
          }
        });
    },
  },
};
</script>

<style scoped>
.el-row {
    margin-bottom: 20px;
}

.grid-content {
    display: flex;
    align-items: center;
    height: 100px;
}

.grid-cont-right {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #999;
}

.grid-num {
    font-size: 30px;
    font-weight: bold;
}

.grid-con-icon {
    font-size: 50px;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    color: #fff;
}

.grid-con-1 .grid-con-icon {
    background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
    background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
    background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
    color: rgb(242, 94, 67);
}

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

.todo-item {
    font-size: 14px;
}

.todo-item-del {
    text-decoration: line-through;
    color: #999;
}

.schart {
    width: 880px;
    height: 330px;
}
</style>
