<script setup lang="ts">
import { useLanguage } from '@/composables/useLanguage'

// header / footer 已下放到各年份版本自行決定外觀，
// 這裡只負責在啟動時把偵測到的語系套上去
useLanguage()
</script>

<template>
  <router-view />
</template>
