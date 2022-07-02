import Vue from 'vue'

export const EventBus = new Vue()

export function loginCheck() {
    console.log("로그인 체크 중")
    // 도매처에 url 공유한 경우 자동 로그인
    if (Object.keys(this.$route.query).includes('shared')) {
            this.urlShared = true;
            axios("/login/wholesaler-login", {
                method: "post",
                data: {
                storeId: this.$route.query.store
                },
            }).then((res) => {
                localStorage.token = res.data.token

                if (isValidJwt()) {
                let data = JSON.parse(atob(localStorage.token.split('.')[1]))
                this.username = data.username;
                this.userRole = data.role;
                this.userId = data.userId;
                this.storeId = data.storeId;
                store.commit('SET_USER_ROLE', this.userRole);
                store.commit('SET_USER_ID', this.userId);
                store.commit('SET_STORE_ID', this.storeId);
            }
            }).catch((error) => {
                alert("로그인 실패!");
                return;
            });
        }

    else if (isValidJwt()) {
        let data = JSON.parse(atob(localStorage.token.split('.')[1]))
        this.username = data.username;
        this.userRole = data.role;
        this.userId = data.userId;
        this.storeId = data.storeId;
        store.commit('SET_USER_ROLE', this.userRole);
        store.commit('SET_USER_ID', this.userId);
        store.commit('SET_STORE_ID', this.storeId);
    } else {
        // console.log(dd)
        store.commit('SET_URL_BEFORE_LOGIN', window.location.pathname + window.location.search);
        // 로그인페이지로 이동
        this.$router.push({
            path: '/sign-in'
        }).catch(error => {})
    }
}

export default loginCheck;