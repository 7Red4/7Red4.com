<script setup lang="ts">
/**
 * 毛玻璃面板。開場擋板與之後的作品詳情 modal 共用同一種材質，
 * 整個 2027 版的浮層才會是一套語言。
 */
withDefaults(defineProps<{ radius?: number }>(), { radius: 20 })
</script>

<template>
  <div class="frosted" :style="{ borderRadius: `${radius}px` }">
    <slot />
  </div>
</template>

<style scoped>
.frosted {
  position: relative;
  background: rgb(253 250 244 / 0.62);
  backdrop-filter: blur(18px) saturate(115%);
  -webkit-backdrop-filter: blur(18px) saturate(115%);
  border: 1px solid rgb(255 255 255 / 0.55);
  box-shadow:
    0 18px 50px rgb(94 74 52 / 0.18),
    inset 0 1px 0 rgb(255 255 255 / 0.6);
  overflow: hidden;
}

/* 不支援 backdrop-filter 時退回較不透明的底色，才不會看不清內容 */
@supports not (backdrop-filter: blur(1px)) {
  .frosted {
    background: rgb(253 250 244 / 0.94);
  }
}
</style>
