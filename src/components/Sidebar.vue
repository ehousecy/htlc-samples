<template>
  <v-navigation-drawer
    class="teal"
    dark
    permanent
  >
    <v-toolbar flat class="transparent" color="grey">
      <v-list class="pa-0">
        <v-list-tile avatar>
          <v-list-tile-avatar>
            <img src="@/assets/eth.png">
          </v-list-tile-avatar>

          <v-list-tile-content>
            <v-list-tile-title>哈希时间锁定资产交换</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-toolbar>
    <br/>
    <v-list three-line>
      <v-list-tile
        v-for="item in items"
        :key="item.title"
        router :to="item.route"
      >

        <v-list-tile-action>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-tile-action>

        <v-list-tile-content>
          <v-list-tile-title>{{ item.title }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>

      <!-- 以太坊HTLC -->
      <v-list-group
        prepend-icon="lock"
        value="true"
      >
        <template v-slot:activator>
          <v-list-tile>
            <v-list-tile-title>ETH 哈希时间锁定操作</v-list-tile-title>
          </v-list-tile>
        </template>
        <v-list-group
          no-action
          sub-group
          value="true"
          v-for="item in EthHtlc"
          :key="item.function"
        >
          <template v-slot:activator>
            <v-list-tile
             router :to="item.route"
            >
              <v-icon left>{{ item.icon }}</v-icon>
              <v-list-tile-title> {{ item.function }}</v-list-tile-title>
            </v-list-tile>
          </template>
        </v-list-group>
      </v-list-group>

      <!-- Fabric HTLC -->
      <v-list-group
        prepend-icon="lock"
        value="true"
      >
        <template v-slot:activator>
          <v-list-tile>
            <v-list-tile-title>Fabric 哈希时间锁定操作</v-list-tile-title>
          </v-list-tile>
        </template>
        <v-list-group
          no-action
          sub-group
          value="true"
          v-for="item in FabricHtlc"
          :key="item.function"
        >
          <template v-slot:activator>
            <v-list-tile>
              <v-icon left>{{ item.icon }}</v-icon>
              <v-list-tile-title>{{ item.function }}</v-list-tile-title>
            </v-list-tile>
          </template>
        </v-list-group>
      </v-list-group>

    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  data () {
    return {
      items: [
        // { title: 'Eth哈希锁定操作', icon: 'dashboard', route: '/' },
        { title: '创建ETH账户', icon: 'account_box', route: '/apply' },
        { title: '创建Fabric账户', icon: 'account_box', route: '/apply' }
      ],
      EthHtlc: [
        { function: '创建哈希锁定', icon: 'create', route: '/' },
        { function: '提取哈希锁定资产', icon: 'lock_open', route: '/eth/withdraw' },
        { function: '退还哈希锁定资产', icon: 'assignment_return', route: '/eth/refund' }
      ],
      FabricHtlc: [
        { function: '创建哈希锁定', icon: 'create', route: '/' },
        { function: '提取哈希锁定资产', icon: 'lock_open', route: '/eth/withdraw' },
        { function: '退还哈希锁定资产', icon: 'assignment_return', route: '/eth/refund' }
      ]
    }
  }
}
</script>
