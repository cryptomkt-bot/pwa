<template>
  <div>
    <h1 class="title has-text-centered is-marginless">Iniciar sesión</h1>
    <div class="section">
      <div class="card">
        <form class="card-content" @submit.prevent="login">
          <div class="field">
            <label for="ip" class="label">IP</label>
            <div class="control">
              <input id="ip" class="input" type="text" required
                     v-model="ip" placeholder="Ingrese la IP de la API">
            </div>
          </div>
          <div class="field">
            <label for="port" class="label">Puerto</label>
            <div class="control">
              <input id="port" class="input" type="number" required
                     v-model="port" placeholder="Ingrese el puerto">
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
  </div>
</template>

<script>
import ApiService from '../services/ApiService'

export default {
  name: 'Login',
  data () {
    return {
      ip: null,
      port: null,
      username: '',
      password: '',
      token: null
    }
  },
  created () {
    this.restoreFromStorage()
  },
  methods: {
    login () {
      const api = new ApiService(this.ip, this.port)
      api.post('/auth', {
        username: this.username,
        password: this.password
      }).then(response => {
        this.token = response.data.access_token
        this.saveToStorage()
        this.$emit('loggedIn')
      }).catch(() => {
        alert('Usuario o contraseña incorrecta.')
      })
    },
    saveToStorage () {
      localStorage.setItem('ip', this.ip)
      localStorage.setItem('port', this.port)
      localStorage.setItem('username', this.username)
      localStorage.setItem('token', this.token)
    },
    restoreFromStorage () {
      this.ip = localStorage.getItem('ip')
      this.port = localStorage.getItem('port')
      this.username = localStorage.getItem('username')
    }
  }
}
</script>

<style>
</style>
