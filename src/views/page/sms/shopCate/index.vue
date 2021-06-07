<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 5px" />
      <span style="margin-top: 5px">数据列表</span>
      <el-button class="btn-add" size="mini" @click="handleCreate()">添加</el-button>
    </el-card>
    <div class="table-container">
      <el-table v-loading="listLoading" :data="categoryList" style="width:100%" border="">
        <el-table-column label="编号" width="150" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="分类名称" align="center">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="级别" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.level }}</template>
        </el-table-column>
        <el-table-column label="商家数量" width="150" align="center">
          <template slot-scope="scope">{{ scope.row.count }}</template>
        </el-table-column>
        <el-table-column label="优先级" width="150" align="center">
          <template slot-scope="scope">{{ scope.row.priority }}</template>
        </el-table-column>
        <el-table-column label="是否启用" width="100" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0" @change="handleStatusChange(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column label="设置" width="150" align="center">
          <template slot-scope="scope">
            <el-button size="mini" :disabled="scope.row.level | disableNextLevel" @click="handleShowNextLevel(scope.row)">查看下级</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleUpdate(scope.row)">编辑</el-button>
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
  </div>
</template>

<script>
import { getList, updateStatus } from '@/api/shopCate.js'
export default {
  filters: {
    disableNextLevel(value) {
      if (value === 1) {
        return false
      } else {
        return true
      }
    }
  },
  data() {
    return {
      listLoading: false,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        parentId: 0
      },
      categoryList: [],
      total: null
    }
  },
  watch: {
    $route(route) {
      this.resetParentId()
      this.getList()
    }
  },
  created() {
    this.resetParentId()
    this.getList()
  },
  methods: {
    resetParentId() {
      this.listQuery.pageNum = 1
      if (this.$route.query.parentId != null) {
        this.listQuery.parentId = this.$route.query.parentId
      } else {
        this.listQuery.parentId = 0
      }
    },
    getList() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        this.listLoading = false
        this.categoryList = response.data.list
        this.total = response.data.total
      })
    },
    handleSizeChange(val) {
      this.listQuery.pageNum = 1
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getList()
    },
    handleShowNextLevel(row) {
      this.$router.push({ path: '/sms/shopCate', query: { parentId: row.id }})
    },
    handleCreate() {
      this.$router.push('/sms/createShopCate')
    },
    handleUpdate(row) {
      this.$router.push({ path: '/sms/updateShopCate', query: { id: row.id }})
    },
    handleStatusChange(row) {
      const data = new URLSearchParams()
      data.append('cateId', row.id)
      data.append('status', row.status)
      updateStatus(data).then(response => {
        this.$message({
          message: '修改成功',
          type: 'success',
          duration: 1000
        })
      })
    }
  }
}
</script>
