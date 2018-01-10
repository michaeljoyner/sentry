<template>
  <div>
      <p class="p-2">Last checked: {{ last_checked_at }}</p>
      <div class="check-grid p-2 flex flex-wrap">
          <div class="check rounded-full w-4 h-4 m-2" :class="{'bg-green': checkIsOkay(check), 'bg-red': !checkIsOkay(check)}" v-for="check in checks" :key="check.id">
          </div>
      </div>
      <div class="fixed pin-b pin-r m-4 font-black text-green">
          <span class="text-4xl">{{ success_percent }}%</span>
      </div>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";

export default {
  data() {
    return {
      checks: []
    };
  },

  computed: {
    last_checked_at() {
      if (!this.checks.length) {
        return "";
      }
      const most_recent = this.checks.sort(
        (a, b) => b.created_at - a.created_at
      )[0];

      return moment(most_recent.created_at).fromNow();
    },

    success_percent() {
      const passed = this.checks.filter(check => this.checkIsOkay(check))
        .length;
      const total = this.checks.length;

      return Math.round(passed / total * 100);
    }
  },

  mounted() {
    this.fetchChecks();
  },

  methods: {
    fetchChecks() {
      axios
        .get("/status-reports")
        .then(({ data }) => (this.checks = data))
        .catch(err => console.log(err));
    },

    checkIsOkay(check) {
      return check.status / 100 < 4;
    }
  }
};
</script>

<style scoped lang="css" type="text/css">

</style>


