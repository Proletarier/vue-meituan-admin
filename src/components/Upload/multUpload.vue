<template>
  <div>
    <el-upload
      action="http://127.0.0.1:8080/upload/uploadImage"
      :data="data"
      list-type="picture-card"
      :file-list="fileList"
      :on-preview="handlePreview"
      :on-success="handleUploadSuccess"
      :on-remove="handleRemove"
      :limit="maxCount"
      :on-exceed="handleExceed"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    // 图片属性数组
    value: {
      type: Array,
      default: null
    },
    // 最大上传图片数量
    maxCount: {
      type: Number,
      default: 5
    },
    data: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      dialogVisible: false,
      dialogImageUrl: null,
      fileList: []
    }
  },
  watch: {
    value(val) {
      if (this.fileList != null && this.fileList.length > 0) return
      for (let i = 0; i < this.value.length; i++) {
        this.fileList.push({ url: this.value[i] })
      }
    }
  },
  methods: {
    emitInput(fileList) {
      const value = []
      for (let i = 0; i < fileList.length; i++) {
        value.push(fileList[i].url)
      }
      this.$emit('input', value)
    },
    handleExceed(files, fileList) {
      this.$message({
        message: '最多只能上传' + this.maxCount + '张图片',
        type: 'warning',
        duration: 1000
      })
    },
    handlePreview(file) {
      this.dialogVisible = true
      this.dialogImageUrl = file.url
    },
    handleUploadSuccess(res, file, fileList) {
      fileList[fileList.length - 1].url = res.data
      this.emitInput(fileList)
    },
    handleRemove(file, fileList) {
      this.emitInput(fileList)
    }

  }
}
</script>
