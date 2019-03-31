<template>
  <div id="top-panel">
    <div id="market-select" class="select">
      <select v-model="currentMarket" title="Select market">
        <optgroup v-for="country in countries" :key="country" :label="country">
          <option
            v-for="market in markets[country]"
            :key="market.code"
            :value="market"
            :selected="market.code === currentMarket.code"
          >
            {{ market.code }}
          </option>
        </optgroup>
      </select>
    </div>
    <button
      id="open-order"
      @click="$emit('openOrderModalOpened')"
      class="button is-success is-size-6"
    >
      <span class="icon">+</span> {{ $t('openOrder') }}
    </button>
    <button id="logout-button" @click="logout" class="button">
      <span class="icon has-text-danger"><i class="fa fa-power-off"></i></span>
    </button>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { Component, Vue } from 'vue-property-decorator';

import { countries, markets } from '../constants';

@Component({
  methods: mapActions(['changeMarket']),
})
class TopPanel extends Vue {
  countries = [];
  markets = [];

  created() {
    this.countries = countries;
    this.markets = markets;
  }

  get currentMarket() {
    return this.$store.state.currentMarket;
  }

  set currentMarket(market) {
    this.apiService.stopBookFetch();
    this.changeMarket(market);
    this.apiService.startBookFetch();
  }

  logout() {
    this.confirm({
      message: this.$t('logoutConfirm'),
      onConfirm: () => {
        this.apiService.logout();
      },
    });
  }
}

export default TopPanel;
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
#open-order,
#logout-button {
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
    width: 100%;
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
