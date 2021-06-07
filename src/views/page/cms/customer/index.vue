<template>
  <div class="app-container">
    <div class="table-container">
      <el-table v-loading="listLoading" :data="customerList" style="width:100%" border="">
        <el-table-column label="编号" width="150" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="姓名" align="center">
          <template slot-scope="scope">{{ scope.row.customerName }}</template>
        </el-table-column>
        <el-table-column label="电话" width="150" align="center">
          <template slot-scope="scope">{{ scope.row.phone }}</template>
        </el-table-column>
        <el-table-column label="注册城市" width="150" align="center">
          <template slot-scope="scope">{{ scope.row.city }}</template>
        </el-table-column>
        <el-table-column label="启用状态" width="150" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0" />
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

import { listCustomer } from '@/api/customer.js'

export default {
  data() {
    return {
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      listLoading: false,
      total: null,
      customerList: []
    }
  },
  created() {
    this.getCustoemrList()
  },
  methods: {
    getCustoemrList() {
      this.listLoading = true
      listCustomer(this.listQuery).then(respone => {
        this.customerList = respone.data.list
        this.total = respone.data.total
        this.listLoading = false
      })
    },
    handleSizeChange(val) {
      this.listQuery.pageNum = 1
      this.listQuery.pageSize = val
      this.getCustoemrList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getCustoemrList()
    }
  }
}
</script>
