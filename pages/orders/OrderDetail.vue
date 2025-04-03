<script setup lang="ts">
import { defineProps } from "vue";
import type { Order } from "~/types"; // Importa el tipo Order

const props = defineProps<{
  order: Order;
}>();

const getTypeBadgeClass = (type: string) => {
  switch (type) {
    case "normal":
      return "bg-primary";
    case "donation":
      return "bg-success";
    default:
      return "bg-secondary";
  }
};
</script>

<template>
  <div class="cardOrder p-1">
    <div>
      <div class="mb-1">
        <strong>sku: </strong>
        <div class="text-uppercase">
        {{
          props.order.attributes.order_items?.data[0]?.attributes?.sku || "N/A"
        }}
        </div>
      </div>

      <div class="mb-1">
        <strong>type: </strong>
        <span>
          {{ props.order.attributes.type }}
        </span>
      </div>

      <div class="mb-1">
        <strong>quantity: </strong>
        {{
          props.order.attributes.order_items?.data[0]?.attributes?.quantity || 0
        }}
      </div>

      <div class="mb-1">
        <strong>firstname: </strong>
        {{
          props.order.attributes.order_meta?.data?.attributes
            ?.shipping_firstname || "N/A"
        }}
      </div>
    </div>
  </div>
</template>
