<template>
  <vue-dropzone ref="myVueDropzone" id="dropzone" :options="dropzoneOptions" />
</template>
<script>
import { useToast } from "vue-toastification";
const toast = useToast();
import vueDropzone from "vue2-dropzone-vue3";

export default {
  components: {
    vueDropzone,
  },
  data() {
    return {
      dropzoneOptions: {
        url: "https://api.safacati.com/api/product/import/images",
        thumbnailWidth: 150,
        maxFilesize: 4,
        acceptedFiles: "image/*",
        headers: { "My-Awesome-Header": "header value" },
        success: (file, response) => {
          // access the response message from the server here
          toast.success(response.message, {
            timeout: 500,
          });
        },
        // error: (file, error) => {
        //   // access the error message here
        //   console.error(error);
        //   // toast.warning(error?.message, {
        //   //   timeout: 2000,
        //   // });
        // },
      },
    };
  },
};
</script>
