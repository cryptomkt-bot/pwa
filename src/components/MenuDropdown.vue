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
        <template v-if="isAuthenticated">
          <a
            v-if="hasCredentialsSupport"
            @click="configureLock"
            class="dropdown-item"
          >
            {{ $t('configureLock') }}
          </a>
          <a @click="showOpenOrderModal" class="dropdown-item">
            {{ $t('openOrder') }}
          </a>
          <a @click="showBalanceModal" class="dropdown-item">
            {{ $t('showBalance') }}
          </a>
          <hr class="dropdown-divider" />
        </template>
        <a @click="showLanguageModal" class="dropdown-item">
          {{ $t('changeLanguage') }}
        </a>
        <a v-if="isAuthenticated" @click="logout" class="dropdown-item">
          {{ $t('logout') }}
        </a>
        <a v-else @click="showLoginModal" class="dropdown-item">
          {{ $t('login') }}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters, mapMutations, mapState } from 'vuex';
import vClickOutside from 'v-click-outside';
import StorageHelper from '../helpers/StorageHelper';

@Component({
  methods: mapMutations([
    'setBalanceModalVisibility',
    'setLanguageModalVisibility',
    'setLoginModalVisibility',
    'setOpenOrderModalVisibility',
  ]),
  computed: {
    ...mapState(['username']),
    ...mapGetters(['isAuthenticated']),
  },
  directives: {
    clickOutside: vClickOutside.directive,
  },
})
class MenuDropdown extends Vue {
  isVisible = false;

  get hasCredentialsSupport() {
    return !!navigator.credentials;
  }

  handleButtonClick() {
    this.isVisible = !this.isVisible;
  }

  showBalanceModal() {
    this.hide();
    this.setBalanceModalVisibility(true);
  }

  showLanguageModal() {
    this.hide();
    this.setLanguageModalVisibility(true);
  }

  showOpenOrderModal() {
    this.hide();
    this.setOpenOrderModalVisibility(true);
  }

  showLoginModal() {
    this.hide();
    this.setLoginModalVisibility(true);
  }

  hide() {
    this.isVisible = false;
  }

  async configureLock() {
    const credential = await navigator.credentials.create({
      publicKey: {
        user: {
          id: new ArrayBuffer(),
          name: this.username,
          displayName: this.username,
        },
        challenge: new ArrayBuffer(),
        rp: {
          name: 'CryptoMKT Bot',
        },
        pubKeyCredParams: [],
      },
    });

    StorageHelper.set('credential', {
      id: credential.id,
      type: credential.type,
    });

    this.hide();
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

<style scoped lang="scss">
@import '../constants';

.dropdown {
  margin-right: 4px;
  .button {
    background-color: $cryptoMktColor;
    border-radius: 0;
    height: $panelHeight;
    box-shadow: none !important;
  }
}
.dots-button {
  border: none;
}
</style>
