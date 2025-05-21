import { Good } from "@/types/Good";
import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export interface GoodState {
  goods: Good[];
  loading: boolean;
  error: string | null;
}

export default new Vuex.Store<GoodState>({
  state: {
    goods: [] as Good[],
    loading: false,
    error: null as string | null,
  },
  mutations: {
    setGoods(state, goods: Good[]) {
      state.goods = goods;
    },
    setLoading(state, value: boolean) {
      state.loading = value;
    },
    setError(state, message: string | null) {
      state.error = message;
    },
  },
  actions: {
    async fetchGoods({ commit }) {
      commit("setLoading", true);
      try {
        const response = await axios.get(
          "https://vue-goods-service.onrender.com/goods"
        );
        commit("setGoods", response.data);
        commit("setError", null);
      } catch (err) {
        commit("setError", "Failed to fetch goods");
      } finally {
        commit("setLoading", false);
      }
    },
  },
  getters: {
    allGoods(state): Good[] {
      return state.goods;
    },
  },
  modules: {},
});
