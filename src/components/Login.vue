<template>
  <div>
    <h1 class="title has-text-weight-light has-text-centered is-marginless">
      CryptoMKT Bot
    </h1>
    <div class="section">
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
                @click="hideSignature"
                @blur="showSignature"
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
                @click="hideSignature"
                @blur="showSignature"
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
                @click="hideSignature"
                @blur="showSignature"
                :placeholder="$t('enterPassword')"
                class="input"
              />
            </div>
          </div>
          <div class="field">
            <div class="control">
              <button
                :disabled="!this.username || !this.password"
                class="button is-primary is-fullwidth"
              >
                {{ $t('login') }}
              </button>
            </div>
          </div>
        </form>
      </div>
      <div id="lang-select" class="select is-pulled-right">
        <select @change="changeLang($event.target.value)">
          <option
            v-for="(lang, i) in langs"
            :key="i"
            :value="lang"
            :selected="lang === $i18n.locale"
          >
            {{ langName(lang) }}
          </option>
        </select>
      </div>
    </div>
    <span v-show="isSignatureVisible" class="copyright is-size-7">
      {{ $t('builtWithLoveBy[0]') }} <i class="fa fa-heart"></i>
      {{ $t('builtWithLoveBy[1]') }}
      <a target="_blank" href="https://github.com/tanoabeleyra">tanoabeleyra</a>
    </span>
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';

import StorageHelper from '../helpers/StorageHelper';

@Component({
  dependencies: ['apiService'],
})
export default class Login extends Vue {
  apiUrl = null;
  username = '';
  password = '';
  isSignatureVisible = true;
  langs = ['en', 'es'];

  created() {
    this.restoreFromStorage();
  }

  login() {
    this.apiService
      .login(this.apiUrl, this.username, this.password)
      .catch(error => {
        let message = this.$t('errorMsg');
        if (error.response && error.response.status === 401) {
          message = this.$t('wrongUsernameOrPassword');
        }
        this.$toast.open({
          message,
          type: 'is-danger',
          duration: 3000,
        });
      });
  }

  restoreFromStorage() {
    this.apiUrl = StorageHelper.get('apiUrl');
    this.username = StorageHelper.get('username');
  }

  hideSignature() {
    this.isSignatureVisible = false;
  }

  showSignature() {
    this.isSignatureVisible = true;
  }

  langName(lang) {
    const langKey = `language.${lang}`;
    return this.$t(langKey);
  }

  changeLang(lang) {
    this.$i18n.locale = lang;
    StorageHelper.set('lang', lang);
  }
}
</script>

<style scoped>
#lang-select {
  margin-top: 16px;
}
.card {
  background-color: #fbfbfb;
}
.copyright {
  position: absolute;
  bottom: 12px;
  right: 12px;
}
.fa-heart {
  color: #ee0000;
}
</style>
