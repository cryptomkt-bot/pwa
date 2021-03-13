<template>
  <div class="position-relative">
    <b-loading
      :active="isLoading"
      :is-full-page="false"
      ref="loader"
    ></b-loading>
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';

@Component({
  props: ['isLoading', 'threshold'],
})
class InfiniteLoader extends Vue {
  mounted() {
    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        this.$emit('intersect');
      },
      {
        threshold: this.threshold ?? 1,
      }
    );

    this.observer.observe(this.$el);
  }

  destroyed() {
    this.observer.disconnect();
  }
}

export default InfiniteLoader;
</script>
