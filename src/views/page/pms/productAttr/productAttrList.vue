<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 5px" />
      <span style="margin-top: 5px">数据列表</span>
      <el-button class="btn-add" size="mini" @click="handleCreate()">添加</el-button>
    </el-card>
    <div class="table-container">
      <el-table v-loading="listLoading" :data="productAttrList" style="width: 100%" border="">
        <el-table-column label="编号" width="150" align="center">
          <template slot-scope="{row}">{{ row.id }}</template>
        </el-table-column>
        <el-table-column label="分类名称" align="center">
          <template slot-scope="{row}">{{ row.name }}</template>
        </el-table-column>
        <el-table-column label="排序" width="200" align="center">
          <template slot-scope="{row}">{{ row.sort }}</template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200">
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
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <el-form ref="productAttrForm" :model="productAttr" :rules="rules" label-width="100px">
        <el-form-item label="属性名称：" prop="name">
          <el-input v-model="productAttr.name" style="width:80%" />
        </el-form-item>
        <el-form-item label="排序：">
          <el-input v-model="productAttr.sort" style="width:80%" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleConfirm('productAttrForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
import { listProductAttr, createProductAttr, updateProductAttr } from '@/api/productAttr'

export default {
  data() {
    return {
      listLoading: false,
      total: 0,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        cateId: null
      },
      dialogTitle: '',
      dialogVisible: false,
      productAttrList: [],
      productAttr: { name: '', sort: null, productAttributeCategoryId: null },
      rules: {
        name: [
          { required: true, message: '请输入属性名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.cateId = this.$route.query.cateId
    this.getProductAttrList()
  },
  methods: {
    getProductAttrList() {
      this.listLoading = true
      this.listQuery.cateId = this.cateId
      listProductAttr(this.listQuery).then(response => {
        this.productAttrList = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleCreate() {
      this.dialogVisible = true
      this.dialogTitle = '添加属性'
    },
    handleUpdate(row) {
      this.dialogVisible = true
      this.dialogTitle = '编辑属性'
      this.productAttr.name = row.name
      this.productAttr.sort = row.sort
      this.productAttr.id = row.id
      this.productAttr.productAttributeCategoryId = row.productAttributeCategoryId
    },
    handleConfirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.dialogTitle === '添加属性') {
            const productAttr = this.productAttr
            productAttr.id = null
            productAttr.productAttributeCategoryId = this.cateId
            createProductAttr(productAttr).then(response => {
              this.$message({
                message: '添加成功',
                type: 'success',
                duration: 1000
              })
              this.dialogVisible = false
              this.getProductAttrList()
            })
          } else {
            updateProductAttr(this.productAttr).then(response => {
              this.$message({
                message: '修改成功',
                type: 'success',
                duration: 1000
              })
              this.dialogVisible = false
              this.getProductAttrList()
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleSizeChange(val) {
      this.listQuery.pageNum = 1
      this.listQuery.pageSize = val
      this.getProductAttrList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getProductAttrList()
    }
  }
}
</script>
