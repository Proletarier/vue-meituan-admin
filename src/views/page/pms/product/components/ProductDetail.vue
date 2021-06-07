<template>
  <div>
    <el-card class="form-container" style="width:700px" shadow="hover">
      <el-form ref="productForm" :model="product" label-width="100px" size="small">
        <el-form-item v-if="false" label="商品类型 : ">
          <el-radio-group v-model="product.productType">
            <el-radio :label="1" size="small " border>产品</el-radio>
            <el-radio :label="2" size="small " border>套餐</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="product.productType == 2" label="设置套餐: ">
          <el-table
            style="width: 100%"
            :data="product.detailList"
            size="small"
            border
          >
            <el-table-column label="名称" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.productName" />
              </template>
            </el-table-column>
            <el-table-column label="数量" width="80" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.quantity" />
              </template>
            </el-table-column>
            <el-table-column label="单位" width="80" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.unit" />
              </template>
            </el-table-column>
            <el-table-column label="重量（克）" width="90" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.weight" />
              </template>
            </el-table-column>
            <el-table-column label="启用" width="80" align="center">
              <template slot-scope="{row}">
                <el-switch v-model="row.status" :active-value="1" :inactive-value="0" />
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="80"
              align="center"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="handleRemoveProductSku(scope.$index, scope.row)"
                >删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button
            type="primary"
            style="margin-top: 20px"
            @click="dialogVisible=true"
          >添加
          </el-button>
        </el-form-item>
        <el-form-item label="商品名称: ">
          <el-input v-model="product.productName" />
        </el-form-item>
        <el-form-item label="商品介绍: ">
          <el-input
            v-model="product.productDesc"
            :auto-size="true"
            type="textarea"
            placeholder="欢迎下单"
          />
        </el-form-item>
        <el-form-item label="上架: ">
          <el-switch
            v-model="product.sellStatus"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
        <el-form-item label="单位: ">
          <el-input v-model="product.unit" />
        </el-form-item>
        <el-form-item label="商品售价: ">
          <el-input v-model="product.price" />
        </el-form-item>
        <el-form-item label="商品重量: ">
          <el-input v-model="product.weight" style="width: 300px" />
          <span style="margin-left: 20px">克</span>
        </el-form-item>
        <el-form-item label="商品库存: ">
          <el-input v-model="product.stock" />
        </el-form-item>
        <el-form-item label="产品图片：" prop="picUrl">
          <single-upload v-model="product.imageUrl" :data="{name: 'shop'}" />
        </el-form-item>
        <el-form-item label="属性类型：">
          <el-select v-model="selectProductAttrCateId" value-key="id" style="width:100%" multiple placeholder="请选择">
            <el-option
              v-for="item in productAttrCate"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="商品规格：">
          <el-card shadow="never" class="cardBg">
            <div v-for="attrCate in selectProductAttrCate" :key="attrCate.id">
              {{ attrCate.name +"：" }}
              <el-checkbox-group v-model="checkList" class="littleMarginLeft">
                <el-checkbox v-for="item in attrCate.productAttributeList" :key="item.id" :label="item.id">{{ item.name }}</el-checkbox>
              </el-checkbox-group>
            </div>
          </el-card>
        </el-form-item>
        <el-form-item style="text-align: center">
          <el-button size="medium" type="primary" @click="onSubmit('productForm')">提交</el-button>
          <el-button v-if="!isEdit" size="medium" @click="resetForm('productForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-dialog
      title="产品列表"
      :visible.sync="dialogVisible"
      width="50%"
      @open="getProductList"
    >
      <div>
        <span>筛选搜索</span>
        <el-button
          style="float: right"
          type="primary"
          size="mini"
          @click="handleSearchList()"
        >
          查询
        </el-button>
      </div>
      <div style="margin-top: 10px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item>
            <el-input v-model="listQuery.name" style="width: 203px" placeholder="商品名称" @keyup.enter.native="handleSearchList()" />
          </el-form-item>
        </el-form>
      </div>
      <el-table
        v-loading="listLoading"
        :data="listProduct"
        :header-cell-style="{background:'#eef1f6',color:'#606266'}"
        size="mini"
        style="width: 100%"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="80" align="center" />
        <el-table-column label="编号" width="80" align="center">
          <template slot-scope="{row}">{{ row.id }}</template>
        </el-table-column>
        <el-table-column label="产品名称" align="center" show-overflow-tooltip>
          <template slot-scope="{row}">{{ row.productName }}</template>
        </el-table-column>
        <el-table-column label="单位" width="80" align="center">
          <template slot-scope="{row}">{{ row.unit }}</template>
        </el-table-column>
        <el-table-column label="库存" width="80" align="center">
          <template slot-scope="{row}">{{ row.stock }}</template>
        </el-table-column>
        <el-table-column label="价格" width="80" align="center">
          <template slot-scope="{row}">{{ row.price }}</template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          small
          background
          layout="total,prev,pager,next"
          :page-size="listQuery.pageSize"
          :current-page.sync="listQuery.pageNum"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <div class="clearfix" />
      <span slot="footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="handleConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import SingleUpload from '@/components/Upload/singleUpload'
import { getProduct, updateProduct, createProduct, listProduct } from '@/api/product.js'
import { listAll } from '@/api/productAttr.js'

export default {
  components: {
    SingleUpload
  },
  props: {
    isEdit: {
      type: Boolean,
      detalut: false
    }
  },
  data() {
    return {
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        name: null
      },
      total: null,
      product: {
        shopId: null,
        productName: '',
        prdocutCategoryId: null,
        productType: 1,
        unit: '',
        imageUrl: '',
        productDesc: '欢迎下单',
        sellStatus: 0,
        deleteStatus: null,
        weight: 0,
        price: 0,
        promotionPrice: 0,
        stock: 0,
        lowStock: 0,
        minSaleQuantity: 0,
        detailList: [],
        attributeValueList: []
      },
      multipleSelection: [],
      checkList: [],
      productAttrCate: [], // 产品属性分类
      selectProductAttrCateId: [], // 选中的属性
      listProduct: [],
      dialogVisible: false,
      listLoading: false
    }
  },
  computed: {
    productId() {
      const list = this.product.detailList
      const array = []
      for (let i = 0; i < list.length; i++) {
        array.push(list[i].productId)
      }
      return array
    },
    selectProductAttrCate() {
      const productAttrCate = this.productAttrCate
      const selectProductCate = []
      for (let i = 0; i < productAttrCate.length; i++) {
        if (this.selectProductAttrCateId.includes(productAttrCate[i].id)) {
          selectProductCate.push(productAttrCate[i])
        }
      }
      return selectProductCate
    }
  },
  created() {
    if (this.isEdit) {
      const productId = this.$route.query.id
      this.getProduct(productId)
    }
    this.shopId = this.$route.query.shopId
    this.listProductAttrCate()
  },
  methods: {
    getProduct(productId) {
      getProduct(productId).then(respone => {
        this.product = respone.data
        // 设置checkList
        this.setCheckListAndSelectAttrCate()
      })
    },
    setCheckListAndSelectAttrCate() {
      const productAttrCateId = []
      this.product.attributeValueList.forEach(item => {
        this.checkList.push(item.productAttributeId)
        if (!productAttrCateId.includes(item.productAttributeCategoryId)) {
          productAttrCateId.push(item.productAttributeCategoryId)
        }
      })
      this.selectProductAttrCateId = productAttrCateId
    },
    setProductAttributeValueList() {
      const attributeValueList = []
      this.selectProductAttrCate.forEach(attrCate => {
        attrCate.productAttributeList.forEach(item => {
          if (this.checkList.includes(item.id)) {
            attributeValueList.push({
              productAttributeCategoryId: attrCate.id,
              productAttributeId: item.id,
              productId: this.$route.query.id,
              shopId: this.$route.query.shopId })
          }
        })
      })

      this.product.attributeValueList = attributeValueList
    },
    getProductList() {
      this.listLoading = true
      this.listQuery.shopId = this.shopId
      listProduct(this.listQuery).then(response => {
        this.listLoading = false
        this.listProduct = response.data.list
        this.total = response.data.total
      })
    },
    listProductAttrCate() {
      listAll({ shopId: this.shopId }).then(respone => {
        this.productAttrCate = respone.data
      })
    },
    onSubmit(formName) {
      this.$confirm('是否保存商品', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning '
      }).then(() => {
        this.setProductAttributeValueList()
        if (this.isEdit) {
          updateProduct(this.product).then(respone => {
            this.$message({
              type: 'success',
              message: '提交成功',
              duration: 1000
            })
            this.$router.back()
          })
        } else {
          this.product.shopId = this.shopId
          createProduct(this.product).then(respone => {
            this.$message({
              type: 'success',
              message: '提交成功',
              duration: 1000
            })
            this.$router.back()
          })
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    handleSizeChange(val) {
      this.listQuery.pageNum = 1
      this.listQuery.pageSize = val
      this.getProductList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getProductList()
    },
    handleSearchList() {
      this.listQuery.pageNum = 1
      this.getProductList()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleConfirm() {
      const detailList = this.product.detailList
      this.multipleSelection.forEach(item => {
        if (this.productId.length === 0 || !this.productId.includes(item.id)) {
          detailList.push({ productId: item.id,
            productName: item.productName,
            unit: item.unit,
            quantity: 1,
            weight: item.weight,
            stock: item.stock })
        } else if (this.productId.includes(item.id)) {
          for (let i = 0; i < detailList.length; i++) {
            if (detailList[i].productId === item.id) {
              detailList[i].quantity++
            }
          }
        }
      })
      this.product.detailList = detailList
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="sass">
  .cardBg
    background: #F8F9FC

  .littleMarginLeft
    margin-left: 10px

</style>
