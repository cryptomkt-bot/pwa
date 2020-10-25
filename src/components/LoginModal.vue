<template>
  <b-modal :active.sync="isVisible">
    <div class="card">
      <form @submit.prevent="login" class="card-content">
        <div class="field">
          <label for="apiUrl" class="label">{{ $t('apiUrl') }}</label>
          <div class="control">
            <input
              id="apiUrl"
              type="text"
              required
              v-model="apiUrl"
              :placeholder="$t('enterApiUrl')"
              class="input"
            />
          </div>
        </div>
        <div class="field">
          <label for="username" class="label">{{ $t('username') }}</label>
          <div class="control">
            <input
              id="username"
              type="text"
              autocapitalize="off"
              required
              v-model="username"
              :placeholder="$t('enterUsername')"
              class="input"
            />
          </div>
        </div>
        <div class="field">
          <label for="password" class="label">{{ $t('password') }}</label>
          <div class="control">
            <input
              id="password"
              type="password"
              required
              v-model="password"
              :placeholder="$t('enterPassword')"
              class="input"
            />
          </div>
        </div>
        <div class="field">
          <div class="control">
            <button
              :disabled="isLoading || !this.username || !this.password"
              type="submit"
              class="button is-primary is-fullwidth"
              :class="{ 'is-loading': isLoading }"
            >
              {{ $t('login') }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </b-modal>
</template>

<script>
import { Component, Vue, Watch } from 'vue-property-decorator';

import StorageHelper from '../helpers/StorageHelper';

@Component()
class LoginModal extends Vue {
  apiUrl = null;
  username = '';
  password = '';
  isLoading = false;

  created() {
    this.restoreFromStorage();
  }

  get isVisible() {
    return this.$store.state.isLoginModalVisible;
  }

  set isVisible(value) {
    this.$store.commit('setLoginModalVisibility', value);
  }

  login() {
    this.isLoading = true;
    this.apiService
      .login(this.apiUrl, this.username, this.password)
      .then(() => {
        this.isLoading = false;
        this.isVisible = false;
      })
      .catch((error) => {
        this.isLoading = false;
        let message = this.$t('errorMsg');
        if (error.response && error.response.status === 401) {
          message = this.$t('wrongUsernameOrPassword');
        }
        this.$buefy.toast.open({
          message,
          type: 'is-danger',
          duration: 3000,
        });
      });
  }

  restoreFromStorage() {
    this.apiUrl = this.apiService.apiUrl;
    this.username = this.apiService.username;
    this.password = '';
  }

  @Watch('isVisible')
  onVisibilityChanged(isVisible) {
    if (isVisible === false) {
      this.restoreFromStorage();
    }
  }
}

export default LoginModal;
</script>

<style scoped lang="scss"></style>
