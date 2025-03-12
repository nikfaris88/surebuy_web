<template>
  <div>
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import Chart from "chart.js/auto";

const props = defineProps<{
  labels: string[];
  datasets: { label: string; data: number[]; borderColor: string }[];
}>();

const chartCanvas = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;

const createChart = () => {
  if (chartCanvas.value) {
    chartInstance = new Chart(chartCanvas.value, {
      type: "line",
      data: {
        labels: props.labels,
        datasets: props.datasets.map((ds) => ({
          ...ds,
          borderWidth: 2,
          fill: false,
        })),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }
};

onMounted(createChart);

// Watch for prop changes to update the chart dynamically
watch(() => [props.labels, props.datasets], () => {
  if (chartInstance) {
    chartInstance.destroy();
    createChart();
  }
}, { deep: true });
</script>

<style scoped>
div {
  height: 300px;
}
</style>
