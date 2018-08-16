<template>
  <div>
    <div @click="isVisible = !isVisible" class="section-name has-text-centered">
      <span>{{ title }}</span>
      <b-icon pack="fa" :icon="isVisible ? 'minus' : 'plus'" :size="'is-size-7'"></b-icon>
    </div>
    <slot v-if="isVisible"></slot> <!-- Default (v-if) -->
    <span v-show="isVisible">
      <slot name="show"></slot> <!-- Alternative (v-show) -->
    </span>
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';

@Component({
  props: ['title'],
})
export default class Section extends Vue {
  isVisible = false;
}
</script>

<style lang="scss">
  .section-name {
    border-bottom: 1px solid #e0e0e0;
    background-color: #eee;
    padding: 8px;
    .icon {
      position: absolute;
      right: 16px;
    }
  }
</style>
