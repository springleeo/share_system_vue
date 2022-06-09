<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 权限列表
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-input v-model="query.name"
                  placeholder="权限名称"
                  class="handle-input mr10"></el-input>
        <el-button type="primary"
                   icon="el-icon-search"
                   @click="handleSearch">搜索</el-button>
      </div>
      <el-table :data="permissions"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header">
        <el-table-column prop="id"
                         label="ID"
                         width="55"
                         align="center"></el-table-column>
        <el-table-column prop="name"
                         label="权限名称"></el-table-column>
        <el-table-column prop="url"
                         label="URL"></el-table-column>
        <el-table-column prop="method"
                         label="请求方法"></el-table-column>
        <el-table-column prop="args"
                         label="参数"></el-table-column>
        <el-table-column prop="level"
                         label="菜单级別"></el-table-column>
        <el-table-column prop="parent_name"
                         label="父级菜单"></el-table-column>
        <el-table-column prop="desc"
                         label="描述"></el-table-column>

        <el-table-column prop="create_time"
                         label="创建时间"></el-table-column>

        <el-table-column label="操作"
                         width="180"
                         align="center">
          <template #default="scope">
            <el-button type="text"
                       icon="el-icon-edit"
                       @click="handleEdit(scope.$index, scope.row)">编辑
            </el-button>
            <el-button type="text"
                       icon="el-icon-delete"
                       class="red"
                       @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background
                       layout="total, sizes, prev, pager, next, jumper"
                       :current-page="currentPage"
                       :page-size="pageSize"
                       :page-sizes="pageSizes"
                       :total="pageTotal"
                       @size-change="ChangePageSize"
                       @current-change="ChangeCurrentPage"></el-pagination>
      </div>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑"
               v-model="editVisible"
               width="30%">
      <el-form label-width="70px">
        <el-form-item label="权限名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="URL">
          <el-input v-model="form.url"></el-input>
        </el-form-item>
        <el-form-item label="请求方法">
          <el-input v-model="form.method"></el-input>
        </el-form-item>
        <el-form-item label="参数">
          <el-input v-model="form.args"></el-input>
        </el-form-item>
        <el-form-item label="父级菜单">
          <el-input v-model="form.parent_name"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.desc"></el-input>
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
  </div>
</template>

<script>
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { fetchData } from "../api/index";

export default {
  mounted () {
    this.getPermissions();
  },
  data () {
    return {
      query: {
        name: "",
      },
      permissions: [
        {
          id: 1,
          name: "权限管理",
          url:"",
          method:"",
          args:[],
          level:"",
          parent_name:"",
          desc: "",
          create_time: "",
        },
      ],
      currentPage: 1,
      pageSize: 5,
      pageTotal: 300,
      pageSizes: [5, 10, 20],
      editVisible: false,
      addVisible: false,
      editForm: {
        id: 1,
        name: "",
        desc: "",
      },
      addForm: {
        name: "",
        desc: "",
      }
    }
  },
  methods: {
    // 修改每页显示的条数
    ChangePageSize (size) {
      this.pageSize = size;
      if (this.query.name != "") {
        this.queryRolename();
      } else {
        this.getRoles();
      }
    },
    // 修改当前页码
    ChangeCurrentPage (current_page) {
      this.currentPage = current_page;
      if (this.query.name != "") {
        this.queryRolename();
      } else {
        this.getPermissions();
      }
    },
    // 获取后端数据
    getPermissions () {
      this.$axios
        .get("/permission/permission_list", {
          params: {
            page_size: this.pageSize,
            current_page: this.currentPage,
          },
        })
        .then((rep) => {
          // console.log(rep);
          if (rep.status == 200) {
            this.permissions = rep.data.permissions;
            this.pageSize = rep.data.pageSize;
            this.pageTotal = rep.data.pageTotal;
            this.currentPage = rep.data.currentPage;
            this.create_time = rep.data.create_time;
            // window.location.reload();
          }
        });
    },
    queryRolename () {
      this.$axios
        .get("/role/query", {
          params: {
            name: this.query.name,
            page_size: this.pageSize,
            current_page: this.currentPage,
          },
        })
        .then((rep) => {
          if (rep.status == 200) {
            this.permissions = rep.data.permissions;
            this.pageSize = rep.data.pageSize;
            this.pageTotal = rep.data.pageTotal;
            this.currentPage = rep.data.currentPage;
            this.create_time = rep.data.create_time;
          }
          // window.location.reload("/role/query");
          //   window.location.reload();
        });
    },
    //搜索
    handleSearch () {
      if (this.query.name != "") {
        this.queryRolename();
      } else {
        this.getRoles();
      }
    },
    //触发编辑按钮
    handleEdit (row) {
      Object.keys(this.editForm).forEach((item) => {
        this.editForm[item] = row[item];
      });
      this.editVisible = true;
    },
    //保存编辑
    saveEdit () {
      this.$axios.post('/role/edit', {
        id: this.editForm.id,
        name: this.editForm.name,
        desc: this.editForm.desc,
        // state: this.form.state
      }).then((rep) => {
        ElMessage({
          message: '更新成功',
          type: 'success'
        })
        window.location.reload("/main/role_list");

      })
    },
    //添加角色
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
            .post("/role/delete", {
              // 后端是RoleRet，只要传后端参数名称就行。后端可以直接使用role.id
              id: row.id,
            })
            .then((rep) => {
              ElMessage({
                message: '删除成功',
                type: 'success'
              })
              window.location.reload("/main/role_list");
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
    //弹出添加框
    handleAdd () {
      this.addVisible = true;
    },
    saveAdd () {
      this.$axios.post("/role/add", {
        name: this.addForm.name,
        leader: this.addForm.leader,
        desc: this.addForm.desc,
        // state: this.addForm.state
      }).then((rep) => {
        if (rep.data.code == 200) {
          ElMessage({
            message: '添加成功',
            type: 'success'
          })
          window.location.reload("/main/role_list");
          window.location.reload();
        }
      });
    },
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
