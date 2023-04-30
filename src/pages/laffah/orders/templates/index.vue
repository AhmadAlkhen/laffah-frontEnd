<script setup>
import { useUserStore } from "@/views/laffah/auth/useUserStore";
import { useOrderListStore } from "@/views/laffah/orders/useOrderListStore";
import { useProductOrderStore } from "@/views/laffah/orders/useProductOrderStore";
import { useTemplateStore } from "@/views/laffah/products/useTemplateStore";

import { avatarText } from "@core/utils/formatters";
import { computed } from "@vue/runtime-core";
import moment from "moment";
import Swal from "sweetalert2";
import axios from "axios";
import { useToast } from "vue-toastification";
const toast = useToast();

const route = useRoute();
const router = useRouter();

import { ref, onMounted } from "vue";

const userStore = useUserStore();
const orderListStore = useOrderListStore();
const productOrderStore = useProductOrderStore();
const TemplateStore = useTemplateStore();

// const authStore = auth();

let cart = computed(function () {
  console.log(authStore.state.userData);
});

const searchQuery = ref("");
const selectedRole = ref();
const selectedPlan = ref();
const selectedStatus = ref(route.query.status || null);
const selectedBranch = ref();
const rowPerPage = ref(10);
const currentPage = ref(1);
const totalPage = ref(1);
const totalTemplates = ref(0);
const templates = ref([]);
const branches = ref([]);
const isLoading = ref(false);

// 👉 Fetching orders
const fetchTemplates = () => {
  isLoading.value = true;
  TemplateStore.fetchTemplates({
    perPage: rowPerPage.value,
    page: currentPage.value,
  })
    .then((response) => {
      templates.value = response.data.data.data;
      totalPage.value = response.data.data.last_page;
      totalTemplates.value = response.data.data.total;
    })
    .catch((err) => {
      console.log(err);
      toast.warning(err.response?.data?.message || err.message, {
        timeout: 2000,
      });
    })
    .finally(() => {
      isLoading.value = false;
    });
};
const convertCreated = (value) => {
  return moment(value).format("YYYY-MM-DD");
};

const getUserRole = computed(() => {
  return userStore;
});

watchEffect(fetchTemplates);

// 👉 watching current page
watchEffect(() => {
  if (currentPage.value > totalPage.value) currentPage.value = totalPage.value;
});

// 👉 watching current page
watchEffect(() => {
  if (currentPage.value > totalPage.value) currentPage.value = totalPage.value;
});

// 👉 Computing pagination data
const paginationData = computed(() => {
  const firstIndex = templates.value.length
    ? (currentPage.value - 1) * rowPerPage.value + 1
    : 0;
  const lastIndex =
    templates.value.length + (currentPage.value - 1) * rowPerPage.value;

  return `Showing ${firstIndex} to ${lastIndex} of ${totalTemplates.value} entries`;
});

const userRole = computed(() => {
  let data = localStorage.getItem("userRole");
  return data;
});

const deleteTemplate = (template_id) => {
  Swal.fire({
    title: "Are you sure?",
    text: "Do you really want to delete this template?!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, confirm!",
  }).then((res) => {
    if (res.isConfirmed) {
      TemplateStore.deleteTemplate(template_id)
        .then((res) => {
          toast.success(res.data.message, {
            timeout: 2000,
          });
          fetchTemplates();
        })
        .catch((err) => {
          toast.warning(err.response?.data?.message || err.message, {
            timeout: 2000,
          });
        });
    }
  });
};
const editTemplate = (template_id) => {
  Swal.fire({
    title: "Are you sure?",
    text: "Do you really want to update this template?!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, confirm!",
  }).then((res) => {
    if (res.isConfirmed) {
      TemplateStore.updateTemplate(template_id);
      // .then((res) => {})
      // .catch((err) => {
      //   console.log(err);
      //   // router.push({ name: "laffah-orders-MyOrders" });
      // });
    }
  });
};
// onMounted(() => {
//   productOrderStore
//     .fetchBranches({
//       perPage: 50,
//       page: 1,
//     })
//     .then((response) => {
//       branches.value = response.data.data.data;
//       let branchesAll = [];
//       branches.value.forEach((element) => {
//         branchesAll.push({ title: element.name, value: element.id });
//       });
//       branches.value = branchesAll;
//     })
//     .catch((error) => {
//       console.error(error);
//     });
// });
</script>

<template>
  <section>
    <VRow>
      <VCol cols="12">
        <VCard title="Search Filter">
          <!-- 👉 Filters -->

          <!-- <VDivider /> -->
          <!-- <VCardText class="d-flex flex-wrap py-4 gap-4"> -->
          <VSpacer />
          <VRow class="py-2 px-2" cols="12">
            <VCol lg="2" sm="6" cols="12">
              <!-- <div class="me-3" style="width: 80px"> -->
              <VSelect
                v-model="rowPerPage"
                density="compact"
                variant="outlined"
                :items="[10, 20, 30, 50]"
              />
              <!-- </div> -->
            </VCol>

            <VCol lg="2" sm="6" cols="12"> </VCol>
          </VRow>

          <VDivider />

          <VTable class="text-no-wrap">
            <!-- 👉 table head -->
            <thead>
              <tr>
                <th scope="col">#ID</th>
                <th scope="col">Name</th>
                <th scope="col">Products Count</th>
                <th scope="col">Descripation</th>
                <th scope="col">ACTIONS</th>
              </tr>
            </thead>
            <!-- 👉 table body -->
            <tbody>
              <tr
                v-for="template in templates"
                :key="template.id"
                style="height: 3.75rem"
              >
                <!-- 👉 template ID -->
                <td>#{{ template.id }}</td>

                <!-- 👉 template name -->
                <td>
                  <span class="text-capitalize text-base">{{
                    template.name
                  }}</span>
                </td>

                <!-- 👉 products count -->
                <td>
                  <span class="text-capitalize text-base">{{
                    template.productsCount
                  }}</span>
                </td>

                <!-- 👉 Products description -->
                <td>
                  <span class="text-capitalize text-base">{{
                    template.description
                  }}</span>
                </td>

                <!-- 👉 Actions -->
                <td class="text-center" style="width: 5rem">
                  <VBtn
                    icon
                    variant="text"
                    color="default"
                    size="x-small"
                    :to="{
                      name: 'laffah-orders-templates-preview-id',
                      params: { id: template.id },
                    }"
                  >
                    <VIcon :size="22" icon="tabler-eye" />
                  </VBtn>
                  <VBtn
                    icon
                    variant="text"
                    color="default"
                    size="x-small"
                    @click="deleteTemplate(template.id)"
                  >
                    <VIcon :size="22" icon="tabler-trash" />
                  </VBtn>
                  <!-- <VBtn
                    icon
                    variant="text"
                    color="default"
                    size="x-small"
                    @click="editTemplate(template.id)"
                  >
                    <VIcon :size="22" icon="tabler-edit" />
                  </VBtn> -->
                </td>
              </tr>
            </tbody>

            <!-- 👉 table footer  -->
            <tfoot v-show="isLoading || templates.length === 0">
              <tr>
                <td colspan="7" class="text-center">
                  {{ isLoading ? "Loading..." : "No data available" }}
                </td>
              </tr>
            </tfoot>
          </VTable>

          <VDivider />

          <VCardText
            class="d-flex align-center flex-wrap justify-space-between gap-4 py-3 px-5"
          >
            <span class="text-sm text-disabled">
              {{ paginationData }}
            </span>

            <VPagination
              v-model="currentPage"
              size="small"
              :total-visible="5"
              :length="totalPage"
            />
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </section>
</template>

<style lang="scss">
.app-user-search-filter {
  inline-size: 31.6rem;
}

.text-capitalize {
  text-transform: capitalize;
}

.user-list-name:not(:hover) {
  color: rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity));
}
</style>
