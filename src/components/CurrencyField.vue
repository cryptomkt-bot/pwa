<template>
  <div class="field has-addons">
    <div v-if="showMaxButton && !currency.prefix" class="control">
      <button
        @click="setMaxAmount"
        :disabled="disabled || isMaxLoading"
        :class="{ 'is-loading': isMaxLoading }"
        class="button is-info"
      >
        {{ $t('max') }}
      </button>
    </div>
    <div v-else-if="currency.prefix" class="control">
      <span :disabled="disabled" class="button is-static">
        {{ currency.prefix }}
      </span>
    </div>
    <div class="control">
      <input
        type="number"
        :id="id"
        ref="input"
        :value="value"
        min="0"
        :step="step"
        :placeholder="placeholder"
        :disabled="disabled"
        @input="emitValue"
        lang="en"
        class="input"
      />
    </div>
    <div v-if="currency.postfix" class="control">
      <span :disabled="disabled" class="button is-static">
        {{ currency.postfix }}
      </span>
    </div>
    <div v-else-if="showMaxButton" class="control">
      <button
        @click="setMaxAmount"
        :disabled="disabled || isMaxLoading"
        :class="{ 'is-loading': isMaxLoading }"
        class="button is-info"
      >
        {{ $t('max') }}
      </button>
    </div>
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';

@Component({
  props: [
    'id',
    'currency',
    'step',
    'value',
    'showMaxButton',
    'placeholder',
    'disabled',
    'isMaxLoading',
  ],
})
class CurrencyField extends Vue {
  emitValue() {
    const value = Number(this.$refs.input.value);
    this.$emit('input', value);
  }

  setMaxAmount() {
    this.$emit('maxButtonClicked');
  }
}

export default CurrencyField;
</script>
