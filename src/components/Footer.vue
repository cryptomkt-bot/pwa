<template>
  <div id="footer-content" class="has-text-centered">
    <span>{{ currentMarket.code }}</span>
    <div class="price has-text-centered">
      <div class="price-label has-text-weight-light">venta</div>
      <div>${{ bid }}</div>
    </div>
    <div class="price has-text-centered">
      <div class="price-label has-text-weight-light">compra</div>
      <div>${{ ask }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Footer',
  props: ['ask', 'bid'],
  computed: {
    currentMarket () {
      return this.$store.state.currentMarket
    }
  }
}
</script>

<style scoped lang="scss">
  #footer-content {
    $height: 64px;
    background-color: #677ae4;
    color: #fff;
    font-size: 1.2rem;
    padding: 16px 0;
    height: $height;
    line-height: $height / 2;
    position: relative;
  }
  .price {
    display: inline-block;
    margin-top: -7px;
    margin-left: 10px;
  }
  .price-label {
    font-size: 0.7rem;
    line-height: 0.2rem;
  }
</style>
