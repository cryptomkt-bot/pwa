<template>
  <transition name="fade">
    <div id="confirmation-dialog" v-show="isVisible" class="modal is-active">
      <div class="modal-background"></div>
      <div class="modal-card">
        <section class="modal-card-body">{{ text }}</section>
        <footer class="modal-card-foot">
          <button class="button" @click="hide">NO</button>
          <button class="button is-primary" @click="submit">SI</button>
        </footer>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'ConfirmationDialog',
  computed: {
    isVisible () {
      return this.$store.state.isDialogVisible
    },
    text () {
      return this.$store.state.dialogText
    }
  },
  methods: {
    hide () {
      this.$store.commit('hideDialog')
    },
    submit () {
      this.$store.state.dialogCallback()
      this.hide()
    }
  }
}
</script>

<style scoped lang="scss">
  #confirmation-dialog {
    z-index: 41
  }
  .modal-card-body {
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    padding: 24px;
  }
  .modal-card-foot {
    justify-content: flex-end;
    .button {
      min-width: 80px;
      font-weight: bold;
    }
  }
</style>
