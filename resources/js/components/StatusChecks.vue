<template>
  <div>
    <div class="p-4 m-4 shadow flex justify-between">
      <div>
        <p class="text-green text-sm font-bold">Last checked</p>
        <p class="text-grey-darkest">{{ last_checked_at }}</p>
      </div>
      <div class="flex flex-col items-end">
        <p class="text-green text-sm font-bold">No. of Pages</p>
        <span
          class="text-4xl text-grey-darkest font-black text-right"
        >{{ this.stats.grand_totals.urls }}</span>
      </div>
    </div>

    <div class="flex flex-col md:flex-row p-4 my-8 mx-4 shadow">
      <div class="w-full md:w-1/3 mb-6 md:mb-0">
        <p class="text-green text-sm font-bold">Success Rate</p>
        <p class="text-green text-3xl font-black">{{ success_percent }}%</p>
      </div>
      <div class="w-full md:w-1/3 mb-6 md:mb-0">
        <p class="text-green text-sm font-bold">Passed</p>
        <p class="text-green text-3xl font-black">{{ this.stats.grand_totals.successes }}</p>
      </div>
      <div class="w-full md:w-1/3 mb-6 md:mb-0">
        <p class="text-green text-sm font-bold">Failed</p>
        <p class="text-green text-3xl font-black">{{ this.stats.grand_totals.failures }}</p>
      </div>
    </div>

    <div v-for="failure in stats.recent_failures" :key="failure.id" class="p-4 m-4">
      <p class="text-red text-sm font-bold">Failed: {{ formattedDate(failure.created_at) }}</p>
      <p class="text-grey-darkest whitespace-wrap">{{ failure.page_name }}</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";

export default {
  data() {
    return {
      stats: {
        grand_totals: {
          urls: 0,
          successes: 0,
          failures: 0
        },
        recent_failures: [],
        last_checked: null
      }
    };
  },

  computed: {
    last_checked_at() {
      if (!this.stats.last_checked) {
        return "";
      }

      return moment(this.stats.last_checked).fromNow();
    },

    success_percent() {
      const passed = this.stats.grand_totals.successes;
      const total =
        this.stats.grand_totals.successes + this.stats.grand_totals.failures;

      return Math.round((passed / total) * 100);
    }
  },

  mounted() {
    this.fetchStats();
  },

  methods: {
    fetchStats() {
      axios
        .get("/status-reports")
        .then(({ data }) => (this.stats = data))
        .catch(err => console.log(err));
    },

    formattedDate(timestamp) {
      return moment.unix(timestamp).format("DD MMM YYYY, h:mm a");
    }
  }
};
</script>

<style scoped lang="css" type="text/css">
</style>


