<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 5px" />
      <span style="margin-top: 5px">数据列表</span>
      <el-button class="btn-add" size="mini" @click="handleCreate()">添加</el-button>
    </el-card>
    <div class="table-container">
      <el-table v-loading="listLoading" :data="menus" style="width: 100%" border="">
        <el-table-column label="编号" width="150" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="菜单名称" align="center">
          <template slot-scope="scope">{{ scope.row.title }}</template>
        </el-table-column>
        <el-table-column label="前端名称" align="center">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="菜单级数" width="150" align="center">
          <template slot-scope="scope">{{ scope.row.level | levelFilter }}</template>
        </el-table-column>
        <el-table-column label="前端图标" width="150" align="center">
          <template slot-scope="scope"><svg-icon :icon-class="scope.row.icon" /></template>
        </el-table-column>
        <el-table-column label="排序" width="150" align="center">
          <template slot-scope="scope">{{ scope.row.sort }}</template>
        </el-table-column>
        <el-table-column label="是否显示" width="100" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.hidden" :active-value="0" :inactive-value="1" @change="handleStatusChange(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column label="设置" width="150" align="center">
          <template slot-scope="scope">
            <el-button size="mini" :disabled="scope.row.level | disableNextLevel" @click="handleShowNextLevel(scope.row)">查看下级</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="{row}">
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
  </div>
</template>

<script>
import { list } from '@/api/menu.js'

const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  parentId: 0
}

export default {
  filters: {
    disableNextLevel(value) {
      if (value === 0) {
        return false
      } else {
        return true
      }
    },
    levelFilter(value) {
      if (value === 0) {
        return '一级'
      } else if (value === 1) {
        return '二级'
      }
    }
  },
  data() {
    return {
      listLoading: false,
      total: null,
      listQuery: Object.assign({}, defaultListQuery),
      menus: []
    }
  },
  watch: {
    $route(route) {
      this.resetParentId()
      this.listMenu()
    }
  },
  created() {
    this.resetParentId()
    this.listMenu()
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
    listMenu() {
      this.listLoading = true
      list(this.listQuery).then(respone => {
        this.menus = respone.data.list
        this.total = respone.data.total
        this.listLoading = false
      })
    },
    handleShowNextLevel(row) {
      this.$router.push({ path: '/ams/menu', query: { parentId: row.id }})
    },
    handleCreate() {
      this.$router.push('/ams/menuAdd')
    },
    handleUpdate(row) {
      this.$router.push({ path: '/ams/menuUpdate', query: { id: row.id }})
    },
    handleSizeChange(val) {
      this.listQuery.pageNum = 1
      this.listQuery.pageSize = val
      this.listMenu()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.listMenu()
    }
  }

}
</script>
