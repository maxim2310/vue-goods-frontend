<template>
  <v-container>
    <v-btn icon @click="$router.back()">
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>

    <v-row v-if="good">
      <v-col cols="12" md="6">
        <v-img :src="good.imageUrl" height="400px" />
      </v-col>

      <v-col cols="12" md="6">
        <h2>{{ good.name }}</h2>
        <v-list dense>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Price</v-list-item-title>
              <v-list-item-subtitle
                >${{ good.price.toFixed(2) }}</v-list-item-subtitle
              >
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Category</v-list-item-title>
              <v-list-item-subtitle>{{ good.category }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Dimensions</v-list-item-title>
              <v-list-item-subtitle
                >{{ good.length }} × {{ good.width }} cm</v-list-item-subtitle
              >
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Description</v-list-item-title>
              <v-list-item-subtitle>{{
                good.description
              }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col cols="12">
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Good } from "../types/Good";
import { mapState, mapActions } from "vuex";

export default Vue.extend({
  name: "ProductDetails",
  props: ["id"],
  data() {
    return {
      good: null as Good | null,
    };
  },
  computed: {
    ...mapState(["goods", "loading", "error"]),
  },
  methods: {
    ...mapActions(["fetchGoods"]),
  },
  async created() {
    if (this.goods.length === 0) {
      await this.fetchGoods();
    }
    try {
      this.good = this.goods.find((good: Good) => good.id === Number(this.id));
    } catch (error) {
      console.error(error);
    }
  },
});
</script>

<style scoped>
img {
  max-width: 300px;
}
</style>
