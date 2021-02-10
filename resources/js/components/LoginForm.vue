<template>
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-body">
                    <div class="form-group">
                        <label for="email">Email address</label>
                        <input type="email" id="email" class="form-control" v-model="user.email" placeholder="Enter email">
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" class="form-control" id="password" v-model="user.password" placeholder="Password">
                    </div>
                    <button @click.prevent="login()" class="btn btn-primary">Submit</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            user: {
                email: 'asoboleva@example.org',
                password: 'password',
            }
        }
    },
    methods: {
        login() {
            this.$store.dispatch('currentUser/loginUser', this.user)
        }
    }
}
</script>
