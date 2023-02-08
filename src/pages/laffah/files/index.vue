<template>
  <div>
    <table>
      <thead>
        <tr>
          <th>File Name</th>
          <th>URL</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="file in files" :key="file.name">
          <td>{{ file.name }}</td>
          <td>{{ file.url }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      files: [],
    };
  },
  created() {
    axios.get("/files").then((response) => {
      this.files = response.data.files;
    });
  },
};
</script>
