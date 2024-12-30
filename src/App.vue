<template>
  <div class="app-container">
    <AppHeader />
    <router-view></router-view>
 
    <AppFooter />
  </div>
</template>

<script setup>
import AppHeader from './components/Header.vue'
import AppFooter from './components/Footer.vue'
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
}
#app {
  height: 100vh;
}
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
