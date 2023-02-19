<script setup>
import { VForm } from "vuetify/components";
import { useAppAbility } from "@/plugins/casl/useAppAbility";
// import AuthProvider from "@/views/pages/authentication/AuthProvider.vue";
import axios from "axios";
import { useGenerateImageVariant } from "@core/composable/useGenerateImageVariant";
import { VNodeRenderer } from "@layouts/components/VNodeRenderer";
import { themeConfig } from "@themeConfig";
import { emailValidator, requiredValidator } from "@validators";
import authV2LoginIllustrationBorderedDark from "@images/pages/auth-v2-login-illustration-bordered-dark.png";
import authV2LoginIllustrationBorderedLight from "@images/pages/auth-v2-login-illustration-bordered-light.png";
import authV2LoginIllustrationDark from "@images/pages/auth-v2-login-illustration-dark.png";
import authV2LoginIllustrationLight from "@images/pages/auth-v2-login-illustration-light.png";
import authV2MaskDark from "@images/pages/misc-mask-dark.png";
import authV2MaskLight from "@images/pages/misc-mask-light.png";

// import { useUserStore } from "@/views/laffah/auth/useUserStore";
// import { useAuthStore } from "@/store/auth";
import { useAuthStore } from "@/views/laffah/auth/useAuthStore";

const authThemeImg = useGenerateImageVariant(
  authV2LoginIllustrationLight,
  authV2LoginIllustrationDark,
  authV2LoginIllustrationBorderedLight,
  authV2LoginIllustrationBorderedDark,
  true
);
const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark);
const isPasswordVisible = ref(false);
const route = useRoute();
const router = useRouter();
const ability = useAppAbility();

// const userStore = useUserStore();
const authStore = useAuthStore();

const errors = ref({
  email: undefined,
  password: undefined,
});

const refVForm = ref();
const email = ref("admin@laffah.com");
const password = ref("Laffah@123");
const rememberMe = ref(false);
const userAbilities = ref([
  {
    action: "manage",
    subject: "all",
  },
]);

// const logIn = () => {
//   const formData = new FormData();
//   formData.append("email", email.value);
//   formData.append("password", password.value);
//   userStore
//     .login(formData)
//     .then(() => {
//       router.replace(route.query.to ? String(route.query.to) : "/");
//     })
//     .catch((err) => {
//       errorLogin.value = err.response?.data?.message || err.message;
//     });
// };

const errorLogin = ref();
// const loginCSRF = async () => {
//   await axios.get("http://localhost:8000/sanctum/csrf-cookie");
// };

const onSubmit = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    // if (isValid) login();
    if (isValid) {
      const formData = new FormData();
      formData.append("email", email.value);
      formData.append("password", password.value);
      axios
        .post("auth/login", formData)
        .then((res) => {
          if (res.status) {
            // console.log(res);
            localStorage.setItem("userData", JSON.stringify(res.data.userData));
            var userRole = res.data.userData.role.split('"').join("");
            localStorage.setItem("userRole", userRole);
            localStorage.setItem("accessToken", res.data.accessToken);
            localStorage.setItem(
              "userAbilities",
              JSON.stringify(userAbilities.value)
            );
            // userStore.setUserRole(userRole);
            // router.replace("/");
            const role = res.data.userData.role.split('"').join("");
            const accessToken = res.data.accessToken;

            // authStore.updateData(role, accessToken);
            authStore.$patch({
              userRole: role,
              accessToken: accessToken,
            });
            // add the token for the API
            axios.defaults.headers.common["Authorization"] = accessToken
              ? `Bearer ${accessToken}`
              : "";

            router.replace(route.query.to ? String(route.query.to) : "/");
            //   .then(() => {
            //     // location.reload();
            //   });
          }
        })
        .catch((err) => {
          errorLogin.value = err.response?.data?.message || err.message;
          // console.log(err.response.data.message);
        });
    }
  });
};
</script>

<template>
  <VRow no-gutters class="auth-wrapper">
    <VCol lg="8" class="d-none d-lg-flex">
      <div class="position-relative auth-bg rounded-lg w-100 ma-8 me-0">
        <div class="d-flex align-center justify-center w-100 h-100">
          <VImg
            max-width="505"
            :src="authThemeImg"
            class="auth-illustration mt-16 mb-2"
          />
        </div>

        <VImg :src="authThemeMask" class="auth-footer-mask" />
      </div>
    </VCol>
    <VCol cols="12" lg="4" class="d-flex align-center justify-center">
      <VCard flat :max-width="500" class="mt-12 mt-sm-0 pa-4">
        <VCardText>
          <VNodeRenderer :nodes="themeConfig.app.logo" class="mb-6" />

          <h5 class="text-h5 font-weight-semibold mb-1">
            Welcome to {{ themeConfig.app.title }}! 👋🏻
          </h5>
          <p class="mb-0">
            Please sign-in to your account and start the adventure
          </p>
        </VCardText>
        <!-- <VCardText>
          <VAlert
            color="primary"
            variant="tonal"
          >
            <p class="text-caption mb-2">
              Admin Email: <strong>admin@demo.com</strong> / Pass: <strong>admin</strong>
            </p>
            <p class="text-caption mb-0">
              Client Email: <strong>client@demo.com</strong> / Pass: <strong>client</strong>
            </p>
          </VAlert>
        </VCardText> -->
        <VCardText>
          <VForm ref="refVForm" @submit.prevent="onSubmit">
            <VRow>
              <!-- email -->
              <VCol cols="12">
                <VTextField
                  v-model="email"
                  label="Email"
                  type="email"
                  :rules="[requiredValidator, emailValidator]"
                  :error-messages="errors.email"
                />
              </VCol>

              <!-- password -->
              <VCol cols="12">
                <VTextField
                  v-model="password"
                  label="Password"
                  :rules="[requiredValidator]"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :error-messages="errors.password"
                  :append-inner-icon="
                    isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'
                  "
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />

                <div
                  class="d-flex align-center flex-wrap justify-space-between mt-2 mb-4"
                >
                  <VCheckbox v-model="rememberMe" label="Remember me" />
                  <!-- <RouterLink
                    class="text-primary ms-2 mb-1"
                    :to="{ name: 'forgot-password' }"
                  >
                    Forgot Password?
                  </RouterLink> -->
                </div>

                <VBtn block type="submit"> Login </VBtn>
              </VCol>

              <VAlert border="start" border-color="error" v-if="errorLogin">
                {{ errorLogin }}
              </VAlert>
              <!-- create account -->
              <!-- <VCol cols="12" class="text-center">
                <span>New on our platform?</span>
                <RouterLink
                  class="text-primary ms-2"
                  :to="{ name: 'register' }"
                >
                  Create an account
                </RouterLink>
              </VCol>
              <VCol cols="12" class="d-flex align-center">
                <VDivider />
                <span class="mx-4">or</span>
                <VDivider />
              </VCol> -->

              <!-- auth providers -->
              <!-- <VCol cols="12" class="text-center">
                <AuthProvider />
              </VCol> -->
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>

<route lang="yaml">
meta:
  layout: blank
  action: read
  subject: Auth
  redirectIfLoggedIn: true
</route>
