<template>
  <div id="top-panel">
    <div id="market-select" class="select">
      <select v-model="currentMarket">
        <optgroup v-for="country in countries" :key="country" :label="country">
          <option v-for="market in markets[country]" :key="market.code" :value="market"
                  :selected="market.code === currentMarket.code">{{ market.code }}</option>
        </optgroup>
      </select>
    </div>
    <button id="open-order" class="button is-success is-size-6" @click="$emit('openOrderModalOpened')">
      <span class="icon">+</span> Abrir orden
    </button>
    <button id="logout-button" @click="logout" class="button">
      <span class="icon has-text-danger"><i class="fa fa-power-off"></i></span>
    </button>
  </div>
</template>

<script>
import {countries, markets} from '../constants'

export default {
  name: 'TopPanel',
  data () {
    return {
      countries: [],
      markets: [],
      isDropdownVisible: false
    }
  },
  created () {
    this.countries = countries
    this.markets = markets
  },
  computed: {
    currentMarket: {
      get () {
        return this.$store.state.currentMarket
      },
      set (newValue) {
        this.$store.commit('changeMarket', newValue)
      }
    },
    otherMarkets () {
      return this.markets.filter(market => market.code !== this.currentMarket.code)
    }
  },
  methods: {
    changeMarket (market) {
      this.$store.commit('changeMarket', market)
    },
    logout () {
      this.$store.commit('showDialog', {
        text: '¿Desea salir?',
        callback: () => {
          this.$emit('loggedOut')
        }
      })
    }
  }
}
</script>

<style lang="scss">
  $cryptoMktColor: #677ae4;
  $panelHeight: 50px;

  #top-panel {
    width: 100%;
    height: 50px;
    position: fixed;
    top: 0;
    box-shadow: 0 1px 12px rgba(0, 0, 0, 0.2);
    .button {
      border-radius: 0;
      height: $panelHeight;
      box-shadow: none !important;
    }
  }
  #open-order, #logout-button {
    float: left;
    display: inline-block;
  }
  #market-select {
    float: left;
    width: 35%;
    height: $panelHeight;
    select {
      border: 0;
      border-radius: 0;
      height: $panelHeight;
      box-shadow: none !important;
    }
  }
  #open-order {
    font-size: 0.9rem;
    width: 50%;
  }
  #logout-button {
    width: 15%;
    border: 0;
    color: #fff;
  }
</style>
