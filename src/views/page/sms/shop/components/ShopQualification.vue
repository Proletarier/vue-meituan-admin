<template>
  <div style="margin-top:50px">
    <el-form ref="qualificationForm" :rules="rules" :model="shopQualification" style="width: 700px" label-width="100px">
      <el-form-item label="公司名称：" prop="companyName">
        <el-input v-model="shopQualification.companyName" />
      </el-form-item>
      <el-form-item label="公司法人：" prop="companyOwner">
        <el-input v-model="shopQualification.companyOwner" />
      </el-form-item>
      <el-form-item label="公司地址：" prop="address">
        <el-input v-model="shopQualification.address" />
      </el-form-item>
      <el-form-item label="经营范围：" prop="businessScope">
        <el-input v-model="shopQualification.businessScope" />
      </el-form-item>
      <el-form-item label="注册日期：" prop="enrollTime">
        <el-date-picker
          v-model="shopQualification.enrollTime"
          type="date"
          placeholder="选择日期"
        />
      </el-form-item>
      <el-form-item label="过期日期：" prop="expireTime">
        <el-date-picker
          v-model="shopQualification.expireTime"
          type="date"
          placeholder="选择日期"
        />
      </el-form-item>
      <el-form-item label="资质证书：">
        <mult-upload v-model="qualifyPics" :data="{name:'shop'}" />
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button size="medium" @click="handlePrev">上一步，设置商家推广</el-button>
        <el-button type="primary" size="medium" @click="handleFinishCommit('qualificationForm')">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import MultUpload from '@/components/Upload/multUpload'
export default {
  components: {
    MultUpload
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
      qualifyPics: [],
      shopQualification: {
        type: Object,
        default: { companyName: '', companyOwner: '', address: '', businessScope: '', enrollTime: null, expireTime: null }
      },
      rules: {
        companyName: [{ required: true, message: '请输入公司名称', trigger: 'blur' }],
        companyOwner: [{ required: true, message: '请输入公司法人', trigger: 'blur' }],
        address: [{ required: true, message: '请输入公司地址', trigger: 'blur' }],
        businessScope: [{ required: true, message: '请输入经营范围', trigger: 'blur' }],
        enrollTime: [{ required: true, message: '请选择注册时间', trigger: 'change' }],
        expireTime: [{ required: true, message: '请选择过期时间', trigger: 'change' }]

      }
    }
  },
  computed: {
    shopId() {
      return this.value.id
    }
  },
  watch: {
    shopId(val) {
      if (val == null || val === undefined) return

      if (this.value.shopQualification != null) {
        this.shopQualification = this.value.shopQualification
        if (this.shopQualification.qualifyPics.includes(',')) {
          this.qualifyPics = this.shopQualification.qualifyPics.split(',')
        } else {
          this.qualifyPics.push(this.shopQualification.qualifyPics)
        }
      }
    }
  },
  methods: {
    handleShopQualification() {
      const qualifyPics = this.qualifyPics.join(',')
      this.shopQualification.qualifyPics = qualifyPics
      this.value.shopQualification = this.shopQualification
    },
    handlePrev() {
      this.$emit('prevStep')
    },
    handleFinishCommit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.handleShopQualification()
          this.$emit('finishCommit', this.isEdit)
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
