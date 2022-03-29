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
              :src="scope.row.avatar"
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
        <el-form-item label="部门">
          <el-input v-model="form.department"></el-input>
        </el-form-item>
        <el-form-item label="头像">
          <el-image class="table-td-thumb" :src="form.avatar"></el-image>
        </el-form-item>

        <el-form-item label="地址">
          <el-input v-model="form.addr"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-input v-model="form.state"></el-input>
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
          state: "1",
          create_time: "2021-3-21",
        },
        {
          id: 2,
          username: "李四",
          department: "市场部",
          avatar: "/src/assets/img/img.jpg",
          addr: "长沙",
          state: "2",
          create_time: "2020-5-12",
        },
        {
          id: 3,
          username: "王五",
          department: "市场部",
          avatar: "/src/assets/img/img.jpg",
          addr: "长沙",
          state: "2",
          create_time: "2020-5-12",
        },
      ],
      currentPage: 1,
      pageSize: 3,
      pageTotal: 300,
      pageSizes: [5, 10, 15],
    };
  },
  mounted() {
    this.getUsers();
  },

  methods: {
    // 修改每页显示的条数
    ChangePageSize(size) {
      this.pageSize = size;
    },
    // 修改当前页码
    ChangeCurrentPage(current_page) {
      this.CurrentPage = current_page;
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
          console.log(rep);
          if (rep.status == 200) {
            this.users = rep.data.users;
            this.pageSize = rep.data.pageSize;
            this.pageTotal = rep.data.pageTotal;
            this.currentPage = rep.data.currentPage;
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

