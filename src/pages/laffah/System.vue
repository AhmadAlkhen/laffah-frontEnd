<script setup>
import { themeConfig } from "@themeConfig";
import { VNodeRenderer } from "@layouts/components/VNodeRenderer";

import hr from "@images/system/hr-1.webp";
import OMS from "@images/system/OMS-1.webp";
import pms from "@images/system/pms.webp";
import pdo from "@images/system/pdo.webp";
import cover from "@images/system/cover.png";
</script>

<template>
  <VRow class="align-items-lg-center">
    <VCol cols="12" md="6" lg="6">
      <div class="text-center">
        <VNodeRenderer :nodes="themeConfig.app.logo" class="" />
      </div>

      <h2 class="text-cover">Welcome to Safaqatii System</h2>
      <ul class="system-ul">
        <li>Order Management System</li>
        <li>HR System</li>
        <li>PRO System</li>
      </ul>
      <!-- <h6 class="text-part">Orders Management System</h6>
      <h6 class="text-part">HR System</h6>
      <h6 class="text-part">PDO System</h6> -->
    </VCol>
    <VCol cols="12" md="6" lg="6">
      <img :src="cover" class="imageCover" width="500" />
    </VCol>
  </VRow>

  <VContainer class="mt-5">
    <h2 class="text-moudle">Select a module :</h2>
    <VRow class="mb-5 div-moudle">
      <VCol cols="12" md="6" lg="6">
        <RouterLink class="d" :to="{ name: 'dashboard' }">
          <div class="card-div">
            <img :src="OMS" class="rounded-2" width="500" />
          </div>
        </RouterLink>
      </VCol>
      <VCol cols="12" md="6" lg="6">
        <RouterLink class="d" :to="{ name: 'pages-misc-coming-soon' }">
          <div class="card-div">
            <img :src="hr" class="rounded-t-l rounded-2" width="500" />
          </div>
        </RouterLink>
      </VCol>
      <VCol cols="12" md="6" lg="6">
        <RouterLink class="d" :to="{ name: 'pages-misc-coming-soon' }">
          <div class="card-div">
            <img :src="pdo" class="rounded-t-r rounded-2" width="500" />
          </div>
        </RouterLink>
      </VCol>
      <VCol cols="12" md="6" lg="6">
        <RouterLink class="d" :to="{ name: 'pages-misc-coming-soon' }">
          <div class="card-div">
            <img :src="pms" class="rounded-t-l rounded-2" width="500" />
          </div>
        </RouterLink>
      </VCol>
    </VRow>
  </VContainer>
</template>
<route lang="yaml">
meta:
  layout: blank
  action: read
  subject: Auth
</route>
<style scoped>
.text-cover {
  font-weight: 600;
  font-size: 2.7rem;
  text-align: center;
  color: #fff;
  margin-bottom: 2rem;
}
.text-part {
  font-weight: 600;
  font-size: 1.7rem;
  color: #fff;
  margin-left: 4rem;
}
.system-ul li::before {
  content: "✓ ";
}
.system-ul li {
  font-weight: 600;
  font-size: 1.7rem;
  color: #fff;
  margin-left: 6rem;
}
.text-moudle {
  font-weight: 600;
  font-size: 2.1rem;
  text-align: center;
  color: #2c3e50;
  margin-bottom: 2rem;
}
.align-items-lg-center {
  align-items: center;
  background-color: #2c3e50;
  padding-top: 3rem;
  border-bottom-left-radius: 75px;
  min-height: 800px;
}

.card-img {
  border-top-right-radius: 45px;
  border-top-left-radius: 45px;
}
.rounded-t-r {
  border-top-right-radius: 2rem;
}
.rounded-t-l {
  border-top-left-radius: 2rem;
}
.rounded-2 {
  border-radius: 2.2rem;
}

.card-div:hover {
  cursor: pointer;
  transform: translateY(-2%);
  transition: 0.4s ease-out;
  transition-property: all;
  transition-property: opacity, transform, filter;
}

@media only screen and (max-width: 600px) {
  .align-items-lg-center {
    align-items: center;
    background-color: #2c3e50;
    padding-top: 3rem;
    border-bottom-left-radius: 75px;
    min-height: 50px;
    padding-bottom: 2rem;
  }

  .imageCover {
    display: none;
  }
  .text-cover {
    font-weight: 600;
    font-size: 2.1rem;
    text-align: center;
    color: #fff;
    margin-bottom: 2rem;
  }
  .div-moudle img {
    width: 325px;
  }
  .system-ul li {
    font-weight: 600;
    font-size: 1.2rem;
    color: #fff;
    margin-left: 1rem;
  }
}
</style>
