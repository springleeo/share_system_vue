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
        :data="tableData"
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
        <el-table-column prop="name" label="用户名"></el-table-column>
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
        <el-table-column prop="address" label="地址"></el-table-column>

        <el-table-column label="状态" align="center">
          <template #default="scope">
            <el-tag
              :type="
                scope.row.state === '启用'
                  ? 'success'
                  : scope.row.state === '停用'
                  ? 'danger'
                  : ''
              "
              >{{ scope.row.state }}</el-tag
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
          background
          layout="total, sizes, prev, pager, next, jumper"
          :current-page="CurrentPage"
          :page-size="pageSize"
          :page-sizes="pageSizes"
          :total="pageTotal"
          @current-change="PageChange"
        ></el-pagination>
      </div>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" v-model="editVisible" width="30%">
      <el-form label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="部门">
          <el-input v-model="form.department"></el-input>
        </el-form-item>
        <el-form-item label="头像">
          <el-image class="table-td-thumb" :src="form.avatar"></el-image>
        </el-form-item>

        <el-form-item label="地址">
          <el-input v-model="form.address"></el-input>
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
      tableData: [
        {
          id: 1,
          name: "张三",
          department: "财务部",
          avatar: "/src/assets/img/img.jpg",
          address: "北京",
          state: "启用",
          create_time: "2021-3-21",
        },
        {
          id: 2,
          name: "李四",
          department: "市场部",
          avatar: "/src/assets/img/img.jpg",
          address: "长沙",
          state: "停用",
          create_time: "2020-5-12",
        },
        {
          id: 3,
          name: "王五",
          department: "市场部",
          avatar: "/src/assets/img/img.jpg",
          address: "长沙",
          state: "停用",
          create_time: "2020-5-12",
        },
      ],
      CurrentPage: 1,
      pageSize: 1,
      pageTotal: 3,
      pageSizes: [10, 20, 30],
    };
  },
  methods: {
    PageChange() {},
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

