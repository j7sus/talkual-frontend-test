<script setup lang="ts">
import { ref } from "vue";
import type { OrderListResponse, Order } from "~/types";
import OrderDetail from "~/pages/orders/OrderDetail.vue";
import Pagination from "~/pages/orders/Pagination.vue";

definePageMeta({
  middleware: "auth",
});

const { find } = useStrapi();

const selectedType = ref<string>(""); // Inicializa como cadena vacía
const loading = ref<boolean>(false);
const orders = ref<OrderListResponse>({ data: [] });

const currentPage = ref<number>(1);
const totalPages = ref<number>(0);
const pageSize = 2;

const fetchOrders = async ({
  page = 1,
  type = "all",
}: { page?: number; type?: string } = {}) => {
  loading.value = true; // Set loading

  try {
    const filters: Record<string, any> = {};
    if (type === "normal") {
      filters.type = { $eq: "normal" };
    } else if (type === "donation") {
      filters.type = { $eq: "donation" };
    }

    const response = await find<OrderListResponse>("orders", {
      populate: ["order_items", "order_meta"],
      filters: type !== "all" ? filters : undefined,

      pagination: {
        page: page,
        pageSize: pageSize,
      },
    });

    orders.value = response;
    currentPage.value = page;
    totalPages.value = response.meta?.pagination?.totalPages || 0;
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    orders.value = { data: [] };
    totalPages.value = 0;
  } finally {
    loading.value = false; // Set loading después del fetch
  }
};

fetchOrders({ page: 1, type: "all" });

const handleDonate = (order: Order) => {
  console.log("Donate to order:", order);
};

const handlePageChange = (newPage: number) => {
  fetchOrders({ page: newPage, type: selectedType.value });
};
</script>

<template>
  <section class="p-3">
    <h1 class="text-center">Order List</h1>
    <!-- Write rest of the code here -->

    <div class="card" style="background-color: var(--color-beige-primary)">
      <div class="card-header filters">
        <!-- Filters -->
        <label for="typeFilter" class="form-label">Filters:</label>
        <div class="col-md-2">
          <select
            max-width="100px"
            style="background-color: var(--color-green-primary)"
            id="typeFilter"
            class="form-select"
            v-model="selectedType"
            @change="fetchOrders({ page: newPage, type: selectedType.value })"
          >
            <option value="" disabled>Select type</option>
            <option value="all">All</option>
            <option value="normal">Normal</option>
            <option value="donation">Donation</option>
          </select>
        </div>
      </div>

      <!--   Listado de Pedidos  -->
      <div class="col-12">
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

      <!--   Paginación  -->
      <Pagination
        :currentPage="currentPage"
        :totalPages="totalPages"
        @pageChange="handlePageChange"
      />
    </div>
  </section>
</template>
