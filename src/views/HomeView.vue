<template>
  <v-container>
    <h1 class="my-4">Каталог товарів</h1>

    <v-alert type="error" v-if="error">{{ error }}</v-alert>

    <!-- Фільтри -->
    <v-row>
      <v-col cols="12" sm="6" md="4">
        <v-select
          v-model="selectedCategory"
          :items="[defaultCategory, ...categories]"
          label="Категорія"
          clearable
        />
      </v-col>

      <v-col cols="12" sm="6" md="4">
        <v-range-slider
          v-model.lazy="priceRange"
          :min="minPrice"
          :max="maxPrice"
          label="Ціна"
          hide-details
        />
        <div>Від {{ priceRange[0] }} до {{ priceRange[1] }} грн</div>
      </v-col>
    </v-row>

    <!-- Список товарів -->
    <v-progress-circular v-if="loading" indeterminate color="primary" />
    <v-row>
      <v-col
        v-for="good in filteredGoods"
        :key="good.id"
        cols="12"
        sm="6"
        md="4"
      >
        <ProductCard :good="good" @click.native="goToDetails(good.id)" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState, mapActions } from "vuex";
import ProductCard from "@/components/ProductCard.vue";
import { Good } from "../types/Good";
import { debounce } from "@/helpers/utils";

export default Vue.extend({
  name: "HomeView",
  components: { ProductCard },
  data() {
    return {
      defaultCategory: "--Default--",
      selectedCategory: this.$route.query.category || "",
      priceFrom: this.$route.query.priceFrom
        ? Number(this.$route.query.priceFrom)
        : 0,
      priceTo: this.$route.query.priceTo
        ? Number(this.$route.query.priceTo)
        : 300,
    };
  },
  computed: {
    ...mapState({
      goods: (state: any): Good[] => state.goods,
      loading: (state: any): boolean => state.loading,
      error: (state: any): string => state.error,
    }),
    categories(): string[] {
      const all: string[] = this.goods.map((good) => good.category);
      return [...new Set(all)];
    },
    minPrice(): number {
      return this.goods.length
        ? Math.min(...this.goods.map((g: Good) => g.price))
        : 0;
    },
    maxPrice(): number {
      return this.goods.length
        ? Math.max(...this.goods.map((g: Good) => g.price))
        : 300;
    },

    priceRange: {
      get(): [number, number] {
        return [this.priceFrom ?? this.minPrice, this.priceTo ?? this.maxPrice];
      },
      set(val: [number, number]) {
        this.priceFrom = val[0];
        this.priceTo = val[1];
      },
    },

    filteredGoods(): Good[] {
      return this.goods.filter((g: Good) => {
        const matchesCategory =
          this.selectedCategory === this.defaultCategory ||
          !this.selectedCategory ||
          g.category === this.selectedCategory;

        const matchesPrice =
          (!this.priceFrom || g.price >= this.priceFrom) &&
          (!this.priceTo || g.price <= this.priceTo);

        return matchesCategory && matchesPrice;
      });
    },
  },
  methods: {
    ...mapActions(["fetchGoods"]),
    goToDetails(id: number) {
      this.$router.push({
        name: "ProductDetails",
        params: { id: id.toString() },
      });
    },
    updateRouteQuery() {
      const query: any = {
        ...(this.selectedCategory && { category: this.selectedCategory }),
        ...(this.priceFrom !== null &&
          !Number.isNaN(this.priceFrom) && { priceFrom: this.priceFrom }),
        ...(this.priceTo !== null &&
          !Number.isNaN(this.priceTo) && {
            priceTo: this.priceTo,
          }),
      };
      if (Object.keys(query).length === 0) {
        return;
      }

      console.log(query);

      this.$router.replace({ query });
    },
    debounceUpdate: debounce(function (this: any) {
      this.updateRouteQuery();
    }, 300),
  },
  watch: {
    selectedCategory: "debounceUpdate",
    priceFrom: "debounceUpdate",
    priceTo: "debounceUpdate",
  },
  created() {
    this.fetchGoods();
  },
  mounted() {
    this.priceFrom = this.$route.query.priceFrom
      ? Number(this.$route.query.priceFrom)
      : this.minPrice;
    this.priceTo = this.$route.query.priceTo
      ? Number(this.$route.query.priceTo)
      : this.maxPrice;
  },
});
</script>

<style scoped>
.v-container {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
