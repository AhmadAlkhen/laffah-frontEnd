<script setup>
import CartNavBar from "@/views/laffah/components/CartNavBar.vue";
import { useProductStore } from "@/views/laffah/products/useProductStore";
const ProductStore = useProductStore();

// Images
import avatar3 from "@images/avatars/avatar-3.png";
import avatar4 from "@images/avatars/avatar-4.png";
import avatar5 from "@images/avatars/avatar-5.png";
import paypal from "@images/svg/paypal.svg";

const notifications = [
  {
    img: avatar4,
    title: "Congratulation Flora! 🎉",
  },
  {
    text: "Tom Holland",
    title: "New user registered.",
  },
  {
    img: avatar5,
    title: "New message received 👋🏻",
  },
  {
    img: paypal,
    title: "Paypal",
    subtitle: "Received Payment",
  },
  {
    img: avatar3,
    title: "Received Order 📦",
  },
];

const myCart = ref([]);

const cartDataComputed = computed(() => {
  //   const cartData = ref([]);
  //   cartData.value = JSON.parse(localStorage.getItem("cart"));
  //   return cartData.value;
  ProductStore.getItemLocalStarage;
  // quantityCount.value = ProductStore.fetchItemCart().length;
  return ProductStore.fetchItemCart();
});
</script>

<template>
  <CartNavBar :notifications="cartDataComputed" />
</template>
