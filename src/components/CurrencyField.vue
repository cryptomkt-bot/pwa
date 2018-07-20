<template>
  <div class="field has-addons">
    <div class="control" v-if="showMaxButton && !currency.prefix">
      <button class="button is-info" @click="setMaxAmount" :disabled="disabled">Max</button>
    </div>
    <div class="control" v-else-if="currency.prefix">
      <span class="button is-static" :disabled="disabled">{{ currency.prefix }}</span>
    </div>
    <div class="control">
      <input :id="id" class="input" :value="value" type="number" min="0" ref="input"
             :step="currency.step" @input="emitValue"
             :placeholder="placeholder" :disabled="disabled">
    </div>
    <div class="control" v-if="currency.postfix">
      <span class="button is-static" :disabled="disabled">{{ currency.postfix }}</span>
    </div>
    <div class="control" v-else-if="showMaxButton">
      <button class="button is-info" @click="setMaxAmount" :disabled="disabled">Max</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CurrencyField',
  props: [ 'id', 'currency', 'value', 'showMaxButton', 'placeholder', 'disabled' ],
  methods: {
    emitValue () {
      const value = Number(this.$refs.input.value)
      this.$emit('input', value)
    },
    setMaxAmount () {
      this.$emit('maxButtonClicked')
    }
  }
}
</script>

<style scoped>

</style>
