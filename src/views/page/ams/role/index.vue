<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search" />
        <span>筛选搜索</span>
        <el-button
          style="float:right"
          type="primary"
          size="small"
          @click="handleSearchList()"
        >
          查询搜索
        </el-button>
        <el-button
          style="float:right;margin-right: 15px"
          size="small"
          @click="handleResetSearch()"
        >
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="输入搜索：">
            <el-input v-model="listQuery.keyword" class="input-width" placeholder="帐号/姓名" clearable />
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 5px" />
      <span style="margin-top: 5px">数据列表</span>
      <el-button class="btn-add" size="mini" @click="handleCreate()">添加</el-button>
    </el-card>
    <div class="table-container">
      <el-table v-loading="listLoading" :data="listRole" style="width: 100%" border="">
        <el-table-column label="编号" width="120" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="角色名称" align="center">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="描述" align="center">
          <template slot-scope="scope">{{ scope.row.description }}</template>
        </el-table-column>
        <el-table-column label="添加时间" align="center">
          <template slot-scope="scope">{{ scope.row.createTime }}</template>
        </el-table-column>
        <el-table-column label="是否启用" width="150" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0" @change="handleStatusChange(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="{row}">
            <el-button size="mini" type="text " @click="handleallocMenu(row)">分配菜单</el-button>
            <el-button size="mini" type="text " @click="handleallocResource(row)">分配资源</el-button>
            <el-button size="mini" type="text" @click="handleUpdate(row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        layout="total,sizes,prev,pager,next,jumper"
        :page-size="listQuery.pageSize"
        :page-sizes="[10,15,20]"
        :current-page.sync="listQuery.pageNum"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <el-form ref="roleForm" :model="role" :rules="rules" label-width="100px">
        <el-form-item label="属性名称：" prop="name">
          <el-input v-model="role.name" style="width:80%" />
        </el-form-item>
        <el-form-item label="描述：">
          <el-input
            v-model="role.description"
            type="textarea"
            :rows="5"
            style="width:80%"
          />
        </el-form-item>
        <el-form-item label="启用：">
          <el-radio-group v-model="role.status">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleConfirm('roleForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { listRole, update, create, updateStatus } from '@/api/role.js'

const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  keyword: null
}

const defaultRole = {
  status: 1,
  name: '',
  description: ''
}
export default {
  data() {
    return {
      listLoading: false,
      total: null,
      dialogTitle: '',
      dialogVisible: false,
      role: Object.assign({}, defaultRole),
      listQuery: Object.assign({}, defaultListQuery),
      listRole: [],
      rules: {
        name: [
          { required: true, message: '请输入类型名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.list()
  },
  methods: {
    list() {
      this.listLoading = true
      listRole(this.listQuery).then(response => {
        this.listRole = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleallocMenu(row) {
      this.$router.push({ path: '/ams/allocMenu', query: { roleId: row.id }})
    },
    handleallocResource(row) {
      this.$router.push({ path: '/ams/allocResource', query: { roleId: row.id }})
    },
    handleCreate() {
      this.dialogVisible = true
      this.dialogTitle = '添加角色'
      this.role = Object.assign({}, defaultRole)
    },
    handleUpdate(row) {
      this.dialogVisible = true
      this.dialogTitle = '编辑角色'
      this.role.id = row.id
      this.role.name = row.name
      this.role.description = row.description
      this.role.status = row.status
    },
    handleSizeChange(val) {
      this.listQuery.pageNum = 1
      this.listQuery.pageSize = val
      this.list()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.list()
    },
    handleSearchList() {
      this.listQuery.pageNum = 1
      this.list()
    },
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery)
    },
    handleStatusChange(row) {
      const data = new URLSearchParams()
      data.append('id', row.id)
      data.append('status', row.status)
      updateStatus(data).then(response => {
        this.$message({
          message: '修改成功',
          type: 'success',
          duration: 1000
        })
      })
    },
    handleConfirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.dialogTitle === '添加角色') {
            create(this.role).then(response => {
              this.$message({
                message: '添加成功',
                type: 'success',
                duration: 1000
              })
              this.dialogVisible = false
              this.list()
            })
          } else {
            update(this.role).then(response => {
              this.$message({
                message: '修改成功',
                type: 'success',
                duration: 1000
              })
              this.dialogVisible = false
              this.list()
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
