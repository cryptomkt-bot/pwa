<template>
  <div>
    <h1 class="title has-text-weight-light has-text-centered is-marginless">CryptoMKT Bot</h1>
    <div class="section">
      <div class="card">
        <form @submit.prevent="login" class="card-content">
          <div class="field">
            <label for="apiAddress" class="label">Dirección de API</label>
            <div class="control">
              <input id="apiAddress" type="text" required
                     v-model="apiAddress" @click="hideSignature" @blur="showSignature"
                     placeholder="Ingrese la dirección de la API" class="input">
            </div>
          </div>
          <div class="field">
            <label for="username" class="label">Usuario</label>
            <div class="control">
              <input id="username" type="text" autocapitalize="off" required
                     v-model="username" @click="hideSignature" @blur="showSignature"
                     placeholder="Ingrese su nombre de usuario" class="input">
            </div>
          </div>
          <div class="field">
            <label for="password" class="label">Contraseña</label>
            <div class="control">
              <input id="password" type="password" required
                     v-model="password" @click="hideSignature" @blur="showSignature"
                     placeholder="Ingrese su contraseña" class="input">
            </div>
          </div>
          <div class="field">
            <div class="control">
              <button :disabled="!this.username || !this.password"
                      class="button is-primary is-fullwidth">Iniciar sesión</button>
            </div>
          </div>
        </form>
      </div>
    </div>
    <span v-show="isSignatureVisible" class="copyright is-size-7">
      Built with <i class="fa fa-heart"></i> by <a target="_blank" href="https://github.com/tanoabeleyra">tanoabeleyra</a>
    </span>
  </div>
</template>

<script>
import ApiService from '../services/ApiService';
import StorageHelper from '../helpers/StorageHelper';

export default {
  name: 'Login',
  data() {
    return {
      apiAddress: null,
      username: '',
      password: '',
      isSignatureVisible: true,
    };
  },
  created() {
    this.restoreFromStorage();
  },
  methods: {
    login() {
      const api = new ApiService(this.apiAddress);
      api.login(this.username, this.password)
        .then(() => {
          this.$emit('loggedIn');
          this.$store.commit('hideToast');
        })
        .catch((error) => {
          let toastText;
          if (error.response && error.response.status === 401) {
            toastText = 'Usuario o contraseña incorrecta.';
          }
          this.$store.dispatch('showErrorToast', toastText);
        });
    },
    restoreFromStorage() {
      this.apiAddress = StorageHelper.get('apiAddress');
      this.username = StorageHelper.get('username');
    },
    hideSignature() {
      this.isSignatureVisible = false;
    },
    showSignature() {
      this.isSignatureVisible = true;
    },
  },
};
</script>

<style scoped>
  .card { background-color: #fbfbfb }
  .copyright {
    position: absolute;
    bottom: 12px;
    right: 12px;
  }
  .fa-heart { color: #ee0000 }
</style>
