<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 5px" />
      <span style="margin-top: 5px">数据列表</span>
      <el-button class="btn-add" size="mini" @click="handleCreate()">添加</el-button>
    </el-card>
    <div class="table-container">
      <el-table v-loading="listLoading" :data="shopList" style="width: 100%" border="">
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="店铺图片" width="150" align="center">
          <template slot-scope="scope"><img height="80" width="120" :src="scope.row.picUrl"></template>
        </el-table-column>
        <el-table-column label="商家名称" width="250" align="center">
          <template slot-scope="scope">{{ scope.row.shopName }}</template>
        </el-table-column>
        <el-table-column label="联系电话" width="120" align="center">
          <template slot-scope="scope">{{ scope.row.phone }}</template>
        </el-table-column>
        <el-table-column label="店铺地址" align="center">
          <template slot-scope="scope">{{ scope.row.address }}</template>
        </el-table-column>
        <el-table-column label="设置" align="center" width="200">
          <template slot-scope="{row}">
            <p>
              <el-button
                size="mini"
                @click="getProductCateList(row)"
              >菜单
              </el-button>
              <el-button

                size="mini"
                @click="getProductList(row)"
              >商品
              </el-button>
            </p>
            <p>
              <el-button
                size="mini"
                @click="getProductAtttr(row)"
              >规格
              </el-button>
              <el-button
                size="mini"
                @click="getProductList(row)"
              >活动
              </el-button>
            </p>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="120">
          <template slot-scope="{row}">
            <el-button size="mini" type="primary" @click="handleUpdate(row)">编辑</el-button>
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
import { shopList } from '@/api/shop'

export default {
  data() {
    return {
      listLoading: false,
      shopList: [],
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      total: null
    }
  },
  created() {
    this.getShopList()
  },
  methods: {
    getShopList() {
      this.listLoading = true
      shopList(this.listQuery).then(response => {
        this.listLoading = false
        this.shopList = response.data.list
        this.total = response.data.total
      })
    },
    getProductCateList(row) {
      this.$router.push({ path: '/pms/productCate', query: { shopId: row.id }})
    },
    getProductList(row) {
      this.$router.push({ path: '/pms/product', query: { shopId: row.id }})
    },
    getProductAtttr(row) {
      this.$router.push({ path: '/pms/productAttrCate', query: { shopId: row.id }})
    },
    handleSizeChange(val) {
      this.listQuery.pageNum = 1
      this.listQuery.pageSize = val
      this.getShopList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getShopList()
    },
    handleCreate() {
      this.$router.push('/sms/createShop')
    },
    handleUpdate(row) {
      this.$router.push({ path: '/sms/updateShop', query: { shopId: row.id }})
    }
  }
}
</script>

<style lang="sass">

</style>
