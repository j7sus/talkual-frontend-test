<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});

import type { OrderListResponse, Order } from "~/types";
import OrderDetail from "~/pages/orders/OrderDetail.vue";

const { find } = useStrapi();

const { data } = await find<OrderListResponse>("orders", {
  populate: ["order_items", "order_meta"],
  filters: {
    type: {},
  },
});

const selectedType = ref<string>("");
const loading = ref<boolean>(false); //  Define 'loading' ref
const orders = ref<OrderListResponse>({ data: [] });
const currentPage = ref<number>(1);
const totalPages = ref<number>(0);
const pageSize = 10;

const fetchOrders = async (page: number = 1, type: string = "all") => {
  loading.value = true; // Set loading to true before fetching
  currentPage.value = page;
  try {
    const filters: Record<string, any> = {};
    if (type !== "all") {
      filters.type = { eq: type };
    }

    const response = await find<OrderListResponse>("orders", {
      populate: ["order_items", "order_meta"],
      filters: filters,
      pagination: {
        page: page,
        pageSize: pageSize,
      },
    });
    orders.value = response;
    totalPages.value = response.meta?.pagination?.totalPages || 0;
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    orders.value = { data: [] };
    totalPages.value = 0;
  } finally {
    loading.value = false; // Set loading to false after fetching
  }
};

fetchOrders();

const handleDonate = (order: Order) => {
  console.log("Donate to order:", order);
};

const changePage = (page: number) => {
  fetchOrders(page, selectedType.value);
};
</script>

<template>
  <section class="p-3">
    <h1 class="text-center">Order List</h1>
    <!-- Write rest of the code here -->

    <div class="card" style="background-color: var(--color-beige-primary)">
      <div class="card-header">
        <!-- Filters -->
        <div class="col-md-2">
        <label for="typeFilter" class="form-label">Filters:</label>
          <select
            max-width="100px"
            style="background-color: var(--color-green-primary)"
            id="typeFilter"
            class="form-select"
            v-model="selectedType"
            @change="fetchOrders"
          >
            <option value="" disabled>Select type</option>
            <option value="all">All</option>
            <option value="normal">Normal</option>
            <option value="donation">Donation</option>
          </select>
        </div>
      </div>

      <div class="col-6 offset-3">
        <!--   Listado de Pedidos  -->

        <div class="card-body">
          <div>
            <!-- Estado de Carga -->
            <div v-if="loading" class="text-center">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>

            <div v-else class="cardOrder list-group">
              <div
                v-for="order in orders.data"
                :key="order.id"
                class="list-group-item mb-3"
              >
                <OrderDetail :order="order" />
                <button
                  class="btn btn-primary mt-3"
                  @click="handleDonate(order)"
                >
                  Donate
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
