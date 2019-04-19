<template>
  <div>
    <div @click="toggleVisibility" class="section-name has-text-centered">
      <span>{{ title }}</span>
      <b-icon
        :icon="isVisible ? 'minus' : 'plus'"
        :size="'is-size-7'"
        :custom-size="'mdi-18px'"
      ></b-icon>
    </div>
    <!-- Default (v-if) -->
    <slot v-if="isVisible"></slot>
    <span v-show="isVisible">
      <!-- Alternative (v-show) -->
      <slot name="show"></slot>
    </span>
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';

@Component({
  props: ['title'],
})
class Section extends Vue {
  isVisible = false;

  toggleVisibility() {
    this.isVisible = !this.isVisible;
  }
}

export default Section;
</script>

<style scoped lang="scss">
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
