<template>
  <v-container>
    <h1 class="my-4">Каталог товарів</h1>

    <v-alert type="error" v-if="error">{{ error }}</v-alert>

    <ProductFilters
      :value="filters"
      :categories="categories"
      :defaultCategory="defaultCategory"
      :min-price="minPrice"
      :max-price="maxPrice"
      @input="onFiltersChange"
    />

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
import ProductFilters from "@/components/ProductFilters.vue";
import { Good } from "../types/Good";
import { debounce } from "@/helpers/utils";

export default Vue.extend({
  name: "HomeView",
  components: { ProductCard, ProductFilters },
  data() {
    return {
      defaultCategory: "--Default--",
      filters: {
        category: "",
        priceFrom: 0,
        priceTo: 0,
        searchQuery: "",
      },
    };
  },
  computed: {
    ...mapState({
      goods: (state: any): Good[] => state.goods,
      loading: (state: any): boolean => state.loading,
      error: (state: any): string => state.error,
    }),
    categories(): string[] {
      return [...new Set(this.goods.map((g) => g.category))];
    },
    minPrice(): number {
      return this.goods.length
        ? Math.min(...this.goods.map((g) => g.price))
        : 0;
    },
    maxPrice(): number {
      return this.goods.length
        ? Math.max(...this.goods.map((g) => g.price))
        : 100;
    },
    filteredGoods(): Good[] {
      return this.goods.filter((g) => {
        const matchesCategory =
          !this.filters.category ||
          g.category === this.filters.category ||
          this.filters.category === this.defaultCategory;
        const matchesPrice =
          (!this.filters.priceFrom || g.price >= this.filters.priceFrom) &&
          (!this.filters.priceTo || g.price <= this.filters.priceTo);

        const matchesSearch = this.filters.searchQuery
          ? g.name
              .toLowerCase()
              .includes(this.filters.searchQuery.toLowerCase())
          : true;
        return matchesCategory && matchesPrice && matchesSearch;
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
    onFiltersChange(newFilters: any) {
      this.filters = { ...newFilters };
      this.debounceUpdate();
    },
    updateRouteQuery() {
      const newQuery: any = {
        ...(this.filters.category && { category: this.filters.category }),
        ...(this.filters.priceFrom !== null &&
          !Number.isNaN(this.filters.priceFrom) && {
            priceFrom: this.filters.priceFrom,
          }),
        ...(this.filters.priceTo !== null &&
          !Number.isNaN(this.filters.priceTo) && {
            priceTo: this.filters.priceTo,
          }),
        ...(this.filters.searchQuery !== null &&
          this.filters.searchQuery.length && {
            searchQuery: this.filters.searchQuery,
          }),
      };

      const currentQuery = this.$route.query;
      const isSame =
        currentQuery.category === newQuery.category &&
        Number(currentQuery.priceFrom) === newQuery.priceFrom &&
        Number(currentQuery.priceTo) === newQuery.priceTo &&
        currentQuery.searchQuery === newQuery.searchQuery;

      if (!isSame) {
        this.$router.replace({ query: newQuery });
      }
    },
    debounceUpdate: debounce(function (this: any) {
      this.updateRouteQuery();
    }, 300),
  },
  created() {
    this.fetchGoods().then(() => {
      if (
        this.$route.query.category &&
        typeof this.$route.query.category === "string"
      ) {
        this.filters.category = this.$route.query.category;
      }
      if (
        this.$route.query.searchQuery &&
        typeof this.$route.query.searchQuery === "string"
      ) {
        this.filters.searchQuery = this.$route.query.searchQuery;
      }
      this.filters.priceFrom = this.$route.query.priceFrom
        ? Number(this.$route.query.priceFrom)
        : this.minPrice;
      this.filters.priceTo = this.$route.query.priceTo
        ? Number(this.$route.query.priceTo)
        : this.maxPrice;
    });
  },
});
</script>
