<template>
  <el-card class="form-container" shadow="hover">
    <el-form ref="adminForm" :rules="rules" :model="admin" label-width="150px">
      <el-form-item label="账号：" prop="username">
        <el-input v-model="admin.username" />
      </el-form-item>
      <el-form-item label="昵称：" prop="username">
        <el-input v-model="admin.nickName" />
      </el-form-item>
      <el-form-item label="电话：">
        <el-input v-model="admin.phone" />
      </el-form-item>
      <el-form-item label="邮箱：">
        <el-input v-model="admin.email" placeholder="请输入内容">
          <template slot="append">.com</template>
        </el-input>
      </el-form-item>
      <el-form-item label="备注：">
        <el-input
          v-model="admin.note"
          :auto-size="true"
          placeholder="请输入内容"
          type="textarea"
        />
      </el-form-item>
      <el-form-item label="启用状态:">
        <el-radio-group v-model="admin.status">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('adminForm')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('adminForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { create, update, getItem } from '@/api/admin.js'

const defaultAdmin = {
  username: null,
  nickName: null,
  phone: null,
  email: null,
  note: null,
  status: 0
}

export default {
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      admin: Object.assign({}, defaultAdmin),
      rules:
        {
          username: [
            { required: true, message: '请输入账号', trigger: 'blur' }
          ]
        }
    }
  },
  created() {
    if (this.isEdit) {
      const adminId = this.$route.query.id
      this.getAdmin(adminId)
    }
  },
  methods: {
    getAdmin(id) {
      getItem(id).then(respone => {
        this.admin = respone.data
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
              update(this.admin).then(respone => {
                this.$message({
                  message: '修改成功',
                  type: 'success',
                  duration: 1000
                })
                this.$router.back()
              })
            } else {
              create(this.admin).then(respone => {
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
    }
  }

}
</script>
