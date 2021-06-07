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
          <el-form-item label="资源名称：">
            <el-input v-model="listQuery.name" class="input-width" placeholder="资源名称" clearable />
          </el-form-item>
          <el-form-item label="资源路径：">
            <el-input v-model="listQuery.url" class="input-width" placeholder="资源路径" clearable />
          </el-form-item>
          <el-form-item label="资源分类：">
            <el-select v-model="listQuery.categoryId" clearable placeholder="全部">
              <el-option
                v-for="item in resourceCateList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 5px" />
      <span style="margin-top: 5px">数据列表</span>
      <el-button class="btn-add" size="mini" @click="handleCreate()">添加</el-button>
      <el-button class="btn-add" size="mini" style="margin-right: 15px" @click="handleShowResourceCate()">资源分类</el-button>
    </el-card>
    <div class="table-container">
      <el-table v-loading="listLoading" :data="resourceList" style="width: 100%" border="">
        <el-table-column label="编号" width="120" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="资源名称" align="center">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="资源路径" align="center">
          <template slot-scope="scope">{{ scope.row.url }}</template>
        </el-table-column>
        <el-table-column label="描述" width="500" align="center">
          <template slot-scope="scope">{{ scope.row.description }}</template>
        </el-table-column>
        <el-table-column label="添加时间" width="200" align="center">
          <template slot-scope="scope">{{ scope.row.createTime }}</template>
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
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <el-form ref="resourceForm" :model="resource" :rules="rules" label-width="100px" size="mini">
        <el-form-item label="资源名称：" prop="name">
          <el-input v-model="resource.name" style="width:80%" />
        </el-form-item>
        <el-form-item label="资源路径：" prop="url">
          <el-input v-model="resource.url" style="width:80%" />
        </el-form-item>
        <el-form-item label="资源分类：" prop="categoryId">
          <el-select v-model="resource.categoryId" clearable placeholder="全部">
            <el-option
              v-for="item in resourceCateList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="描述：">
          <el-input
            v-model="resource.description"
            type="textarea"
            :rows="5"
            style="width:80%"
          />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleConfirm('resourceForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { list, listAll, create, update } from '@/api/resource.js'

const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  name: null,
  url: null,
  categoryId: null
}

const defaultResource = {
  name: null,
  url: null,
  description: null,
  categoryId: null
}

export default {
  data() {
    return {
      listLoading: false,
      dialogVisible: false,
      dialogTitle: '',
      total: null,
      listQuery: Object.assign({}, defaultListQuery),
      resource: Object.assign({}, defaultResource),
      resourceList: [],
      resourceCateList: [],
      rules: {
        name: [
          { required: true, message: '请输入资源名称', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '请输入资源路径', trigger: 'blur' }
        ],
        categoryId: [
          { required: true, message: '请选择资源分类', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.listResource()
    this.listResourceCate()
  },
  methods: {
    listResource() {
      this.listLoading = true
      list(this.listQuery).then(responese => {
        this.resourceList = responese.data.list
        this.total = responese.data.total
        this.listLoading = false
      })
    },
    listResourceCate() {
      listAll().then(responese => {
        this.resourceCateList = responese.data.list
      })
    },
    handleSearchList() {
      this.listQuery.pageNum = 1
      this.listResource()
    },
    handleShowResourceCate() {
      this.$router.push('/ams/resourceCate')
    },
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery)
    },
    handleCreate() {
      this.dialogVisible = true
      this.dialogTitle = '添加资源'
      this.resource = Object.assign({}, defaultResource)
    },
    handleUpdate(row) {
      this.dialogVisible = true
      this.dialogTitle = '编辑资源'
      this.resource.id = row.id
      this.resource.name = row.name
      this.resource.url = row.url
      this.resource.categoryId = row.categoryId
      this.resource.description = row.description
    },
    handleConfirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.dialogTitle === '添加资源') {
            create(this.resource).then(response => {
              this.$message({
                message: '添加成功',
                type: 'success',
                duration: 1000
              })
              this.dialogVisible = false
              this.listResource()
            })
          } else {
            update(this.resource).then(response => {
              this.$message({
                message: '修改成功',
                type: 'success',
                duration: 1000
              })
              this.dialogVisible = false
              this.listResource()
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
