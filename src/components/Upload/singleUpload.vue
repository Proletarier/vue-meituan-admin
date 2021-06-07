<template>
  <div>
    <el-upload
      :action="useOss?ossUploadUrl:minioUploadUrl"
      :data="useOss?dataObj:data"
      list-type="picture"
      :multiple="false"
      :show-file-list="showFileList"
      :file-list="fileList"
      :before-upload="beforeUpload"
      :on-remove="handleRemove"
      :on-success="handleUploadSuccess"
      :on-preview="handlePreview"
    >
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过10MB</div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="fileList[0].url" alt="">
    </el-dialog>
  </div>
</template>
<script>

export default {
  name: 'SingleUpload',
  props: {
    value: String,
    data: Object
  },
  data() {
    return {
      dataObj: {
        policy: '',
        signature: '',
        key: '',
        ossaccessKeyId: '',
        dir: '',
        host: ''
        // callback:'',
      },
      dialogVisible: false,
      useOss: false, // 使用oss->true
      ossUploadUrl: 'http://macro-oss.oss-cn-shenzhen.aliyuncs.com',
      minioUploadUrl: 'http://127.0.0.1:8080/upload/uploadImage'
    }
  },
  computed: {
    imageUrl() {
      return this.value
    },
    imageName() {
      if (this.value != null && this.value !== '') {
        return this.value.substr(this.value.lastIndexOf('/') + 1)
      } else {
        return null
      }
    },
    fileList() {
      return [{
        name: this.imageName,
        url: this.imageUrl
      }]
    },
    showFileList: {
      get: function() {
        return this.value !== null && this.value !== '' && this.value !== undefined
      },
      set: function(newValue) {
      }
    }
  },
  methods: {
    emitInput(val) {
      this.$emit('input', val)
    },
    handleRemove(file, fileList) {
      this.emitInput('')
    },
    handlePreview(file) {
      this.dialogVisible = true
    },
    beforeUpload(file) {
      if (!this.useOss) {
        // 不使用oss不需要获取策略
        return true
      }
    },
    handleUploadSuccess(res, file) {
      this.showFileList = true
      this.fileList.pop()
      let url = this.dataObj.host + '/' + this.dataObj.dir + '/' + file.name
      if (!this.useOss) {
        // 不使用oss直接获取图片路径
        url = res.data
      }
      this.fileList.push({ name: file.name, url: url })
      this.emitInput(this.fileList[0].url)
    }
  }
}
</script>
<style>

</style>

