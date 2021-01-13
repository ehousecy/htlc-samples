<template>
  <v-card
    color="grey lighten-4"
    flat
  >
    <v-toolbar color="grey" dark>
      <v-toolbar-side-icon>
      <v-icon>menu</v-icon>
      </v-toolbar-side-icon>
      <v-menu :nudge-width="100">
        <template v-slot:activator="{ on }">
          <v-toolbar-title v-on="on">
            <span>账户/证书</span>
            <v-icon dark>arrow_drop_down</v-icon>
          </v-toolbar-title>
        </template>

        <v-list>
          <v-list-tile
            v-for="item in items"
            :key="item"
          >
            <v-list-tile-title>{{ item }}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>search</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>favorite</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>more_vert</v-icon>
      </v-btn>
    </v-toolbar>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    items: [
      '导入以太账号', 'Fabric 证书私钥'
    ]
  })
}
</script>
