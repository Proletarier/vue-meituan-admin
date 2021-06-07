<template>
  <el-card class="form-container" style="width:800px" shadow="never">
    <div class="table-layout">
      <div v-for="cate in resourceCategoryList" :key="cate.id">
        <el-row class="row-layout" style="background: #F2F6FC;">
          <el-checkbox
            v-model="cate.checked"
            :indeterminate="indeterminate(cate.id)"
            @change="handleCheckAllChange(cate)"
          >{{ cate.name }}</el-checkbox>
        </el-row>
        <el-row class="row-layout">
          <el-col v-for="resource in getResourceByCate(cate.id)" :key="resource.id" :span="8" style="padding: 4px 0">
            <el-checkbox v-model="resource.checked" @change="handleCheckedResourceChange(resource)">{{ resource.name }}</el-checkbox>
          </el-col>
        </el-row>
      </div>
    </div>
    <div style="text-align: center;margin-top:20px">
      <el-button type="primary" @click="onSubmit">提交</el-button>
      <el-button @click="resetChecked">清空</el-button>
    </div>
  </el-card>
</template>

<script>
import { listAll, list } from '@/api/resource.js'
import { listRoleResourceRelation, allocResource } from '@/api/role.js'

export default {
  data() {
    return {
      roleId: null,
      resourceCategoryList: [],
      resourceList: []
    }
  },
  created() {
    this.roleId = this.$route.query.roleId
    this.listRsource()
  },
  methods: {
    listRsource() {
      list({ pageNum: 1, pageSize: 1000 }).then(respone => {
        this.resourceList = respone.data.list
        this.resourceList.forEach(item => {
          item.checked = false
        })
        this.listResourceCate()
      })
    },
    listResourceCate() {
      listAll().then(respone => {
        this.resourceCategoryList = respone.data.list
        this.resourceCategoryList.forEach(item => {
          item.checked = false
        })
        // 获取角色资源
        this.listRoleResourceRelation()
      })
    },
    listRoleResourceRelation() {
      listRoleResourceRelation(this.roleId).then(respone => {
        const allocResource = respone.data
        this.resourceList.forEach(item => {
          item.checked = this.getResourceChecked(allocResource, item.id)
        })
        this.resourceCategoryList.forEach(item => {
          item.checked = this.getResourceCateChecked(item.id)
        })
        this.$forceUpdate()
      })
    },
    getResourceCateChecked(cateId) {
      let resourceIdCount = 0
      let checkedCount = 0
      this.resourceList.forEach(item => {
        if (item.categoryId === cateId) {
          resourceIdCount++
          if (item.checked) { checkedCount++ }
        }
      })
      return checkedCount > 0 && checkedCount === resourceIdCount
    },
    getResourceChecked(allocResource, resourceId) {
      if (allocResource.length == null || allocResource.length === 0) { return false }
      for (let i = 0; i < allocResource.length; i++) {
        if (allocResource[i].resourceId === resourceId) {
          return true
        }
      }
      return false
    },
    indeterminate(cateId) {
      const resourceList = this.getResourceByCate(cateId)
      let chckedCount = 0
      for (let i = 0; i < resourceList.length; i++) {
        if (resourceList[i].checked) {
          chckedCount++
        }
      }
      return chckedCount > 0 && chckedCount < resourceList.length
    },
    getResourceByCate(categoryId) {
      const cateResource = []
      if (this.resourceList == null) return null
      for (let i = 0; i < this.resourceList.length; i++) {
        const resource = this.resourceList[i]
        if (resource.categoryId === categoryId) {
          cateResource.push(resource)
        }
      }
      return cateResource
    },
    handleCheckAllChange(cate) {
      const resourceCate = this.getResourceByCate(cate.id)
      for (let i = 0; i < resourceCate.length; i++) {
        resourceCate[i].checked = cate.checked
      }
      this.$forceUpdate()
    },
    handleCheckedResourceChange(resource) {
      this.resourceCategoryList.forEach(item => {
        if (resource.categoryId === item.id) {
          item.checked = this.getResourceCateChecked(item.id)
        }
      })
      this.$forceUpdate()
    },
    onSubmit() {
      const allocReourceIds = []
      this.resourceList.forEach(item => {
        if (item.checked) {
          allocReourceIds.push(item.id)
        }
      })

      this.$confirm('是否分配资源？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = new URLSearchParams()
        params.append('roleId', this.roleId)
        params.append('resourceIds', allocReourceIds)
        allocResource(params).then(response => {
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

    }
  }
}
</script>

<style lang="sass">
  .table-layout
    border-top:  1px solid #DCDFE6
    border-left: 1px solid #DCDFE6
    border-right: 1px solid #DCDFE6

  .row-layout
    padding: 20px
    border-bottom: 1px solid #DCDFE6
</style>
