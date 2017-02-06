<template>
  <div id="app">
    <router-link to="/0/">Go to Foo</router-link>
    <router-view :key="$route.path"></router-view>
  </div>
</template>


<script>
export default {
  name: 'app'
}
</script>
