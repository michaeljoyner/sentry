<template>
  <div>
    <div class="m-4 p-4 shadow">
      <p class="mb-1 text-xs text-green font-bold">Page</p>
      <p v-show="url.url">{{ url.url }}</p>
    </div>
      <div class="m-4 p-4 shadow">
      <div class="flex justify-between">
        <div class="">
          <p class="text-xs text-green-light font-bold mb-1">Success</p>
          <p class="text-xl font-black text-green">{{ summary_pass }}</p>
        </div>
        <div class="">
          <p class="text-xs text-red-light font-bold mb-1">Fail</p>
          <p class="text-xl font-black text-red">{{ summary_fail }}</p>
        </div>
        <div class="">
          <p class="text-xs text-blue-light font-bold mb-1">Score</p>
          <p class="text-xl font-black text-blue">{{ summary_percent }}%</p>
        </div>
      </div>
    </div>
    <div class="m-4 p-4 shadow">
      <p class="mb-1 text-xs text-green font-bold">Recent checks</p>
      <div class="flex flex-wrap">
          <div class="check rounded-full w-4 h-4 m-2" :class="{'bg-green': checkIsOkay(check), 'bg-red': !checkIsOkay(check)}" v-for="check in checks" :key="check.created_at">
          </div>
      </div>
    </div>  
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      url: { url: false }
    };
  },

  computed: {
    has_summary() {
      return !!this.url.report_summary;
    },

    summary_pass() {
      if (this.has_summary) {
        return this.url.report_summary.successes;
      }
      return 0;
    },

    summary_fail() {
      if (this.has_summary) {
        return this.url.report_summary.failures;
      }
      return 0;
    },

    summary_percent() {
      if (this.has_summary && this.summary_pass * this.summary_fail !== 0) {
        return this.summary_pass / (this.summary_pass + this.summary_fail);
      }
      return 0;
    },

    checks() {
      if (this.url.recent_reports) {
        return this.url.recent_reports.sort(
          (a, b) => b.created_at - a.created_at
        );
      }
      return [];
    }
  },

  mounted() {
    axios
      .get(`/urls/${this.$route.params.id}`)
      .then(({ data }) => (this.url = data))
      .catch(err => console.log(err));
  },

  methods: {
    checkIsOkay(check) {
      return check.status / 100 < 4;
    }
  }
};
</script>
