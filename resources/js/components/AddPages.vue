<template>
  <div>
      <form @submit.prevent="fetchLinks" class="w-full p-4">
           <p class="my-3">What is the main url of the site you'd like to monitor?</p>
           <div class="flex justify-between">
                <input class="flex-auto border-l border-t border-b border-grey pl-2 text-xs" type="text" v-model="base_url">
                <button class="p-3 border border-grey font-black" type="submit">Get Links</button>
           </div>
          
      </form>
      <div>
          <div class="my-2 p-2 flex items-center border-b border-grey" v-for="(url, index) in urls" :key="url">
              <input :id="`url_${index}`" type="checkbox" class="inline-block w-8" v-model="selected_urls" :value="url">
              <label class="flex-auto" :for="`url_${index}`">{{ url }}</label>
          </div>
      </div>
      <div class="p-4" v-show="selected_urls.length">
        <button class="w-full bg-green text-white py-3 uppercase font-black rounded shadow" @click="addUrls">Add Pages</button>
      </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      urls: [],
      base_url: "",
      selected_urls: []
    };
  },

  methods: {
    fetchLinks() {
      axios
        .get(`/page-links?url=${encodeURIComponent(this.base_url)}`)
        .then(({ data }) => (this.urls = data))
        .catch(err => console.log(err));
    },

    addUrls() {
      axios
        .post(
          "/urls",
          { url: this.selected_urls },
          {
            headers: {
              "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')
                .content
            }
          }
        )
        .then(() => this.$router.push("/url-list"))
        .catch(err => console.log(err));
    }
  }
};
</script>

