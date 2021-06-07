<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 5px" />
      <span style="margin-top: 5px">数据列表</span>
      <el-button class="btn-add" size="mini" @click="handleCreate">添加</el-button>
    </el-card>
    <div class="table-container">
      <el-table v-loading="listLoading" :data="productList" style="width: 100%" border="">
        <el-table-column label="编号" width="150" align="center">
          <template slot-scope="{row}">{{ row.id }}</template>
        </el-table-column>
        <el-table-column label="产品名称" width="300" align="center">
          <template slot-scope="{row}">{{ row.productName }}</template>
        </el-table-column>
        <el-table-column label="单位" width="100" align="center">
          <template slot-scope="{row}">{{ row.unit }}</template>
        </el-table-column>
        <el-table-column label="库存" width="100" align="center">
          <template slot-scope="{row}">{{ row.stock }}</template>
        </el-table-column>
        <el-table-column label="描述" align="center">
          <template slot-scope="{row}">{{ row.productDesc }}</template>
        </el-table-column>
        <el-table-column label="销售状态" width="120" align="center">
          <template slot-scope="{row}">
            <el-switch v-model="row.sellStatus" :active-value="1" :inactive-value="0" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="{row}">
            <el-button size="mini" type="text" @click="handleUpdate(row)">编辑</el-button>
            <el-button size="mini" type="text ">删除</el-button>
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
import { listProduct } from '@/api/product'
export default {
  data() {
    return {
      listLoading: false,
      shopId: null,
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      productList: []

    }
  },
  created() {
    this.shopId = this.$route.query.shopId
    this.getProductList()
  },
  methods: {
    getProductList() {
      this.listLoading = true
      this.listQuery.shopId = this.shopId
      listProduct(this.listQuery, this.shopId).then(response => {
        this.listLoading = false
        this.productList = response.data.list
        this.total = response.data.total
      })
    },
    handleSizeChange(val) {
      this.listQuery.pageNum = 1
      this.listQuery.pageSize = val
      this.getProductList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getProductList()
    },
    handleUpdate(row) {
      this.$router.push({ path: '/pms/productUpdate', query: { id: row.id, shopId: this.shopId }})
    },
    handleCreate() {
      this.$router.push({ path: '/pms/productAdd', query: { shopId: this.shopId }})
    }
  }
}
</script>

