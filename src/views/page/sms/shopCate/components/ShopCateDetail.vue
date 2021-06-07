<template>
  <el-card class="form-container" shadow="hover">
    <el-form ref="shopCateFrom" :model="shopCate" :rules="rules" label-width="100px">
      <el-form-item label="分类名称: " prop="name">
        <el-input v-model="shopCate.name" />
      </el-form-item>
      <el-form-item label="上级分类: ">
        <el-select v-model="shopCate.parentId" :disabled="shopCate.level == 1" placeholder="请选择分类">
          <el-option v-for="item in selectShopCateList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="优先级：">
        <el-input v-model="shopCate.priority" />
      </el-form-item>
      <el-form-item label="是否启用：">
        <el-radio-group v-model="shopCate.status">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('shopCateFrom')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('shopCateFrom')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { getList, getShopCate, updateShopcate, createShopCate } from '@/api/shopCate'
export default {
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      shopCate: {
        id: null,
        count: 0,
        name: '',
        parentId: 0,
        priority: 0,
        status: 0,
        level: null
      },
      selectShopCateList: [],
      rules: {
        name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 2, max: 140, message: '长度在2-140个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    if (this.isEdit) {
      this.getShopCate(this.$route.query.id)
    }
    this.getSelectShopCateList()
  },
  methods: {
    getSelectShopCateList() {
      getList({ parentId: 0, pageSize: 100, pageNum: 1 }).then(response => {
        this.selectShopCateList = response.data.list
        this.selectShopCateList.unshift({ id: 0, name: '全部品类' })
      })
    },
    getShopCate(id) {
      getShopCate(id).then(response => {
        this.shopCate = response.data
      })
    },
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm('是否提交数据', '提示', {
            confirButtonText: '确定',
            cancelButtonText: '取消',
            type: 'wraning'
          }).then(() => {
            if (this.isEdit) {
              updateShopcate(this.shopCate).then(response => {
                this.$message({
                  message: '修改成功',
                  type: 'success',
                  duration: 1000
                })
                this.$router.back()
              })
            } else {
              createShopCate(this.shopCate).then(response => {
                this.$message({
                  message: '添加成功',
                  type: 'success',
                  duration: 1000
                })
                this.$router.back()
              })
            }
          })
        } else {
          this.$message({
            message: '验证失败',
            type: 'error',
            duration: 1000
          })
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
