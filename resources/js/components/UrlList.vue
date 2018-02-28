<template>
  <div>
      <p class="p-3 text-sm text-grey">Reporting on {{ reporting_total }} urls, with {{ stood_down_total }} stood down.</p>
      <div class="p-3">
          <div v-for="url in urls" :key="url.id" class="my-2 py-2 border-b border-grey-light">
            <router-link :to="`/pages/${url.id}`" class="no-underline">
              <div class="inline-block h-2 w-2 mr-2 rounded-full" :class="{'bg-green': url.should_report, 'bg-red': !url.should_report}"></div><span class="text-sm text-black">{{ url.url }}</span>
            </router-link>
          </div>
      </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      urls: [],
      new_url: "",
      show_form: false
    };
  },

  computed: {
    reporting_total() {
      return this.urls.filter(url => url.should_report).length;
    },

    stood_down_total() {
      return this.urls.filter(url => !url.should_report).length;
    }
  },

  mounted() {
    this.fetchUrls();
  },

  methods: {
    fetchUrls() {
      axios
        .get("/urls")
        .then(({ data }) => (this.urls = data))
        .catch(err => console.log(err));
    },

    addUrl() {
      axios
        .post("/urls", { url: this.new_url })
        .then(this.onAddSuccess)
        .catch(err => console.log(err));
    },

    onAddSuccess() {
      this.fetchUrls();
      this.show_form = false;
      this.new_url = "";
    }
  }
};
</script>

<style scoped lang="css" type="text/css">
.form-container {
  height: 400px;
  transition: 0.4s;
  transform: translate3d(0, 400px, 0);
}

.form-container.show {
  transform: translate3d(0, 0, 0);
}
</style>
