<script setup>
import { useTemplateEditStore } from "@/views/laffah/products/useTemplateEditStore";
import axios from "axios";
import { useToast } from "vue-toastification";
import Swal from "sweetalert2";
const router = useRouter();
import moment from "moment";

const toast = useToast();
const TemplateStore = useTemplateEditStore();
const quantity = ref([]);
const quantityCount = ref();
const itemsCart = ref([]);
const itemsCartSearch = ref([]);

const btnDis = ref(false);
const overlay = ref(false);
const btnSaveComplete = ref(false);
const orderDate = ref();
const isInputEnabled = ref(false);
const searchQuery = ref("");
const templateName = ref("");
const description = ref("");
const templateInfo = ref({});
const template = ref({});

onMounted(() => {
  templateInfo.value = localStorage.getItem("templateInfo")
    ? JSON.parse(localStorage.getItem("templateInfo"))
    : {};

  if (JSON.stringify(templateInfo.value) !== "{}") {
    // quantityCount.value = templateInfo.value.products.length;
    // itemsCart.value = templateInfo.value.products;
    // itemsCartSearch.value = templateInfo.value.products;
    // template.value = templateInfo.value.template;
    TemplateStore.getItemLocalStarage;
    TemplateStore.getTemplateLocalStarage;
    quantityCount.value = TemplateStore.fetchItemCart().length;
    itemsCart.value = TemplateStore.fetchItemCart();
    template.value = TemplateStore.fetchTemplate();
    itemsCartSearch.value = TemplateStore.fetchItemCart();
    console.log(itemsCart.value);
    console.log(template.value);
  } else {
    console.log("empty");
  }
  // TemplateStore.getItemLocalStarage;
  // quantityCount.value = TemplateStore.fetchItemCart().length;
  // itemsCart.value = TemplateStore.fetchItemCart();
  // itemsCartSearch.value = TemplateStore.fetchItemCart();
});

const Delete = (cardId) => {
  if (confirm("Do you really want to remove this item?")) {
    TemplateStore.deleteItem(cardId);
    quantityCount.value = TemplateStore.fetchItemCart().length;
    itemsCart.value = TemplateStore.fetchItemCart();
    toast.success("Product deleted successfully", {
      timeout: 2000,
    });
  }
};

const storeQuantity = (item, quantity) => {
  // console.log(quantity.value[index]);
  TemplateStore.changeQuantity(item, quantity);
};

const saveOrderCart = () => {
  if (isDisabled()) {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to save the template?!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, confirm!",
    }).then((result) => {
      if (result.isConfirmed) {
        overlay.value = true;
        let newArraydata = [];
        const myCart = JSON.parse(localStorage.getItem("template"));
        myCart.forEach((element, index) => {
          newArraydata.push({
            product_id: element.id,
            quantity: element.quantity,
          });
        });

        const formData = new FormData();
        formData.append("name", templateName.value);
        formData.append("productsCount", newArraydata.length);
        if (description) {
          formData.append("description", description.value);
        }
        formData.append("products", JSON.stringify(newArraydata));

        axios
          .post("/template/store", formData)
          .then((response) => {
            // console.log(response.status);
            if (response.status == 200 || response.status == true) {
              overlay.value = false;

              TemplateStore.resetCart();
              Swal.fire(
                "Added!",
                "Your template has been added successfully.",
                "success"
              );
            }
          })
          .then(() => {
            // router.replace({ name: "laffah-orders-templates" });
          })
          .catch((err) => {
            console.log(err);
            toast.warning(err.response?.data?.message || err.message, {
              timeout: 2000,
            });
            overlay.value = false;
          });
      }
    });
  } else {
    toast.warning("Please fill in all fields", {
      timeout: 2000,
    });
  }
};

const resetCart = () => {
  if (confirm("Do you really want to reset the template?")) {
    TemplateStore.resetCart();
    quantityCount.value = TemplateStore.fetchItemCart().length;
    itemsCart.value = TemplateStore.fetchItemCart();
    toast.success("Products deleted successfully", {
      timeout: 2000,
    });
  }
};

const isDisabled = () => {
  const myCart = JSON.parse(localStorage.getItem("template"));

  for (let i = 0; i < myCart.length; i++) {
    if (
      myCart[i] === undefined ||
      myCart[i] <= 0 ||
      myCart[i].quantity <= 0 ||
      templateName.vale
    ) {
      btnSaveComplete.value = false;
      break;
    } else {
      btnSaveComplete.value = true;
    }
  }
  return btnSaveComplete.value;
};

// watch the Search
watchEffect(() => {
  if (searchQuery.value) {
    const searchResult = itemsCart.value.filter(
      (item) =>
        item.name.toLowerCase().indexOf(searchQuery.value.toLowerCase()) !== -1
    );
    itemsCartSearch.value = searchResult;
  } else {
    itemsCartSearch.value = itemsCart.value;
  }
});
</script>

<template>
  <VCard>
    <VOverlay v-model="overlay" class="align-center justify-center" persistent>
      <VProgressCircular
        color="primary"
        indeterminate
        size="64"
      ></VProgressCircular>
    </VOverlay>
    <div v-if="itemsCart.length > 0">
      <VCard class="my-4 py-5 px-2">
        <VRow class="pt-2">
          <VCol class="" md="6">
            {{ template.value }}
            <VTextField
              v-model="template.name"
              persistent-placeholder
              placeholder="template Name"
              class=""
            />
          </VCol>
        </VRow>
      </VCard>
      <VCard class="my-4 py-5 px-2">
        <VRow class="pt-2">
          <VCol class="" md="6">
            <VTextField
              v-model="searchQuery"
              prepend-inner-icon="tabler-search"
              label="Search"
              placeholder="Search"
            />
          </VCol>
        </VRow>
      </VCard>
      <VTable class="text-no-wrap">
        <!-- 👉 table head -->
        <thead>
          <tr>
            <th scope="col">Product</th>
            <th scope="col">Unit</th>
            <th scope="col">Quantity</th>
            <th scope="col">ACTIONS</th>
          </tr>
        </thead>
        <!-- 👉 table body -->
        <tbody>
          <tr
            v-for="cart in itemsCartSearch"
            :key="cart.id"
            style="height: 3.75rem"
          >
            <!-- 👉  -->
            <td v-viewer>
              <!-- <img
                height="90"
                width="90"
                :src="cart.image"
                class="ml-2 rounded mt-2"
              /> -->
              <div class="d-flex align-center">
                <VAvatar
                  variant="tonal"
                  color="primary"
                  class="me-3"
                  size="38"
                  v-viewer
                >
                  <VImg v-if="cart.image" :src="cart.image" />
                  <span v-else>{{ avatarText(cart.name) }}</span>
                </VAvatar>

                <div class="d-flex flex-column">
                  <h6 class="text-base">
                    <h3 class="font-weight-medium user-list-name">
                      {{ cart.name }}
                    </h3>
                  </h6>
                  <span class="text-sm text-disabled">{{ cart.sku }}</span>
                </div>
              </div>
            </td>

            <!-- 👉  -->
            <td>
              <span class="text-capitalize text-base">{{ cart.unit }}</span>
            </td>

            <!-- 👉  -->
            <td>
              <VTextField
                v-model="cart.quantity"
                label="Quantity"
                type="number"
                :min="1"
                @input="storeQuantity(cart, cart.quantity)"
              />
            </td>

            <!-- 👉  -->
            <td>
              <VBtn
                @click="Delete(cart.id)"
                icon
                size="x-small"
                color="default"
                variant="text"
              >
                <VIcon size="22" icon="tabler-trash" />
              </VBtn>
            </td>
          </tr>
        </tbody>

        <!-- 👉 table footer  -->
        <tfoot v-show="!itemsCart.length">
          <tr>
            <td colspan="7" class="text-center">No data available</td>
          </tr>
        </tfoot>
      </VTable>

      <VContainer class="">
        <VRow class="d-flex flex-row-reverse my-3">
          <div>
            <VBtn color="primary" @click="saveOrderCart()"> Save </VBtn>
            <VBtn color="error" @click="resetCart()" class="mx-2"> Reset </VBtn>
          </div>
        </VRow>
      </VContainer>
    </div>

    <div v-else>
      <!-- <v-alert border="right" colored-border type="error" elevation="2">
        there are no products in the cart.
      </v-alert> -->
      <VAlert border="start" border-color="error">
        there are no products in the template.
      </VAlert>
    </div>
  </VCard>
</template>

<style scoped>
.cart {
  padding: 1rem;
  align-items: center;
}
</style>
