<template>
  <v-card class="mx-auto" max-width="344" outlined @click="$emit('click')">
    <v-img :src="good.imageUrl" height="200px" />
    <v-card-title>{{ good.name }}</v-card-title>
    <v-card-text>
      <div>Price: ${{ good.price.toFixed(2) }}</div>
      <div class="text--secondary">{{ good.category }}</div>
    </v-card-text>
    <v-card-actions>
      <v-btn text small color="primary">View Details</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { Good } from "../types/Good";

export default Vue.extend({
  name: "ProductCard",
  props: {
    good: {
      type: Object as () => Good,
      required: true,
    },
  },
});
</script>

<style scoped>
.good-card {
  cursor: pointer;
  border: 1px solid #ddd;
  padding: 8px;
  width: 180px;
  text-align: center;
  border-radius: 4px;
  transition: box-shadow 0.2s ease;
}
.good-card:hover {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}
.good-card img {
  max-width: 100%;
  height: auto;
}
</style>
