<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 5px" />
      <span style="margin-top: 5px">数据列表</span>
      <el-button class="btn-add" size="mini" @click="handleCreate()">添加</el-button>
    </el-card>
    <div class="table-container">
      <el-table v-loading="listLoading" :data="productAttrCateList" style="width: 100%" border="">
        <el-table-column label="编号" width="150" align="center">
          <template slot-scope="{row}">{{ row.id }}</template>
        </el-table-column>
        <el-table-column label="分类名称" align="center">
          <template slot-scope="{row}">{{ row.name }}</template>
        </el-table-column>
        <el-table-column label="属性数量" width="200" align="center">
          <template slot-scope="{row}">{{ row.count }}</template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="{row}">
            <el-button size="mini" type="text" @click="getProductAttrList(row)">设置属性</el-button>
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
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <el-form ref="productAttrCatForm" :model="productAttrCate" :rules="rules" label-width="100px">
        <el-form-item label="类型名称：" prop="name">
          <el-input v-model="productAttrCate.name" auto-complete="off" style="width:80%" />
        </el-form-item>
        <el-form-item label="属性选择：">
          <el-radio-group v-model="productAttrCate.selectType">
            <el-radio :label="1">单选</el-radio>
            <el-radio :label="2">多选</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleConfirm('productAttrCatForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { listProductAttrCate, createProductAttrCate, updateProductAttrCate } from '@/api/productAttr'

export default {

  data() {
    return {
      listLoading: false,
      total: null,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        shopId: 0
      },
      dialogTitle: '',
      dialogVisible: false,
      productAttrCateList: [],
      productAttrCate: { name: '', shopId: null, count: 0, selectType: 1 },
      rules: {
        name: [
          { required: true, message: '请输入类型名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.shopId = this.$route.query.shopId
    this.getProductAttrCateList()
  },
  methods: {
    getProductAttrCateList() {
      this.listLoading = true
      this.listQuery.shopId = this.shopId
      listProductAttrCate(this.listQuery).then(response => {
        this.productAttrCateList = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
    },
    getProductAttrList(row) {
      this.$router.push({ path: '/pms/productAttr', query: { cateId: row.id }})
    },
    handleCreate() {
      this.dialogVisible = true
      this.dialogTitle = '添加属性分类'
    },
    handleUpdate(row) {
      this.dialogVisible = true
      this.dialogTitle = '编辑属性分类'
      this.productAttrCate.name = row.name
      this.productAttrCate.id = row.id
      this.productAttrCate.shopId = row.shopId
    },
    handleSizeChange(val) {
      this.listQuery.pageNum = 1
      this.listQuery.pageSize = val
      this.getProductAttrCateList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getProductAttrCateList()
    },
    handleConfirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.dialogTitle === '添加属性分类') {
            const productAttrCate = { shopId: this.shopId, name: this.productAttrCate.name, count: 0 }
            createProductAttrCate(productAttrCate).then(response => {
              this.$message({
                message: '添加成功',
                type: 'success',
                duration: 1000
              })
              this.dialogVisible = false
              this.getProductAttrCateList()
            })
          } else {
            updateProductAttrCate(this.productAttrCate).then(response => {
              this.$message({
                message: '修改成功',
                type: 'success',
                duration: 1000
              })
              this.dialogVisible = false
              this.getProductAttrCateList()
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
