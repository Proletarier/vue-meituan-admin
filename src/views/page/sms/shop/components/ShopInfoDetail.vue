<template>
  <div style="margin-top:50px">
    <el-form ref="shopInfoForm" :model="value" :rules="rules" style="600px" label-width="100px" size="small">
      <el-form-item label="商家名称：" prop="shopName">
        <el-input v-model="value.shopName" />
      </el-form-item>
      <el-form-item label="商家电话：" prop="phone">
        <el-input v-model="value.phone" />
      </el-form-item>
      <el-form-item label="商家类型：" prop="categoryId">
        <el-cascader v-model="value.categoryId" placeholder="请选择" :options="shopCateOptions" :props="{emitPath:false}" />
      </el-form-item>
      <el-form-item label="城市：" prop="county">
        <el-cascader v-model="selectRegionValue" placeholder="请选择" filterable :options="regionOptions" />
      </el-form-item>
      <el-form-item label="详细地址：" prop="address">
        <el-input v-model="value.address" />
      </el-form-item>
      <el-form-item label="营业时间：" prop="shippingTime">
        <el-col :span="8">
          <el-form-item style="margin-bottom: 0">
            <el-time-select
              v-model="startTime"
              placeholder="起始时间"
              style="width: 100%"
              :picker-options="{
                start: '00:00',
                step: '00:30',
                end: '24:00'
              }"
            />
          </el-form-item>
        </el-col>
        <el-col class="line" :span="1" align="center">-</el-col>
        <el-col :span="8">
          <el-form-item style="margin-bottom: 0">
            <el-time-select
              v-model="endTime"
              placeholder="结束时间"
              style="width: 100%"
              :picker-options="{
                start: '00:00',
                step: '00:30',
                end: '24:00',
                minTime: startTime
              }"
            />
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="最低消费：" prop="minPrice">
        <el-input v-model.number="value.minPrice" />
      </el-form-item>
      <el-form-item label="是否启用：">
        <el-switch
          v-model="value.status"
          :active-value="1"
          :inactive-value="0"
        />
      </el-form-item>
      <el-form-item label="店铺头像：" prop="picUrl">
        <head-pic-upload v-model="value.picUrl" :data="{name: 'shop'}" />
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button type="primary" size="medium" @click="handleNext('shopInfoForm')">下一步，设置商家推广</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import HeadPicUpload from '@/components/Upload/headPicUpload'
import { listShopCateAndChildren } from '@/api/shopCate.js'
import { cityList } from '@/api/region.js'

export default {
  components: {
    HeadPicUpload
  },
  props: {
    value: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      regionOptions: [],
      shopCateOptions: [],
      selectRegionValue: [],
      selectShopCateValue: [],
      startTime: null, // 起送时间
      endTime: null, // 停业时间
      rules: {
        shopName: [
          { required: true, message: '请输入店铺名称', trigger: 'blur' },
          { min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          {
            validator: function(rule, value, callback) {
              if (/^1[34578]\d{9}$/.test(value) === false) {
                callback(new Error('手机号格式错误'))
              } else {
                callback()
              }
            }
          }
        ],
        categoryId: [{ required: true, message: '请选择商家类型', trigger: 'blur' }],
        county: [{ required: true, message: '请选择城市', trigger: 'blur' }],
        address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
        shippingTime: [{ required: true, message: '请设置营业时间', trigger: 'blur' }],
        picUrl: [{ required: true, message: '请上传店铺头像', trigger: 'blur' }],
        minPrice: [{ type: 'number', message: '请输入数字', trigger: 'blur' }]
      }
    }
  },
  computed: {
    shopId() {
      return this.value.id
    },
    shippingTime() {
      if (this.startTime != null && this.startTime !== '' && this.startTime !== undefined &&
        this.endTime != null && this.endTime !== '' && this.endTime !== undefined) {
        return this.startTime + '-' + this.endTime
      } else {
        return null
      }
    }

  },
  watch: {
    shopId: function(newValue) {
      if (newValue == null || newValue === undefined) {
        return
      }
      this.handleEditUpdate()
    },
    selectRegionValue: function(newValue) {
      if (newValue != null && newValue.length === 2) {
        this.value.city = newValue[0]
        this.value.county = newValue[1]
      }
    },
    shippingTime(val) {
      this.value.shippingTime = this.shippingTime
    }
  },
  created() {
    this.getcityList()
    this.getShopCateWithChildrenList()
  },
  methods: {
    handleEditUpdate() {
      // 设置市区
      this.selectRegionValue.push(this.value.city)
      this.selectRegionValue.push(this.value.county)
      // 设置配送时间
      const times = this.value.shippingTime.split('-')
      this.startTime = times[0]
      this.endTime = times[1]
    },
    getcityList() {
      cityList().then(respone => {
        const list = respone.data
        this.regionOptions = []
        for (let i = 0; i < list.length; i++) {
          const children = []
          if (list[i].children != null && list[i].children.length > 0) {
            for (let j = 0; j < list[i].children.length; j++) {
              children.push({ label: list[i].children[j].name, value: list[i].children[j].id })
            }
          }
          this.regionOptions.push({ label: list[i].name, value: list[i].id, children: children })
        }
      })
    },
    getShopCateWithChildrenList() {
      listShopCateAndChildren().then(respone => {
        const list = respone.data
        this.shopCateOptions = []
        for (let i = 0; i < list.length; i++) {
          const children = []
          if (list[i].children != null && list[i].children.length > 0) {
            for (let j = 0; j < list[i].children.length; j++) {
              children.push({ label: list[i].children[j].name, value: list[i].children[j].id })
            }
          }
          this.shopCateOptions.push({ label: list[i].name, value: list[i].id, children: children })
        }
      })
    },
    handleNext(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit('nextStep')
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
