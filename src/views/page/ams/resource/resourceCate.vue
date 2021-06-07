<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 5px" />
      <span style="margin-top: 5px">数据列表</span>
      <el-button class="btn-add" size="mini" @click="handleCreate()">添加</el-button>
    </el-card>
    <div class="table-container">
      <el-table v-loading="listLoading" :data="resourceCateList" style="width: 100%" border="">
        <el-table-column label="编号" width="120" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="分类名称" align="center">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="添加时间" align="center">
          <template slot-scope="scope">{{ scope.row.createTime }}</template>
        </el-table-column>
        <el-table-column label="排序" align="center">
          <template slot-scope="scope">{{ scope.row.sort }}</template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="{row}">
            <el-button size="mini" type="text" @click="handleUpdate(row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <el-form ref="cateForm" :model="resourceCate" :rules="rules" label-width="100px" size="mini">
        <el-form-item label="分类名称：" prop="name">
          <el-input v-model="resourceCate.name" style="width:80%" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="resourceCate.sort" style="width:80%" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleConfirm('cateForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { listAll, createCate, updateCate } from '@/api/resource.js'

const deafaultCate = {
  name: null,
  sort: 0
}

export default {
  data() {
    return {
      listLoading: false,
      dialogVisible: false,
      dialogTitle: '',
      resourceCate: Object.assign({}, deafaultCate),
      resourceCateList: [],
      rules: {
        name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.listResourceCate()
  },
  methods: {
    listResourceCate() {
      listAll().then(responese => {
        this.resourceCateList = responese.data.list
      })
    },
    handleCreate() {
      this.dialogVisible = true
      this.dialogTitle = '添加资源分类'
      this.resourceCate = Object.assign({}, deafaultCate)
    },
    handleUpdate(row) {
      this.dialogVisible = true
      this.dialogTitle = '编辑资源分类'
      this.resourceCate.id = row.id
      this.resourceCate.name = row.name
      this.resourceCate.sort = row.sort
    },
    handleConfirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.dialogTitle === '添加资源分类') {
            createCate(this.resourceCate).then(response => {
              this.$message({
                message: '添加成功',
                type: 'success',
                duration: 1000
              })
              this.dialogVisible = false
              this.listResourceCate()
            })
          } else {
            updateCate(this.resourceCate).then(response => {
              this.$message({
                message: '修改成功',
                type: 'success',
                duration: 1000
              })
              this.dialogVisible = false
              this.listResourceCate()
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
