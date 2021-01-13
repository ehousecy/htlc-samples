<template>
    <div>
        <v-card
        class="mx-auto"
        max-width="500">
            <v-card-title class="teal">
                <span class="title font-weight-light">提取锁定的ETH</span>
                <v-icon right>create</v-icon>
            </v-card-title>
            <v-text-field
            label="哈希锁"
            required
            class="textfield"
            ></v-text-field>

            <v-text-field
            label="时间锁"
            required
            class="textfield"
            ></v-text-field>

            <v-text-field
            :counter="42"
            label="接收者"
            required
            class="textfield"
            ></v-text-field>

            <v-text-field
            :counter="18"
            label="数量（wei）"
            required
            class="textfield"
            ></v-text-field>

            <v-btn
            color="rgb(0,128,128)"
            class="mr-4"
            >
            锁定资产
            </v-btn>

            <v-btn
            color="rgb(0,128,128)"
            class="mr-4"
            >
            重置
            </v-btn>
        </v-card>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({

})
</script>
<style scoped>
.mx-auto {
    margin: 10px;
}
.textfield {
    margin: 10px 10px 10px 10px;
}
.mr-4 {
    margin: 20px 10px 10px 10px;
}
</style>
