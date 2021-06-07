<template>
  <el-card class="form-container" shadow="hover">
    <el-form ref="productCateForm" :rules="rules" :model="productCate" label-width="150px">
      <el-form-item label="分类名称：" prop="categoryName">
        <el-input v-model="productCate.categoryName" />
      </el-form-item>
      <el-form-item label="启用状态:">
        <el-radio-group v-model="productCate.status">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('productCateForm')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('productCateForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { getProdutCate, updatetProdutCate, createProdutCate } from '@/api/productCate.js'

export default {
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      shopId: null,
      productCate: { id: null, shopId: null, categoryName: null, status: 0 },
      rules:
        {
          categoryName: [
            { required: true, message: '请输入分类名称', trigger: 'blur' }
          ]
        }
    }
  },
  created() {
    this.shopId = this.$route.query.shopId
    if (this.isEdit) {
      const productCateId = this.$route.query.id
      this.getProdutCate(productCateId)
    }
  },
  methods: {
    getProdutCate(productCateId) {
      getProdutCate(productCateId).then(respone => {
        this.productCate = respone.data
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
              updatetProdutCate(this.productCate).then(respone => {
                this.$message({
                  message: '修改成功',
                  type: 'success',
                  duration: 1000
                })
                this.$router.back()
              })
            } else {
              this.productCate.shopId = this.shopId
              createProdutCate(this.productCate).then(respone => {
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
