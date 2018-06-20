<template>
  <div id="top-panel">
    <div id="market-dropdown" class="dropdown" :class="{'is-active': isDropdownVisible }">
      <div class="dropdown-trigger">
        <button id="market-button" class="button has-text-weight-bold"
                @click="isDropdownVisible = !isDropdownVisible">ETHARS</button>
      </div>
      <div class="dropdown-menu">
        <div class="dropdown-content">
          <a class="dropdown-item">BTCARS</a>
          <a class="dropdown-item">XLMARS</a>
        </div>
      </div>
    </div>
    <button id="open-order" class="button is-success">
      <span class="icon is-size-6">+</span>
      Abrir orden de mercado
    </button>
    <button id="logout-button" @click="logout"
            class="button has-text-danger has-text-weight-bold is-size-7">Salir</button>
  </div>
</template>

<script>
export default {
  name: 'TopPanel',
  data () {
    return {
      isDropdownVisible: false
    }
  },
  methods: {
    logout () {
      if (confirm('¿Desea salir?')) {
        this.$emit('loggedOut')
      }
    }
  }
}
</script>

<style lang="scss">
  $cryptoMktColor: #677ae4;

  #top-panel {
    width: 100%;
    position: fixed;
    top: 0;
    box-shadow: 0 1px 12px rgba(0, 0, 0, 0.2);
    .button {
      border-radius: 0;
      height: 50px;
    }
  }
  #market-dropdown, #open-order, #logout-button {
    float: left;
    display: inline-block;
  }
  #market-dropdown {
    width: 25%;
    background-color: $cryptoMktColor;
  }
  #market-button {
    border: 0;
    background-color: $cryptoMktColor;
    color: #fff;
  }
  #open-order {
    font-size: 0.9rem;
    width: 60%;
  }
  #logout-button {
    width: 15%;
    border: 0;
    color: #fff;
  }
</style>
