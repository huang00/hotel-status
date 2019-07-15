<template>
  <div class="hotel-user">
    <div style='padding: 0 46px 27px;  background: #f7f7f7;'>
        <UserList></UserList>
    </div>
    
  </div>
</template>

<script>
// import { mapActions } from 'vuex'
// import { formatDate } from 'common_libs/util'
import UserList from '../components/userList/index'
import ShortMessage from '../components/shortMessage/index'

export default {
  name: 'hotel-user',
  components: {
    UserList,
    ShortMessage
  },
  data() {
    return {
      
    }
  },
  created() {
   
  },
  computed: {
    
  },
  methods: {
   
  }
}
</script>

<style lang="scss">
.hotel-user {
  background: #f7f7f7;
  
  height: 100%;
}
</style>
