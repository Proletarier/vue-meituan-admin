<template>
  <div style="margin-top: 50px">
    <el-form ref="promotionForm" :model="value" style="width: 750px">
      <el-form-item label="商家特色：">
        <el-checkbox-group v-model="selectShopFeatureId" @change="handleCheckboxChange">
          <el-checkbox v-for="item in listFeature" :key="item.id" :label="item.id">{{ item.name }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="商家活动：">
        <el-select v-model="selectActivityId" style="width:500px" size="medium" multiple placeholder="请选择" @change="handleSelectChange">
          <el-option
            v-for="item in listActivity"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="设置：">
        <el-table ref="activityTable" :data="selectActivity" border highlight-current-row size="small" style="width: 90%" tooltip-effect="dark">
          <el-table-column align="center" label="活动名称" width="120">
            <template slot-scope="scope">{{ scope.row.promotionName }}</template>
          </el-table-column>
          <el-table-column align="center" label="活动详情" width="400">
            <template slot-scope="scope">{{ scope.row.description }}</template>
            <template slot-scope="{row}">
              <el-input v-if="row.edit" v-model="row.description" size="small" />
              <span v-else>{{ row.description }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="编辑">
            <template slot-scope="{row}">
              <el-button
                v-if="row.edit"
                type="text"
                size="mini"
                icon="el-icon-check"
                @click="confirmEdit(row)"
              >
                保存
              </el-button>
              <el-button
                v-else
                type="text"
                size="mini"
                icon="el-icon-edit"
                @click="row.edit=!row.edit"
              >
                编辑
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button size="medium" @click="handlePrev">上一步，设置商家推广</el-button>
        <el-button type="primary" size="medium" @click="handleNext('promotionForm')">下一步，上传商家资质</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { listPromotion } from '@/api/promotion.js'

export default {
  comments: {

  },
  props: {
    value: {
      type: Object,
      required: true
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      listFeature: [],
      listActivity: [],
      selectShopFeature: [],
      selectShopFeatureId: [], // 选中的商家特色
      selectActivityId: [],
      selectActivity: []
    }
  },
  computed: {
    shopId() {
      return this.value.id
    }
  },
  watch: {
    shopId: function(val) {
      if (this.isEdit && val != null) {
        this.handleEditCreated()
      }
    }
  },
  created() {
    this.getPromotionList()
  },
  methods: {
    handleEditCreated() {
      const details = this.value.shopPromotionDetails
      for (let i = 0; i < details.length; i++) {
        // 设置商家特色
        if (details[i].promotionType === 2) {
          this.selectShopFeatureId.push(details[i].promotionId)
          this.selectShopFeature.push(details[i])
        }
        // 设置商家活动
        if (details[i].promotionType === 1) {
          this.selectActivityId.push(details[i].promotionId)
          this.selectActivity.push({ id: details[i].id, promotionId: details[i].promotionId, edit: false, promotionName: details[i].promotionName, description: details[i].description, shopId: this.shopId, promotionType: 1 })
        }
      }
    },
    getPromotionList() {
      listPromotion({ promotionType: '2' }).then(respone => {
        const list = respone.data
        list.map(item => {
          this.$set(item, 'detailId', undefined)
        })
        this.listFeature = list
      })
      listPromotion({ promotionType: '1' }).then(respone => {
        const list = respone.data
        list.map(item => {
          this.$set(item, 'edit', false)
        })
        this.listActivity = list
      })
    },
    handleSelectChange(val) {
      // 设置选中的table
      if (val.length > this.selectActivity.length) {
        const name = this.getPromotionName(val[val.length - 1])
        this.selectActivity.push({ promotionId: val[val.length - 1], edit: false, promotionName: name, description: '', shopId: this.shopId, promotionType: 1 })
      } else {
        for (let i = 0; i < this.selectActivity.length; i++) {
          if (val.indexOf(this.selectActivity[i].promotionId) === -1) {
            this.selectActivity.splice(i, 1)
          }
        }
      }
    },
    handleCheckboxChange(val) {
      if (val.length > this.selectShopFeature.length) {
        this.selectShopFeature.push({ promotionId: val[val.length - 1], description: '', shopId: this.shopId, promotionType: 2 })
      } else {
        for (let i = 0; i < this.selectShopFeature.length; i++) {
          if (val.indexOf(this.selectShopFeature[i].promotionId) === -1) {
            this.selectShopFeature.splice(i, 1)
          }
        }
      }
    },
    getPromotionName(id) {
      let name = ''
      this.listActivity.forEach(item => {
        if (id === item.id) {
          name = item.name
        }
      })
      return name
    },
    handleShopPromotionDetail() {
      this.value.shopPromotionDetails = []
      for (let i = 0; i < this.selectActivity.length; i++) {
        const item = this.selectActivity[i]
        this.value.shopPromotionDetails.push({
          detailId: item.detailId,
          promotionId: item.promotionId,
          promotionName: item.promotionName,
          description: item.description,
          shopId: item.shopId,
          promotionType: item.promotionType
        })
      }
      for (let i = 0; i < this.selectShopFeature.length; i++) {
        const item = this.selectShopFeature[i]
        this.value.shopPromotionDetails.push({
          detailId: item.detailId,
          promotionId: item.promotionId,
          shopId: item.shopId,
          promotionType: item.promotionType
        })
      }
    },
    confirmEdit(row) {
      row.edit = false
    },
    handlePrev() {
      this.$emit('prevStep')
    },
    handleNext(formName) {
      this.handleShopPromotionDetail()
      this.$emit('nextStep')
    }
  }
}
</script>
