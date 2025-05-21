<template>
  <v-row>
    <v-col cols="12" sm="6" md="4">
      <v-text-field
        v-model="localSearchQuery"
        label="Пошук за назвою"
        clearable
      />
    </v-col>

    <v-col cols="12" sm="6" md="4">
      <v-select
        v-model="localCategory"
        :items="[defaultCategory, ...categories]"
        label="Категорія"
        clearable
      />
    </v-col>

    <v-col cols="12" sm="6" md="4">
      <v-range-slider
        v-model.lazy="localPriceRange"
        :min="minPrice"
        :max="maxPrice"
        label="Ціна"
        hide-details
      />
      <div>Від {{ localPriceRange[0] }} до {{ localPriceRange[1] }} грн</div>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "ProductFilters",
  props: {
    value: { type: Object, required: true },
    categories: { type: Array, required: true },
    minPrice: { type: Number, required: true },
    maxPrice: { type: Number, required: true },
    defaultCategory: { type: String, required: true },
  },
  data() {
    return {
      localSearchQuery: this.value.searchQuery,
      localCategory: this.value.category,
      localPriceRange: [this.value.priceFrom, this.value.priceTo],
    };
  },
  watch: {
    localCategory(val) {
      if (val !== this.value.category) this.emitFilters();
    },
    localPriceRange(val) {
      if (val[0] !== this.value.priceFrom || val[1] !== this.value.priceTo) {
        this.emitFilters();
      }
    },
    localSearchQuery(val) {
      if (val !== this.value.localSearchQuery) {
        this.emitFilters();
      }
    },
    value: {
      handler(newVal) {
        this.localCategory = newVal.category;
        this.localPriceRange = [newVal.priceFrom, newVal.priceTo];
        this.localSearchQuery = newVal.searchQuery;
      },
      deep: true,
    },
  },
  methods: {
    emitFilters() {
      this.$emit("input", {
        category: this.localCategory,
        priceFrom: this.localPriceRange[0],
        priceTo: this.localPriceRange[1],
        searchQuery: this.localSearchQuery,
      });
    },
  },
});
</script>
