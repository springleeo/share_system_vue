<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 用户列表
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <!-- 搜素 -->
      <div class="handle-box">
        <el-select
          v-model="query.address"
          placeholder="部门"
          class="handle-select mr10"
        >
          <el-option key="1" label="财务部" value="财务部"></el-option>
          <el-option key="2" label="市场部" value="市场部"></el-option>
        </el-select>
        <el-input
          v-model="query.username"
          placeholder="用户名"
          class="handle-input mr10"
        ></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch"
          >搜索</el-button
        >
      </div>

      <!-- 列表数据 -->
      <el-table
        :data="users"
        border
        class="table"
        ref="multipleTable"
        header-cell-class-name="table-header"
      >
        <el-table-column
          prop="id"
          label="ID"
          width="55"
          align="center"
        ></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="department" label="部门"></el-table-column>
        <el-table-column label="头像(查看大图)" align="center">
          <template #default="scope">
            <el-image
              class="table-td-thumb"
              :src="'http://127.0.0.1:8080'+scope.row.avatar"
              :preview-src-list="[scope.row.avatar]"
            >
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="addr" label="地址"></el-table-column>

        <el-table-column label="状态" align="center">
          <template #default="scope">
            <el-tag
              :type="
                scope.row.state === 1
                  ? 'success'
                  : scope.row.state === 2
                  ? 'danger'
                  : ''
              "
              v-if="scope.row.state == 1"
              >启用</el-tag
            >
            <el-tag
              :type="
                scope.row.state === 1
                  ? 'success'
                  : scope.row.state === 2
                  ? 'danger'
                  : ''
              "
              v-if="scope.row.state == 2"
              >停用</el-tag
            >
          </template>
        </el-table-column>

        <el-table-column prop="create_time" label="注册时间"></el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template #default="scope">
            <el-button
              class="red"
              type="text"
              @click="active(scope.row.id, scope.row.state)"
              v-if="scope.row.state == 1"
              >停用
            </el-button>
            <el-button
              type="text"
              @click="active(scope.row.id, scope.row.state)"
              v-if="scope.row.state == 2"
              >启用
            </el-button>
            <el-button type="text" @click="handleEdit(scope.row.id, scope.row)"
              >编辑
            </el-button>
            <el-button
              type="text"
              class="red"
              @click="handleDelete(scope.row.id, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          @size-change="ChangePageSize"
          @current-change="ChangeCurrentPage"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :current-page="CurrentPage"
          :page-size="pageSize"
          :page-sizes="pageSizes"
          :total="pageTotal"
        ></el-pagination>
      </div>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" v-model="editVisible" width="30%">
      <el-form label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.pwd"></el-input>
        </el-form-item>
        <el-form-item label="部门">
          <el-input v-model="form.department"></el-input>
        </el-form-item>
        <el-form-item label="头像">
          <el-image class="table-td-thumb" :src="form.avatar"></el-image>
        </el-form-item>
        <el-form-item label="更换头像">
          <el-input type="file" v-model="form.new_avatar"></el-input>
        </el-form-item>

        <el-form-item label="地址">
          <el-input v-model="form.addr"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.state">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="2">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveEdit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { fetchData } from "../api/index";

export default {
  data() {
    return {
      query: {
        address: "",
        username: "",
      },
      users: [
        {
          id: 1,
          username: "张三",
          department: "财务部",
          avatar: "/src/assets/img/img.jpg",
          addr: "北京",
          state: 1,
          create_time: "2021-3-21",
        },
        {
          id: 2,
          username: "李四",
          department: "市场部",
          avatar: "/src/assets/img/img.jpg",
          addr: "长沙",
          state: 1,
          create_time: "2020-5-12",
        },
        {
          id: 3,
          username: "王五",
          department: "市场部",
          avatar: "/src/assets/img/img.jpg",
          addr: "长沙",
          state: 1,
          create_time: "2020-5-12",
        },
      ],
      currentPage: 1,
      pageSize: 5,
      pageTotal: 300,
      pageSizes: [5, 10, 15],
      editVisible: false,
      form: {
        id: 3,
        username: "王五",
        pwd: "",
        department: "市场部",
        avatar: "/src/assets/img/img.jpg",
        new_avatar: "",
        addr: "长沙",
        state: 2,
        create_time: "2020-5-12",
      },
    };
  },
  mounted() {
    this.getUsers();
  },

  methods: {
    // 修改每页显示的条数
    ChangePageSize(size) {
      this.pageSize = size;
      this.getUsers();
    },
    // 修改当前页码
    ChangeCurrentPage(current_page) {
      this.currentPage = current_page;
      this.getUsers();
    },
    // 获取后端数据
    getUsers() {
      this.$axios
        .get("/user/user_list", {
          params: {
            page_size: this.pageSize,
            current_page: this.currentPage,
          },
        })
        .then((rep) => {
          // console.log(rep);
          if (rep.status == 200) {
            this.users = rep.data.users;
            this.pageSize = rep.data.pageSize;
            this.pageTotal = rep.data.pageTotal;
            this.currentPage = rep.data.currentPage;
            this.create_time = rep.data.create_time;
          }
        });
    },
    active(id, state) {
      this.$axios
        .post("/user/active", {
          id: id,
          state: state,
        })
        .then((rep) => {
          alert(rep.data.msg);
          // this.form.state = rep.data.state;
          window.location.reload("/main/user_list");
        });
    },
    handleEdit(id, row) {
      Object.keys(this.form).forEach((item) => {
        this.form[item] = row[item];
      });
      this.editVisible = true;
    },
    saveEdit() {
      const formData = new FormData();
      formData.append("id", this.form.id);
      formData.append("username", this.form.username);
      formData.append("pwd", this.form.pwd);
      formData.append("department", "市场部");
      formData.append("addr", this.form.addr);
      formData.append("state", this.form.state);
      formData.append("state", this.form.create_time);
      formData.append(
        "avatar",
        document.querySelector("input[type=file]").files[0]
      );
      this.$axios.post("/user/update", formData).then((rep) => {
        if (rep.data.code == 200) {
          alert("更新成功");
          window.location.reload("/main/user_list");
        }
      });
    },
  },
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

