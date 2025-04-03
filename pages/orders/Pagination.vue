<script setup lang="ts">
import { defineProps, defineEmits, computed } from "vue";

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["page-change"]);

const emitPageChange = (page: number) => {
  emit("page-change", page);
};

const hasPreviousPage = computed(() => props.currentPage > 1);
const hasNextPage = computed(() => props.currentPage < props.totalPages);
</script>

<template>
  <nav v-if="props.totalPages > 1" aria-label="Page navigation">
    <ul class="pagination justify-content-center">
      <li class="page-item" :class="{ disabled: !hasPreviousPage }">
        <button
          class="page-link"
          @click="emitPageChange(props.currentPage - 1)"
          aria-label="Previous"
        >
          <span aria-hidden="true">&laquo;</span>
          <span class="visually-hidden">Previous</span>
        </button>
      </li>
      <li
        v-for="page in props.totalPages"
        :key="page"
        class="page-item"
        :class="{ active: props.currentPage === page }"
      >
        <button class="page-link" @click="emitPageChange(page)">
          {{ page }}
        </button>
      </li>
      <li class="page-item" :class="{ disabled: !hasNextPage }">
        <button
          class="page-link"
          @click="emitPageChange(props.currentPage + 1)"
          aria-label="Next"
        >
          <span aria-hidden="true">&raquo;</span>
          <span class="visually-hidden">Next</span>
        </button>
      </li>
    </ul>
  </nav>
</template>
