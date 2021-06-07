<template>
  <div>
    <el-card class="form-container" shadow="hover">
      <el-form ref="menuForm" :rules="rules" :model="menu" label-width="150px">
        <el-form-item label="菜单名称：" prop="title">
          <el-input v-model="menu.title" />
        </el-form-item>
        <el-form-item label="上级菜单：" prop="parentId">
          <el-select v-model="menu.parentId" placeholder="请选择上级菜单">
            <el-option v-for="item in listMenu" :key="item.id" :label="item.title" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="前端名称：">
          <el-input v-model="menu.name" />
        </el-form-item>
        <el-form-item label="前端图标：">
          <el-input v-model="menu.icon" placeholder="请输入内容" style="width:80%" />
          <svg-icon style="margin-left: 15px" :icon-class="menu.icon" />
        </el-form-item>
        <el-form-item label="排序：">
          <el-input v-model="menu.sort" />
        </el-form-item>
        <el-form-item label="是否显示:">
          <el-radio-group v-model="menu.hidden">
            <el-radio :label="0">是</el-radio>
            <el-radio :label="1">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('menuForm')">提交</el-button>
          <el-button v-if="!isEdit" @click="resetForm('menuForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { create, update, getMenu, list } from '@/api/menu.js'

const defaultMenu = {

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
      menu: Object.assign({}, defaultMenu),
      menuId: null,
      listMenu: [],
      rules:
        {
          title: [
            { required: true, message: '请输入账号', trigger: 'blur' }
          ]
        }
    }
  },
  created() {
    if (this.isEdit) {
      const menuId = this.$route.query.id
      this.getMenu(menuId)
    }
    this.getMenuList()
  },
  methods: {
    getMenu(id) {
      getMenu(id).then(respone => {
        this.menu = respone.data
      })
    },
    getMenuList() {
      list({ parentId: 0, pageSize: 100, pageNum: 1 }).then(response => {
        this.listMenu = response.data.list
        this.listMenu.unshift({ id: 0, title: '无上级菜单' })
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
              update(this.menu).then(response => {
                this.$message({
                  message: '修改成功',
                  type: 'success',
                  duration: 1000
                })
                this.$router.back()
              })
            } else {
              create(this.menu).then(response => {
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
