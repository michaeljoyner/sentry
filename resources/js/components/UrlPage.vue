<template>
  <div>
    <div class="m-4 p-4 shadow flex justify-between">
      <div>
        <p class="mb-1 text-xs text-green font-bold">Page</p>
        <p v-show="url.url">{{ url.url }}</p>
      </div>
      <div>
        <button @click="showDeleteForm = true">
          <svg
            class="text-red"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <path
              class="current-fill"
              d="M8 6V4c0-1.1.9-2 2-2h4a2 2 0 0 1 2 2v2h5a1 1 0 0 1 0 2h-1v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8H3a1 1 0 1 1 0-2h5zM6 8v12h12V8H6zm8-2V4h-4v2h4zm-4 4a1 1 0 0 1 1 1v6a1 1 0 0 1-2 0v-6a1 1 0 0 1 1-1zm4 0a1 1 0 0 1 1 1v6a1 1 0 0 1-2 0v-6a1 1 0 0 1 1-1z"
            ></path>
          </svg>
        </button>
        <modal :show="showDeleteForm" @close="showDeleteForm = false" class="rounded">
          <div class="max-w-sm mx-auto p-4 border-t-4 border-red rounded">
            <delete-url-form
              :urlId="url.id"
              @cancel="showDeleteForm = false"
              @url-deleted="navigateHome"
            ></delete-url-form>
          </div>
        </modal>
      </div>
    </div>
    <div class="m-4 p-4 shadow">
      <div class="flex justify-between">
        <div class>
          <p class="text-xs text-green-light font-bold mb-1">Success</p>
          <p class="text-xl font-black text-green">{{ summary_pass }}</p>
        </div>
        <div class>
          <p class="text-xs text-red-light font-bold mb-1">Fail</p>
          <p class="text-xl font-black text-red">{{ summary_fail }}</p>
        </div>
        <div class>
          <p class="text-xs text-blue-light font-bold mb-1">Score</p>
          <p class="text-xl font-black text-blue">{{ summary_percent }}%</p>
        </div>
      </div>
    </div>
    <div class="m-4 p-4 shadow">
      <p class="mb-1 text-xs text-green font-bold">Recent checks</p>
      <div class="flex flex-wrap">
        <div
          class="check rounded-full w-4 h-4 m-2"
          :class="{'bg-green': checkIsOkay(check), 'bg-red': !checkIsOkay(check)}"
          v-for="check in checks"
          :key="check.created_at"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Modal from "@dymantic/modal";
import DeleteUrlForm from "./DeleteUrlForm.vue";
export default {
  components: {
    Modal,
    DeleteUrlForm
  },
  data() {
    return {
      url: { url: false },
      showDeleteForm: false
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
      if (this.has_summary && this.summary_pass + this.summary_fail !== 0) {
        return (
          (this.summary_pass / (this.summary_pass + this.summary_fail)) *
          100
        ).toPrecision(3);
      }

      return 0;
    },

    checks() {
      if (this.url.recent_reports) {
        return this.url.recent_reports.sort(
          (a, b) => a.created_at - b.created_at
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
    },

    navigateHome() {
      console.log("hererere");
      this.$router.push("/url-list");
    }
  }
};
</script>
