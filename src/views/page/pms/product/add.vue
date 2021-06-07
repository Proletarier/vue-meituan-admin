<template>
  <ProductDetail :is-edit="false" />

</template>

<script>
import ProductDetail from './components/ProductDetail'
export default {
  components: {
    ProductDetail
  }
}
</script>
