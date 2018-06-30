<template>
  <div>
    <h1 class="title has-text-centered">Iniciar sesión</h1>
    <div class="section">
      <div class="card">
        <form class="card-content" @submit.prevent="login">
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
import axios from 'axios'

export default {
  name: 'Login',
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    login () {
      const url = 'http://localhost:5000/auth'
      axios.post(url, {
        username: this.username,
        password: this.password
      }).then(response => {
        const token = response.data.access_token
        this.$emit('tokenObtained', token, () => {
          axios.post('http://localhost:5000/start') // Start traders callback
        })
      }).catch(() => {
        alert('Usuario o contraseña incorrecta.')
      })
    }
  }
}
</script>

<style>
</style>
