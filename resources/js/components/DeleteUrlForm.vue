<template>
  <div class>
    <form action @submit.prevent="deleteUrl">
      <p>Are you sure you would like to stop monitoring this URL?</p>
      <div class="mt-8 flex justify-end p-4">
        <button
          class="shadow px-4 py-2 mx-4 rounded bg-grey-light"
          type="button"
          @click="cancel"
        >Cancel</button>
        <button class="shadow px-4 py-2 mx-4 rounded bg-red text-white" type="submit">Do it!</button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: ["urlId"],
  methods: {
    cancel() {
      this.$emit("cancel");
    },

    deleteUrl() {
      axios
        .delete(`/urls/${this.urlId}`, {
          headers: {
            "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')
              .content
          }
        })
        .then(() => this.$emit("url-deleted"))
        .catch(err => console.log(err));
    }
  }
};
</script>

