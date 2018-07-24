<template>
  <transition name="slide">
    <div v-show="isVisible" id="toast"
         :class="[ isError ? 'has-background-danger' : 'has-background-info']">
      <p class="is-size-7">{{ text }}</p>
      <button v-show="isError" @click="hide" class="delete"></button>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Toast',
  computed: {
    isVisible() {
      return this.$store.state.isToastVisible;
    },
    text() {
      return this.$store.state.toastText;
    },
    isError() {
      return this.$store.state.toastIsError;
    },
  },
  methods: {
    hide() {
      this.$store.commit('hideToast');
    },
  },
  watch: {
    isVisible(newValue) {
      if (newValue && !this.isError) {
        setTimeout(this.hide, 2500);
      }
    },
  },
};
</script>

<style lang="scss">
  #toast {
    height: 50px;
    width: 100%;
    padding: 8px;
    color: #fff;
    display: flex;
    align-items: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
    position: fixed;
    top: 0;
    transition-property: top;
    z-index: 1;
    p { flex-grow: 1 }
  }
  .slide-enter-active { transition-duration: 500ms }
  .slide-leave-active { transition-duration: 250ms }
  .slide-enter, .slide-leave-to { top: -56px !important }
</style>
