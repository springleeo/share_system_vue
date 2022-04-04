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
        <el-select v-model="query.department"
                   class="m-2"
                   placeholder="部门"
                   size="large">
          <el-option v-for="item, key in query.departments"
                     :key="key"
                     :value="item.name" />
        </el-select>

        <el-input v-model="query.username"
                  placeholder="用户名"
                  class="handle-input mr10"></el-input>
        <el-button type="primary"
                   icon="el-icon-search"
                   @click="handleSearch">搜索</el-button>
      </div>
      <!-- 添加数据 -->
      <div>
        <el-button type="primary"
                   class="el-icon-lx-add"
                   id="addbottom"
                   @click="handleAdd">添加</el-button>
      </div>

      <!-- 列表数据 -->
      <el-table :data="users"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header">
        <el-table-column prop="id"
                         label="ID"
                         width="55"
                         align="center"></el-table-column>
        <el-table-column prop="username"
                         label="用户名"></el-table-column>
        <el-table-column prop="name"
                         label="部门"></el-table-column>
        <el-table-column label="头像(查看大图)"
                         align="center">
          <template #default="scope">
            <el-image class="table-td-thumb"
                      :src="baseURL + scope.row.avatar"
                      :preview-src-list="[scope.row.avatar]">
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="addr"
                         label="地址"></el-table-column>

        <el-table-column label="状态"
                         align="center">
          <template #default="scope">
            <el-tag :type="
                scope.row.state === 1
                  ? 'success'
                  : scope.row.state === 2
                  ? 'danger'
                  : ''
              "
                    v-if="scope.row.state == 1">启用</el-tag>
            <el-tag :type="
                scope.row.state === 1
                  ? 'success'
                  : scope.row.state === 2
                  ? 'danger'
                  : ''
              "
                    v-if="scope.row.state == 2">停用</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="create_time"
                         label="注册时间"></el-table-column>
        <el-table-column label="操作"
                         width="180"
                         align="center">
          <template #default="scope">
            <el-button class="red"
                       type="text"
                       @click="active(scope.row.id, scope.row.state)"
                       v-if="scope.row.state == 1">停用
            </el-button>
            <el-button type="text"
                       @click="active(scope.row.id, scope.row.state)"
                       v-if="scope.row.state == 2">启用
            </el-button>
            <el-button type="text"
                       @click="handleEdit(scope.row.id, scope.row)">编辑
            </el-button>
            <el-button type="text"
                       class="red"
                       @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination @size-change="ChangePageSize"
                       @current-change="ChangeCurrentPage"
                       background
                       layout="total, sizes, prev, pager, next, jumper"
                       :current-page="CurrentPage"
                       :page-size="pageSize"
                       :page-sizes="pageSizes"
                       :total="pageTotal"></el-pagination>
      </div>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑"
               v-model="editVisible"
               width="30%">
      <el-form label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.pwd"></el-input>
        </el-form-item>
        <el-form-item label="部门">
          <!-- <el-input v-model="form.name"></el-input> -->
          <el-select v-model="form.name"
                     class="m-2"
                     placeholder="Select"
                     size="large">
            <el-option v-model="form.name"
                       :value="form.name"></el-option>
            <el-option v-for="item, key in form.departments"
                       :key="key"
                       :value="item.name" />
          </el-select>

        </el-form-item>
        <el-form-item label="头像">
          <el-image class="table-td-thumb"
                    :src="baseURL + form.avatar"></el-image>
        </el-form-item>
        <el-form-item label="更换头像">
          <el-input type="file"
                    v-model="form.new_avatar"></el-input>
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
          <el-button type="primary"
                     @click="saveEdit">确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 添加弹出框 -->
    <el-dialog title="添加"
               v-model="addVisible"
               width="30%">
      <el-form label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="addForm.pwd"></el-input>
        </el-form-item>
        <el-form-item label="部门">
          <el-select v-model="addForm.department"
                     class="m-2"
                     placeholder="Select"
                     size="large">
            <el-option v-for="item, key in addForm.departments"
                       :key="key"
                       :value="item.name" />
          </el-select>

        </el-form-item>
        <el-form-item label="头像">
          <el-input type="file"
                    v-model="addForm.avatar"></el-input>
        </el-form-item>

        <el-form-item label="地址">
          <el-input v-model="addForm.addr"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="addForm.state">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="2">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addVisible = false">取 消</el-button>
          <el-button type="primary"
                     @click="saveAdd">确 定</el-button>
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
  data () {
    return {
      query: {
        //搜索部门名称
        department: "",
        //显示部门名称
        departments: [],
        username: "",
      },
      users: [
        {
          id: 1,
          username: "张三",
          name: "财务部",
          avatar: "/src/assets/img/img.jpg",
          addr: "北京",
          state: 1,
          create_time: "2021-3-21",
        },
        {
          id: 2,
          username: "李四",
          name: "市场部",
          avatar: "/src/assets/img/img.jpg",
          addr: "长沙",
          state: 1,
          create_time: "2020-5-12",
        },
        {
          id: 3,
          username: "王五",
          name: "市场部",
          avatar: "/src/assets/img/img.jpg",
          addr: "长沙",
          state: 1,
          create_time: "2020-5-12",
        },
      ],
      currentPage: 1,
      pageSize: 2,
      pageTotal: 300,
      pageSizes: [2, 4, 6],
      editVisible: false,
      addVisible: false,
      form: {
        id: 3,
        username: "王五",
        pwd: "",
        //部门名称
        name: "",
        //列表选择时用于展示的部门名称
        departments: [],
        avatar: "/src/assets/img/img.jpg",
        new_avatar: "",
        addr: "长沙",
        state: 2,
        create_time: "2020-5-12",
      },
      addForm: {
        username: "",
        pwd: "",
        department: '',
        //列表选择时用于展示的部门名称
        departments: [],
        avatar: "",
        addr: "",
        state: 0,
      },
    };
  },
  mounted () {
    this.getUsers();

  },

  methods: {
    // 修改每页显示的条数
    ChangePageSize (size) {
      this.pageSize = size;
      if (this.query.username != "" || this.query.department != "") {
        this.queryUsername();
      } else {
        this.getUsers();
      }
    },
    // 修改当前页码
    ChangeCurrentPage (current_page) {
      this.currentPage = current_page;
      if (this.query.username != "" || this.query.department != "") {
        this.queryUsername();
      } else {
        this.getUsers();
      }
    },
    // 获取后端数据
    getUsers () {
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
            this.query.departments = rep.data.departments
          }
        });
    },
    queryUsername () {
      this.$axios
        .get("/user/query", {
          params: {
            username: this.query.username,
            department_name: this.query.department,
            page_size: this.pageSize,
            current_page: this.currentPage,
          },
        })
        .then((rep) => {
          if (rep.status == 200) {
            this.users = rep.data.users;
            this.pageSize = rep.data.pageSize;
            this.pageTotal = rep.data.pageTotal;
            this.currentPage = rep.data.currentPage;
            this.create_time = rep.data.create_time;
          }
          // window.location.reload("/main/query");
          // window.location.reload();
        });
    },
    //搜索用户
    handleSearch () {
      if (this.query.username != "" || this.query.department != "") {
        this.queryUsername();
      } else {
        this.getUsers();
      }
    },
    // 启用停用用户
    active (id, state) {
      this.$axios
        .post("/user/active", {
          id: id,
          state: state,
        })
        .then((rep) => {
          if (rep.data.state == 1) {
            ElMessage(
              {
                message: '启用成功',
                type: 'success',
              })
          } else {
            ElMessage(
              {
                message: '停用成功',
                type: 'success',
              }
            )
          }
          this.handleSearch();
        });
    },
    //弹出编辑框
    handleEdit (id, row) {
      //请求后端的部门数据
      this.$axios.get('/user/get_departments_except_me', {
        params: {
          id: id
        }
      }).then(
        (rep) => {
          if (rep.status == 200) {
            this.form.departments = rep.data.departments
          }
        }
      )
      Object.keys(this.form).forEach((item) => {
        this.form[item] = row[item];
      });

      this.editVisible = true;
    },
    //弹出添加框
    handleAdd () {
      //请求后端的部门数据
      this.$axios.get('/user/get_departments').then(
        (rep) => {
          if (rep.status == 200) {
            this.addForm.departments = rep.data.departments
          }
        }
      )
      this.addVisible = true;
    },
    saveEdit () {
      const formData = new FormData();
      formData.append("id", this.form.id);
      formData.append("username", this.form.username);
      formData.append("pwd", this.form.pwd);
      formData.append("department_name", this.form.name);
      formData.append("addr", this.form.addr);
      formData.append("state", this.form.state);
      // formData.append("create_time", this.form.create_time);
      formData.append(
        "avatar",
        document.querySelector("input[type=file]").files[0]
      );
      this.$axios.post("/user/edit", formData).then((rep) => {
        if (rep.data.code == 200) {
          alert("更新成功");
          window.location.reload("/main/user_list");
          window.location.reload();
        }
      });
    },
    saveAdd () {
      const addFormData = new FormData();
      addFormData.append("username", this.addForm.username);
      addFormData.append("pwd", this.addForm.pwd);
      addFormData.append("department_name", this.addForm.department);
      addFormData.append("addr", this.addForm.addr);
      addFormData.append("state", this.addForm.state);
      addFormData.append(
        "avatar",
        document.querySelector("input[type=file]").files[0]
      );
      this.$axios.post("/user/add", addFormData).then((rep) => {
        if (rep.data.code == 200) {
          alert("添加成功");
          window.location.reload("/main/user_list");
          window.location.reload();
        }
      });
    },
    handleDelete (row) {
      ElMessageBox.confirm(
        '确认删除?',
        {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning',
          draggable: true,
        }
      )
        .then(() => {
          this.$axios
            .post("/user/delete", {
              // 后端是DepartmentRet，只要传后端参数名称就行。后端可以直接使用department.id
              id: row.id,
            })
            .then((rep) => {
              ElMessage({
                message: '删除成功',
                type: 'success'
              })
              window.location.reload("/user/user_list");
              window.location.reload();
            });
        })
        .catch(() => {
          //   ElMessage({
          //     type: 'info',
          //     message: '取消',
          //   })
        })
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
#addbottom {
  margin-bottom: 10px;
}
</style>

