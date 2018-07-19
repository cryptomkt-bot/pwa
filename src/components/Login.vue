<template>
  <div>
    <h1 class="title has-text-weight-light has-text-centered is-marginless">CryptoMKT Bot</h1>
    <div class="section">
      <div class="card">
        <form class="card-content" @submit.prevent="login">
          <div class="field">
            <label for="apiAddress" class="label">Dirección de API</label>
            <div class="control">
              <input id="apiAddress" class="input" type="text" required
                     v-model="apiAddress" placeholder="Ingrese la dirección de la API">
            </div>
          </div>
          <div class="field">
            <label for="username" class="label">Nombre de usuario</label>
            <div class="control">
              <input id="username" class="input" type="text" autocapitalize="off" required
                     v-model="username" placeholder="Ingrese su nombre de usuario">
            </div>
          </div>
          <div class="field">
            <label for="password" class="label">Contraseña</label>
            <div class="control">
              <input id="password" class="input" type="password" required
                     v-model="password" placeholder="Ingrese su contraseña">
            </div>
          </div>
          <div class="field">
            <div class="control">
              <button class="button is-primary is-fullwidth"
                      :disabled="!this.username || !this.password">Iniciar sesión</button>
            </div>
          </div>
        </form>
      </div>
    </div>
    <span class="copyright is-size-7">
      Built with <i class="fa fa-heart"></i> by <a target="_blank" href="https://github.com/tanoabeleyra">tanoabeleyra</a>
    </span>
  </div>
</template>

<script>
import ApiService from '../services/ApiService'

export default {
  name: 'Login',
  dependencies: ['storageService'],
  data () {
    return {
      apiAddress: null,
      username: '',
      password: ''
    }
  },
  created () {
    this.restoreFromStorage()
  },
  methods: {
    login () {
      const api = new ApiService(this.apiAddress)
      api.login(this.username, this.password).then(() => {
        this.$emit('loggedIn')
      }).catch(() => {
        alert('Usuario o contraseña incorrecta.')
      })
    },
    restoreFromStorage () {
      this.apiAddress = this.storageService.get('apiAddress')
      this.username = this.storageService.get('username')
    }
  }
}
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
