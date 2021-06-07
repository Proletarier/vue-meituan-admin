<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 5px" />
      <span style="margin-top: 5px">数据列表</span>
      <el-button class="btn-add" size="mini" @click="handleCreate()">添加</el-button>
    </el-card>
    <div class="table-container">
      <el-table v-loading="listLoading" :data="productCateList" style="width: 100%" border="">
        <el-table-column label="编号" width="150" align="center">
          <template slot-scope="{row}">{{ row.id }}</template>
        </el-table-column>
        <el-table-column label="分类名称" align="center">
          <template slot-scope="{row}">{{ row.categoryName }}</template>
        </el-table-column>
        <el-table-column label="是否启用" align="center" width="100">
          <template slot-scope="{row}">
            <el-switch v-model="row.status" :active-value="1" :inactive-value="0" @change="handleStatusChange(row)" />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="{row}">
            <el-button size="mini" type="primary" @click="handleUpdate(row)">编辑</el-button>
            <el-button size="mini" type="danger ">删除</el-button>
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
import { listProductCate, updateStatus } from '@/api/productCate'
export default {
  data() {
    return {
      shopId: null,
      listLoading: false,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        shopId: this.shopId
      },
      total: null,
      productCateList: []
    }
  },
  created() {
    this.shopId = this.$route.query.shopId
    this.getProductCateList()
  },
  methods: {
    getProductCateList() {
      this.listLoading = true
      this.listQuery.shopId = this.shopId
      listProductCate(this.listQuery).then(response => {
        this.listLoading = false
        this.productCateList = response.data.list
        this.total = response.data.total
      })
    },
    handleCreate() {
      this.$router.push({ path: '/pms/createProductCate', query: { shopId: this.shopId }})
    },
    handleUpdate(row) {
      this.$router.push({ path: '/pms/ucpateProductCate', query: { id: row.id, shopId: this.shopId }})
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
    handleSizeChange(val) {
      this.listQuery.pageNum = 1
      this.listQuery.pageSize = val
      this.getProductCateList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getProductCateList()
    }
  }
}
</script>

