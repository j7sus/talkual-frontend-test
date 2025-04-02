<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});

import type { OrderListResponse } from "~/types";

const { find } = useStrapi();
const { data } = await find<OrderListResponse>("orders", {
  populate: ["order_items", "order_meta"],
  filters: {
    type: { $eq: "normal" },
  },
});
const orders = ref(data);
</script>

<template>
  <section class="p-3">
    <h1 class="text-center" style="font-family: 'Recoleta'; font-weight: 700">
      Order List
    </h1>
    <!-- Write rest of the code here -->
    <!-- Filtro por tipo -->
    <div class="row mb-4">
      <div class="col-md-4">
        <label for="typeFilter" class="form-label">Filter by Type:</label>
        <select
          style="background-color: var(--color-green-primary)"
          id="typeFilter"
          class="form-select"
          v-model="selectedType"
          @change="fetchOrders"
        >
          <option value="all">All</option>
          <option value="normal">Normal</option>
          <option value="donation">Donation</option>
        </select>
      </div>
    </div>
  </section>
</template>
