<template>
  <div
    v-click-outside="hide"
    :class="{ 'is-active': isVisible }"
    class="dropdown is-right is-pulled-right"
  >
    <button @click="handleButtonClick" class="button dots-button">
      <span class="icon is-large has-text-white-ter">
        <i class="mdi mdi-dots-vertical mdi-24px"></i>
      </span>
    </button>
    <div class="dropdown-menu">
      <div class="dropdown-content z-depth-3">
        <a @click="showOpenOrderModal" class="dropdown-item">
          {{ $t('openOrder') }}
        </a>
        <a @click="showBalanceModal" class="dropdown-item">
          {{ $t('showBalance') }}
        </a>
        <hr class="dropdown-divider" />
        <a @click="showLanguageModal" class="dropdown-item">
          {{ $t('changeLanguage') }}
        </a>
        <a @click="logout" class="dropdown-item">
          {{ $t('logout') }}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';
import vClickOutside from 'v-click-outside';

@Component({
  directives: {
    clickOutside: vClickOutside.directive,
  },
})
class MenuDropdown extends Vue {
  isVisible = false;

  handleButtonClick() {
    this.isVisible = !this.isVisible;
  }

  showBalanceModal() {
    this.hide();
    this.$store.state.isBalanceModalVisible = true;
  }

  showLanguageModal() {
    this.hide();
    this.$store.state.isLanguageModalVisible = true;
  }

  showOpenOrderModal() {
    this.hide();
    this.$store.state.isOpenOrderModalVisible = true;
  }

  hide() {
    this.isVisible = false;
  }

  logout() {
    this.isVisible = false;
    this.confirm({
      message: this.$t('logoutConfirm'),
      onConfirm: () => {
        this.apiService.logout();
      },
    });
  }
}

export default MenuDropdown;
</script>

<style lang="scss" scoped>
$cryptoMktColor: #677ae4;

.dropdown {
  margin-right: 4px;
  .button {
    background-color: $cryptoMktColor;
  }
}
.dots-button {
  border: none;
}
</style>
