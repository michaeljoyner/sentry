<template>
  <div>
      <p class="p-3 text-sm text-grey">Reporting on {{ reporting_total }} urls, with {{ stood_down_total }} stood down.</p>
      <div class="p-3">
          <div v-for="url in urls" :key="url.id" class="my-2">
              <div class="inline-block h-2 w-2 mr-2 rounded-full" :class="{'bg-green': url.should_report, 'bg-red': !url.should_report}"></div><span class="text-xs">{{ url.url }}</span>
          </div>
      </div>
      <div class="fixed pin-b pin-r pin-l form-container" :class="{'show': show_form}">
        <div class="flex justify-end">
            <span @click="show_form = false" class="text-green mx-3 my-2">
                <svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    <path d="M0 0h24v24H0z" fill="none"/>
                </svg>
            </span>
        </div>
        <div>
            <form action="" @submit.prevent="addUrl" class="px-3">
                <p>Add a new url to be checked</p>
                <div class="flex justify-between w-full p-2">
                    <input type="text" v-model="new_url" class="flex-auto border-grey border-t border-l border-b">
                    <button type="submit" class="flex justify-center items-center w-8 h-8 border border-grey">
                        <svg class="text-grey" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                            <path d="M0 0h24v24H0z" fill="none"/>
                        </svg>            
                    </button>
                </div>
                
            </form>
        </div>
      </div>
        <div @click="show_form = true" class="fixed m-4 pin-b pin-r w-12 h-12 bg-green flex justify-center items-center rounded-full" v-show="!show_form">
            <svg class="text-white" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                <path d="M0 0h24v24H0z" fill="none"/>
            </svg>
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
