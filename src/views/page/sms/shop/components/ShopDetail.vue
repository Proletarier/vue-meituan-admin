<template>
  <el-card class="form-container" shadow="never">
    <el-steps :active="active" finish-status="success" align-center>
      <el-step title="填写商家信息" />
      <el-step title="设置推广活动" />
      <el-step title="上传商家资质" />
    </el-steps>
    <shop-info-detail v-show="showStatus[0]" v-model="shop" :is-edit="isEdit" @nextStep="nextStep" />
    <shop-promotion-detail v-show="showStatus[1]" v-model="shop" :is-edit="isEdit" @prevStep="prevStep" @nextStep="nextStep" />
    <shop-qualification v-show="showStatus[2]" v-model="shop" :is-edit="isEdit" @finishCommit="finishCommit" @prevStep="prevStep" @nextStep="nextStep" />
  </el-card>
</template>

<script>
import ShopInfoDetail from './ShopInfoDetail'
import ShopPromotionDetail from './ShopPromotionDetail'
import ShopQualification from './ShopQualification'
import { getShopInfo, updateShop, createShop } from '@/api/shop.js'

export default {
  components: { ShopInfoDetail, ShopPromotionDetail, ShopQualification },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      shop: {
        shopId: '',
        shopName: '',
        picUrl: '',
        phone: '',
        city: null,
        county: null,
        address: '',
        shippingTime: '',
        shippingFee: 0,
        minPrice: 0,
        bulletin: '',
        status: 0,
        categoryId: null,
        // 商家资质
        shopQualification: { companyName: '', companyOwner: '', address: '', businessScope: '', enrollTime: null, expireTime: null },
        // 商家推广
        ShopPromotionDetails: []
      },
      active: 0,
      showStatus: [true, false, false]
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.query.shopId
      this.getShopInfo(id)
    }
  },
  methods: {
    getShopInfo(id) {
      getShopInfo(id).then(respone => {
        this.shop = respone.data
      })
    },
    finishCommit(isEdit) {
      this.$confirm('是否保存商家', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning '
      }).then(() => {
        if (isEdit) {
          updateShop(this.shop).then(respone => {
            this.$message({
              type: 'success',
              message: '提交成功',
              duration: 1000
            })
            this.$router.back()
          })
        } else {
          createShop(this.shop).then(respone => {
            this.$message({
              type: 'success',
              message: '提交成功',
              duration: 1000
            })
          })
        }
      })
    },
    prevStep() {
      if (this.active > 0 && this.active < this.showStatus.length) {
        this.active--
        this.hideAll()
        this.showStatus[this.active] = true
      }
    },
    nextStep() {
      if (this.active < this.showStatus.length - 1) {
        this.active++
        this.hideAll()
        this.showStatus[this.active] = true
      }
    },
    hideAll() {
      for (let i = 0; i < this.showStatus.length; i++) {
        this.showStatus[i] = false
      }
    }
  }
}
</script>

<style lang="sass">

  .form-container
    width: 800px

</style>

