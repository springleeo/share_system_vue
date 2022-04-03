<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 部门列表
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-input v-model="query.name"
                  placeholder="部门名称"
                  class="handle-input mr10"></el-input>
        <el-button type="primary"
                   icon="el-icon-search"
                   @click="handleSearch">搜索</el-button>
      </div>
      <div class="addbottom">
        <el-button type="primary"
                   @click="handleAdd">添加</el-button>
      </div>

      <el-table :data="departments"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header">
        <el-table-column prop="id"
                         label="ID"
                         width="55"
                         align="center"></el-table-column>
        <el-table-column prop="name"
                         label="部门名称"></el-table-column>
        <el-table-column prop="leader"
                         label="部门主管"></el-table-column>
        <el-table-column prop="desc"
                         label="部门职责"></el-table-column>
        <!-- <el-table-column label="状态"
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
        </el-table-column> -->

        <el-table-column prop="create_time"
                         label="创建时间"></el-table-column>
        <el-table-column label="操作"
                         width="180"
                         align="center">
          <template #default="scope">
            <!-- <el-button class="red"
                       type="text"
                       @click="active(scope.row.id, scope.row.state)"
                       v-if="scope.row.state == 1">停用
            </el-button>
            <el-button type="text"
                       @click="active(scope.row.id, scope.row.state)"
                       v-if="scope.row.state == 2">启用
            </el-button> -->
            <el-button type="text"
                       icon="el-icon-edit"
                       @click="handleEdit(scope.row)">编辑
            </el-button>
            <el-button type="text"
                       icon="el-icon-delete"
                       class="red"
                       @click="handleDelete(scope.row)">删除</el-button>
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
        <el-form-item label="部门名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="部门主管">
          <el-input v-model="form.leader"></el-input>
        </el-form-item>
        <el-form-item label="部门描述">
          <el-input v-model="form.desc"></el-input>
        </el-form-item>
        <!-- <el-form-item label="状态">
          <el-radio-group v-model="form.state">
            <el-radio :label=1>启用</el-radio>
            <el-radio :label=2>停用</el-radio>
          </el-radio-group>
        </el-form-item> -->
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
        <el-form-item label="部门名称">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="部门主管">
          <el-input v-model="addForm.leader"></el-input>
        </el-form-item>
        <el-form-item label="部门描述">
          <el-input v-model="addForm.desc"></el-input>
        </el-form-item>
        <!-- <el-form-item label="状态">
          <el-radio-group v-model="addForm.state">
            <el-radio :label=1>启用</el-radio>
            <el-radio :label=2>停用</el-radio>
          </el-radio-group>
        </el-form-item> -->
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
  mounted () {
    this.getDepartments();
  },
  data () {
    return {
      query: {
        name: "",
      },
      departments: [
        {
          id: 1,
          name: "财务部",
          leader: "财务部",
          desc: "主管财务",
          // state: 1,
          create_time: "2021-3-21",
        },
        {
          id: 2,
          name: "市场部",
          leader: "市场部",
          desc: "主管市场",
          // state: 1,
          create_time: "2021-3-21",
        },
        {
          id: 3,
          name: "人事部",
          leader: "人事部",
          desc: "主管人事",
          // state: 2,
          create_time: "2021-3-21",
        },
      ],
      currentPage: 1,
      pageSize: 2,
      pageTotal: 300,
      pageSizes: [2, 4, 6],
      editVisible: false,
      addVisible: false,
      form: {
        id: 1,
        name: "财务部",
        leader: "张一",
        desc: "会计",
        // state: 1,
      },
      addForm: {
        name: "",
        leader: "",
        desc: "",
        // state: 0,
      }
    }
  },
  methods: {
    // 修改每页显示的条数
    ChangePageSize (size) {
      this.pageSize = size;
      if (this.query.name != "") {
        this.queryDepartmentname();
      } else {
        this.getDepartments();
      }
    },
    // 修改当前页码
    ChangeCurrentPage (current_page) {
      this.currentPage = current_page;
      if (this.query.name != "") {
        this.queryDepartmentname();
      } else {
        this.getDepartments();
      }
    },
    // 获取后端数据
    getDepartments () {
      this.$axios
        .get("/department/department_list", {
          params: {
            page_size: this.pageSize,
            current_page: this.currentPage,
          },
        })
        .then((rep) => {
          // console.log(rep);
          if (rep.status == 200) {
            this.departments = rep.data.departments;
            this.pageSize = rep.data.pageSize;
            this.pageTotal = rep.data.pageTotal;
            this.currentPage = rep.data.currentPage;
            this.create_time = rep.data.create_time;
            // window.location.reload();
          }
        });
    },
    queryDepartmentname () {
      this.$axios
        .get("/department/query", {
          params: {
            name: this.query.name,
            page_size: this.pageSize,
            current_page: this.currentPage,
          },
        })
        .then((rep) => {
          if (rep.status == 200) {
            this.departments = rep.data.departments;
            this.pageSize = rep.data.pageSize;
            this.pageTotal = rep.data.pageTotal;
            this.currentPage = rep.data.currentPage;
            this.create_time = rep.data.create_time;
          }
          // window.location.reload("/department/query");
          //   window.location.reload();
        });
    },
    //搜索用户
    handleSearch () {
      if (this.query.name != "") {
        this.queryDepartmentname();
      } else {
        this.getDepartments();
      }
    },
    //触发编辑按钮
    handleEdit (row) {
      Object.keys(this.form).forEach((item) => {
        this.form[item] = row[item];
      });
      this.editVisible = true;
    },
    //保存编辑
    saveEdit () {
      this.$axios.post('/department/edit', {
        id: this.form.id,
        name: this.form.name,
        leader: this.form.leader,
        desc: this.form.desc,
        // state: this.form.state
      }).then((rep) => {
        alert("更新成功");
        window.location.reload("/main/department_list");

      })
    },
    //启用停用
    // active (id, state) {
    //   this.$axios.post('/department/active', {
    //     id: id,
    //     state: state
    //   }).then((rep) => {
    //     if (rep.data.state == 1) {

    //       ElMessage(
    //         {
    //           message: '启用成功',
    //           type: 'success',
    //         })
    //     } else {
    //       ElMessage(
    //         {
    //           message: '停用成功',
    //           type: 'success',
    //         }
    //       )
    //     }
    //     this.handleSearch();
    //   })
    // },
    //添加部门
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
            .post("/department/delete", {
              // 后端是DepartmentRet，只要传后端参数名称就行。后端可以直接使用department.id
              id: row.id,
            })
            .then((rep) => {
              ElMessage({
                message: '删除成功',
                type: 'success'
              })
              window.location.reload("/main/department_list");
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
      this.$axios.post("/department/add", {
        name: this.addForm.name,
        leader: this.addForm.leader,
        desc: this.addForm.desc,
        // state: this.addForm.state
      }).then((rep) => {
        if (rep.data.code == 200) {
          alert("添加成功");
          window.location.reload("/main/department_list");
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
.addbottom {
  margin-bottom: 10px;
}
</style>
