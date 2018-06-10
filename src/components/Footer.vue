<template>
  <div id="footer-content">
    <span>ETHARS</span>
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
  props: ['ask', 'bid']
}
</script>

<style scoped>
  #footer-content {
    background-color: #677ae4;
    color: #fff;
    font-size: 1.2rem;
    padding: 16px 48px 16px 48px;
    height: 64px;
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
