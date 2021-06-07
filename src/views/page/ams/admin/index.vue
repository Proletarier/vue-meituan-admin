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
      <el-table v-loading="listLoading" :data="adminList" style="width: 100%" border="">
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="账号" align="center">
          <template slot-scope="scope">{{ scope.row.username }}</template>
        </el-table-column>
        <el-table-column label="昵称" align="center">
          <template slot-scope="scope">{{ scope.row.nickName }}</template>
        </el-table-column>
        <el-table-column label="电话" align="center">
          <template slot-scope="scope">{{ scope.row.phone }}</template>
        </el-table-column>
        <el-table-column label="邮件" align="center">
          <template slot-scope="scope">{{ scope.row.email }}</template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">{{ scope.row.createTime }}</template>
        </el-table-column>
        <el-table-column label="最后登录时间" align="center">
          <template slot-scope="scope">{{ scope.row.loginTime }}</template>
        </el-table-column>
        <el-table-column label="启用状态" width="180" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0" @change="handleStatusChange(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="{row}">
            <el-button size="mini" type="text" @click="handleSelectRole(row)">分配角色</el-button>
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
      title="分配角色"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <el-select v-model="selectRoleIds" multiple placeholder="请选择" size="small" style="width: 80%">
        <el-option
          v-for="item in roleList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <span slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleConfirm()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { list, updateStatus, getRoleListByAdmin, allotRole } from '@/api/admin.js'
import { listRole } from '@/api/role.js'

const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  keyword: null
}

export default {
  data() {
    return {
      listLoading: false,
      dialogVisible: false,
      total: null,
      listQuery: Object.assign({}, defaultListQuery),
      adminList: [],
      roleList: [],
      selectRoleIds: [],
      adminId: null
    }
  },
  created() {
    this.listAdmin()
    this.listRoles()
  },
  methods: {
    listAdmin() {
      this.listLoading = true
      list(this.listQuery).then(response => {
        this.adminList = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
    },
    listRoles() {
      listRole({ pageNum: 1, pageSize: 1000 }).then(response => {
        this.roleList = response.data.list
      })
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
    handleCreate() {
      this.$router.push('/ams/addAdmin')
    },
    handleUpdate(row) {
      this.$router.push({ path: '/ams/updateAdmin', query: { id: row.id }})
    },
    handleSelectRole(row) {
      this.dialogVisible = true
      this.adminId = row.id
      this.getRoleListByAdmin(row.id)
    },
    getRoleListByAdmin(id) {
      getRoleListByAdmin(id).then(response => {
        const roles = response.data
        const selectRoles = []
        for (let i = 0; i < roles.length; i++) {
          selectRoles.push(roles[i].roleId)
        }
        this.selectRoleIds = selectRoles
      })
    },
    handleConfirm() {
      this.$confirm('确定修改?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = new URLSearchParams()
        params.append('adminId', this.adminId)
        params.append('roleIds', this.selectRoleIds)
        allotRole(params).then(response => {
          this.$message({
            message: '分配成功！',
            type: 'success'
          })
          this.dialogVisible = false
        })
      })
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
      this.listAdmin()
    },
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery)
    }
  }
}
</script>
