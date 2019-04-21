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
    <div class="price has-text-centered">
      <div class="price-label has-text-weight-light">{{ $t('bidPrice') }}</div>
      <div>{{ formatPrice(bid) }}</div>
    </div>
    <div class="price has-text-centered">
      <div class="price-label has-text-weight-light">{{ $t('askPrice') }}</div>
      <div>{{ formatPrice(ask) }}</div>
    </div>
    <MenuDropdown />
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';
import { mapActions, mapGetters } from 'vuex';

import MenuDropdown from './MenuDropdown';
import { countries, markets } from '../constants';

@Component({
  methods: mapActions(['changeMarket']),
  computed: mapGetters(['ask', 'bid']),
  components: { MenuDropdown },
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

  formatPrice(price) {
    return this.formatAmount(
      price,
      this.currentMarket.quoteCurrency,
      this.currentMarket.decimals
    );
  }
}

export default TopPanel;
</script>

<style scoped lang="scss">
@import '../constants';

#top-panel {
  width: 100%;
  height: $panelHeight;
  position: fixed;
  top: 0;
  background-color: $cryptoMktColor;
  color: #fff;
}
#market-select {
  float: left;
  width: 35%;
  height: $panelHeight;
  &::after {
    border-color: rgba(255, 255, 255, 0.8) !important;
  }
  select {
    font-size: 1.1rem;
    background-color: $cryptoMktColor;
    border: 0;
    border-radius: 0;
    height: $panelHeight;
    width: 100%;
    box-shadow: none !important;
    // Workaround to remove outline in Firefox
    color: transparent;
    text-shadow: 0 0 0 #fff;
  }
}
.price {
  display: inline-block;
  margin-top: 16px;
  margin-left: 16px;
  font-size: 1.2rem;
}
.price-label {
  font-size: 0.7rem;
  line-height: 0.2rem;
}
</style>
