<template>
  <el-card class="form-container" shadow="hover">
    <el-form label-width="50px">
      <el-form-item>
        <el-tree
          ref="treeMenu"
          :data="menuList"
          show-checkbox
          node-key="id"
          default-expand-all
          highlight-current
          :default-checked-keys="defaultChedkedIds"
          :props="defaultProps"
        />
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button @click="resetChecked">清空</el-button>
      </el-form-item>
    </el-form>
  </el-card>

</template>

<script>
import { treeMenu } from '@/api/menu.js'
import { listMenuRelation, allocMenu } from '@/api/role.js'

export default {
  data() {
    return {
      menuList: [],
      roleId: null,
      roleMenuRelation: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      }
    }
  },
  computed: {
    // 设置默认选中状态
    defaultChedkedIds() {
      const defaultChedkedIds = []
      this.roleMenuRelation.forEach(item => {
        defaultChedkedIds.push(item.menuId)
      })
      this.filterParentId(this.menuList, defaultChedkedIds)
      return defaultChedkedIds
    }
  },
  created() {
    this.roleId = this.$route.query.roleId
    this.listWithChildren()
    this.listMenuRelation()
  },
  methods: {
    listWithChildren() {
      treeMenu().then(respone => {
        this.menuList = respone.data
      })
    },
    listMenuRelation() {
      listMenuRelation(this.roleId).then(respone => {
        this.roleMenuRelation = respone.data
      })
    },
    filterParentId(menuList, defaultChedkedIds) {
      menuList.forEach((menu) => {
        if (menu.children != null && menu.children.length > 0) {
          defaultChedkedIds.forEach((item, index) => {
            if (item === menu.id) {
              defaultChedkedIds.splice(index, 1)
            }
          })
          this.filterParentId(menu.children, defaultChedkedIds)
        }
      })
    },
    onSubmit() {
      const roleMenuRelationIds = this.$refs['treeMenu'].getCheckedKeys()
      const parentIds = this.$refs['treeMenu'].getHalfCheckedKeys()
      const mergeIds = new Set(roleMenuRelationIds)
      if (parentIds.length > 0) {
        parentIds.forEach(id => mergeIds.add(id))
      }

      this.$confirm('是否分配菜单？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = new URLSearchParams()
        params.append('roleId', this.roleId)
        params.append('menuIds', Array.from(mergeIds))
        allocMenu(params).then(response => {
          this.$message({
            message: '分配成功',
            type: 'success',
            duration: 1000
          })
          this.$router.back()
        })
      })
    },
    resetChecked() {
      this.$refs.treeMenu.setCheckedKeys([])
    }
  }
}
</script>
