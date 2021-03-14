<template>
  <b-modal :active.sync="isVisible" :canCancel="['outside']">
    <div class="card">
      <div class="card-content has-text-centered">
        <button
          v-for="lang in langs"
          @click="onLanguageSelected(lang.code)"
          :key="lang.code"
          :class="{ 'is-primary': lang.code === currentLang }"
          class="language button is-outlined"
        >
          {{ lang.label }}
        </button>
      </div>
    </div>
  </b-modal>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';

import StorageHelper from '../helpers/StorageHelper';

@Component()
class LanguageSelectorModal extends Vue {
  langs = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
  ];
  currentLang;

  created() {
    this.currentLang = StorageHelper.get('lang') || 'es';
  }

  get isVisible() {
    return this.$store.state.isLanguageModalVisible;
  }

  set isVisible(value) {
    this.$store.commit('setLanguageModalVisibility', value);
  }

  onLanguageSelected(lang) {
    this.$i18n.locale = lang;
    StorageHelper.set('lang', lang);
    this.isVisible = false;
    this.currentLang = lang;
  }
}

export default LanguageSelectorModal;
</script>

<style scoped lang="scss">
.button.language {
  margin-left: 8px;
  margin-right: 8px;
}
</style>
