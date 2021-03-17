<template>
  <div v-show="isLocked" class="wrapper">
    <b-button
      @click="unlock"
      :label="$t('unlock')"
      size="is-medium"
      type="is-dark"
      icon-left="lock"
    />
  </div>
</template>

<script>
import { Component, Watch, Vue } from 'vue-property-decorator';

import { unlock as doUnlock } from '../utils';

@Component()
class Unlock extends Vue {
  visibilityListener = null;
  _isLocked = false;

  mounted() {
    this.init();
  }

  destroyed() {
    this.unsubscribeToLock();
  }

  get isAuthenticated() {
    return this.$store.getters.isAuthenticated;
  }

  get isLocked() {
    return this.$data._isLocked;
  }

  set isLocked(value) {
    this.$data._isLocked = value;
    this.$emit('lock', value);
  }

  init() {
    if (!this.isAuthenticated) {
      return;
    }

    this.unlock();
    this.subscribeToLock();
  }

  @Watch('isAuthenticated')
  onIsAuthenticated(isAuthenticated) {
    if (isAuthenticated) {
      this.subscribeToLock();
    } else {
      this.unsubscribeToLock();
    }
  }

  async unlock() {
    this.isLocked = true;
    await doUnlock()
      .then(() => {
        this.isLocked = false;
      })
      .catch(() => {
        // Lock operation canceled
      });
  }

  async onVisibilityChange() {
    const { visibilityState } = document;
    if (visibilityState === this.previousVisibility) {
      // Visibility didn't change, abort.
      return;
    }

    if (visibilityState === 'hidden') {
      this.isLocked = true;
    } else {
      await this.unlock();
    }

    this.previousVisibility = visibilityState;
  }

  subscribeToLock() {
    this.unsubscribeToLock();
    document.addEventListener('visibilitychange', this.onVisibilityChange);
  }

  unsubscribeToLock() {
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
  }
}

export default Unlock;
</script>

<style lang="scss" scoped>
@import '../constants';
.wrapper {
  background-color: $cryptoMktColor;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
