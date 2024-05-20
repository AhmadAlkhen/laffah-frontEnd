span
<script setup>
import { VNodeRenderer } from "@layouts/components/VNodeRenderer";
import { themeConfig } from "@themeConfig";
import moment from "moment";
import Swal from "sweetalert2";
import { avatarText } from "@core/utils/formatters";

import { requiredValidator } from "@validators";
import { useToast } from "vue-toastification";
const toast = useToast();
// Components

import { useSupplierListStore } from "@/views/laffah/suppliers/useSupplierListStore";
const SupplierListStore = useSupplierListStore();

import axios from "axios";
import { name } from "vue-prism-component";
import { watch } from "@vue/runtime-core";

const route = useRoute();
const router = useRouter();

const suppliers = ref([]);
const selectedSupplier = ref();
const ordersDate = ref();

const overlay = ref(false);
const isDownloading = ref(false);
const message = ref(null);

const generateOrder = () => {
  overlay.value = true;
  isDownloading.value = true;

  const orders_Date = ordersDate.value;
  const supplier_id = selectedSupplier.value;
  let selectedSupplierTitle = "";

  // Iterate through the suppliers array to find the matching supplier
  suppliers.value.forEach((supplier) => {
    if (supplier.value === supplier_id) {
      selectedSupplierTitle = supplier.title;
    }
  });

  axios
    .get("/suppliers/generate/order", {
      params: { orders_Date, supplier_id },
      responseType: "blob",
    })
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      const fileName = `${selectedSupplierTitle}_${orders_Date}_Order.xlsx`;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
    })
    .catch((err) => {
      console.log(err);
      toast.warning(err.response?.data?.message || err.message, {
        timeout: 2000,
      });
    })
    .finally(() => {
      overlay.value = false;
      isDownloading.value = false;
    });
};

const convertCreated = (value) => {
  return moment(value).format("YYYY-MM-DD hh:mm");
};
const convertCreatedWithoutHour = (value) => {
  return moment(value).format("YYYY-MM-DD");
};

const userRole = computed(() => {
  let data = localStorage.getItem("userRole");
  return data;
});
const userName = computed(() => {
  let data = JSON.parse(localStorage.getItem("userData"));
  return data.name;
});

onMounted(() => {
  SupplierListStore.fetchSuppliers({
    perPage: 100,
    page: 1,
  })
    .then((response) => {
      suppliers.value = response.data.data.data;
      let suppliersAll = [];
      suppliers.value.forEach((element) => {
        suppliersAll.push({ title: element.name, value: element.id });
      });
      // console.log(suppliersAll);
      suppliers.value = suppliersAll;
    })
    .catch((error) => {
      console.error(error);
    });
});
</script>

<template>
  <section>
    <VOverlay v-model="overlay" class="align-center justify-center" persistent>
      <VProgressCircular
        color="primary"
        indeterminate
        size="64"
      ></VProgressCircular>
    </VOverlay>
    <VCard class="my-2 order-preview">
      <VCardText>
        <h3>Generate the daily report for the supplier:</h3>
      </VCardText>
      <VRow class="my-1 ml-1">
        <VCol lg="3" sm="6" cols="12">
          <VSelect
            v-model="selectedSupplier"
            label="Select Supplier"
            :items="suppliers"
            clearable
            clear-icon="tabler-x"
          />
        </VCol>
        <VCol lg="3" sm="6" cols="12" class="d-print-none">
          <AppDateTimePicker v-model="ordersDate" label="Select Orders Date" />
        </VCol>
        <VCol cols="12" md="2" class="d-print-none">
          <VBtn
            block
            prepend-icon="tabler-file-download"
            variant="tonal"
            color="primary"
            class="mb-2"
            @click="generateOrder"
            :disabled="!(ordersDate && selectedSupplier)"
          >
            {{ isDownloading ? "PLease Wait..." : "Generate " }}
          </VBtn>
        </VCol>
        <VCol cols="12" md="3" class="d-print-none" v-if="message">
          <p class="message mt-1">{{ message }}</p>
        </VCol>
      </VRow>
    </VCard>
  </section>
</template>

<style lang="scss">
@media print {
  .v-application {
    background: none !important;
  }

  @page {
    margin: 0;
    size: landscape;
  }
  table {
    width: 100%;
    overflow-x: visible !important;
  }

  .layout-page-content,
  .v-row,
  .v-col-md-9 {
    padding: 0;
    margin: 0;
  }

  .product-buy-now {
    display: none;
  }

  .v-navigation-drawer,
  .layout-vertical-nav,
  .app-customizer-toggler,
  .layout-footer,
  .layout-navbar,
  .layout-navbar-and-nav-container {
    display: none;
  }

  .v-card {
    box-shadow: none !important;

    .print-row {
      flex-direction: row !important;
    }
  }

  .layout-content-wrapper {
    padding-inline-start: 0 !important;
  }
}
</style>
<style>
/* .v-text-field {
  width: 175px;
} */

/* .v-rating__item .v-btn {
  width: 2rem;
} */
.v-rating__item .v-btn--icon.v-btn--density-default {
  width: calc(var(--v-btn-height) + 0px);
}
</style>
<style scoped>
.text-danger {
  color: red;
}

.border-bottom {
  border-bottom: solid 1px #e9e9eb;
}
.color-red {
  color: #d24552;
}
.color-blue {
  color: #698ed5;
}
</style>
