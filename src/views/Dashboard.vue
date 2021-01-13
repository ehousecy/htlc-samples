<template>
  <div class="dashboard">
    <Sidebar/>
    <div class="content">
      <Toolbar/>
      <router-view/>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import Sidebar from '@/components/Sidebar.vue'
import Toolbar from '@/components/Toolbar.vue'

export default Vue.extend({
  name: 'dashboard',
  components: {
    Sidebar,
    Toolbar
  }
})
</script>
<style scoped>
.dashboard {
    display: grid;
    grid-template-columns: 1fr 5fr;
    height: 100vh;
    width: 100vw;
}

.content {
    background-color: white;
    /* border-radius: 10px;
    margin: 30px 6px 6px 6px; */
}

</style>
