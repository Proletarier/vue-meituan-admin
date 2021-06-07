<template>
  <ProductDetail :is-edit="true" />

</template>

<script>
import ProductDetail from './components/ProductDetail'
export default {
  components: {
    ProductDetail
  }
}
</script>
