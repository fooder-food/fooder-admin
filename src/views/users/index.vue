<template>
  <div class="app-container">
    <h3>Cusine View</h3>
    <div class="search-container">
        <div>
            <el-input
            v-model="search"
            type="mini"
             placeholder="Type to email to search"
            ></el-input>
        </div>
    </div>
   <el-table
    :data="tableData.filter(data => !search || data.email.includes(search))"
    v-loading="loading"
    border
    style="width: 100%">
    <el-table-column
      fixed="left"
      prop="id"
      label="Id"
      width="100">
    </el-table-column>
    <el-table-column
      prop="uniqueId"
      label="Unique Id"
      width="100">
    </el-table-column>
    <el-table-column
      prop="username"
      label="Username">
    </el-table-column>
    <el-table-column
      prop="email"
      label="Email">
    </el-table-column>
    <el-table-column
      prop="status"
      label="status"
      width="150"
      :filters="[{text:'Active', value:'ACTIVE'},{text:'Banned', value:'BAN'}]"
      :filter-method="filterHandler"
      >
      <template slot-scope="scope">
        <el-tag
          :type="scope.row.status === 'ACTIVE' ? 'success' :'danger'"
          disable-transitions>{{scope.row.status}}</el-tag>
      </template>
    </el-table-column>
     <el-table-column
      fixed="right"
      label="Operations">
      <template slot-scope="scope">
        <div style="display: flex">
         <el-button
          size="mini"
          @click="viewInfo(scope.row)">
            View
        </el-button>
        <el-button
          size="mini"
          :type="scope.row.status === 'ACTIVE'? 'danger': 'success'"
          @click="updateUserStatus(scope.row)">
            {{scope.row.status === 'ACTIVE'? 'BAN': 'Active'}}
        </el-button>
        </div>
      </template>
    </el-table-column>
  </el-table>
   <el-dialog
    title="User Info"
    :visible.sync="viewInfoVisible"
    >
     <div>
        <el-form ref="form" :model="userInfoForm" label-width="120px">
            <el-form-item label="Id">
              <el-input v-model="userInfoForm.id" readonly></el-input>
            </el-form-item>
            <el-form-item label="Unique Id">
              <el-input v-model="userInfoForm.uniqueId" readonly></el-input>
            </el-form-item>
             <el-form-item label="Username">
              <el-input v-model="userInfoForm.username" readonly></el-input>
            </el-form-item>
             <el-form-item label="Email">
              <el-input v-model="userInfoForm.email" readonly></el-input>
            </el-form-item>
             <el-form-item label="Phone Number">
              <el-input v-model="userInfoForm.phoneNumber" readonly></el-input>
            </el-form-item>
            <el-form-item label="Status">
                 <el-tag
                    :type="userInfoForm.status === 'ACTIVE' ? 'success': 'danger'"
                    disable-transitions>
                    {{userInfoForm.status}}
                 </el-tag>
            </el-form-item>
             <el-form-item label="Cuisine Icon">
               <img style="width:100px; height:100px" v-if="userInfoForm.avatar" :src="userInfoForm.avatar" class="avatar">
                <p v-else>No Avatar</p>
            </el-form-item>
             <el-form-item label="Create Date">
              <el-input v-model="userInfoForm.createDate"></el-input>
            </el-form-item>
             <el-form-item label="Update Date">
              <el-input v-model="userInfoForm.updateDate"></el-input>
            </el-form-item>
        </el-form>

     </div>
      <!-- <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="updateCuisine">Confirm</el-button>
      </span> -->
    </el-dialog>
  </div>
</template>

<script>
import {getAllUsers , getSingleUser, updateUserStatus} from '@/api/users';
import dayjs from 'dayjs';
export default {
  data() {
    return {
      tableData: [],
      loading: true,
      viewInfoVisible: false,
      search: '',
      userInfoForm: {
          id: null,
          uniqueId: '',
          username: '',
          email: '',
          phoneNumber: '',
          status: '',
          avatar: '',
          createDate: '',
          updateDate: '',
      }
    }
  },
  mounted() {
   this.fetch();
  },
  methods: {
    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    },
    async fetch() {
      try {
        this.loading = true;
        const {data: userData} = await getAllUsers();
        console.log(userData);
        this.tableData = [...userData.map(user => {
            return {
                id: user.id,
                uniqueId: user.uniqueId,
                username: user.username,
                email: user.email,
                status: user.isActive ? 'ACTIVE': 'BAN'
            }
        })]
      this.loading = false;
        
      } catch (error) {
         this.$message({
          message: e,
          type: 'error'
         });
      }
    },

    async viewInfo(row) {
       await this.fetchSingle(row.uniqueId);
       this.viewInfoVisible = true;
    },
    async fetchSingle(id) {
         const {data: userData} = await getSingleUser(id);
        this.userInfoForm.id = userData.id;
        this.userInfoForm.uniqueId = userData.uniqueId;
        this.userInfoForm.username = userData.username;
        this.userInfoForm.email = userData.email;
        this.userInfoForm.phoneNumber = userData.phoneNumber;
        this.userInfoForm.status = userData.isActive ? 'ACTIVE': 'BAN';
        this.userInfoForm.avatar = userData.avatar;
        this.userInfoForm.createDate = dayjs(userData.createDate).format('DD/MM/YYYY h:mm:ss a');
        this.userInfoForm.updateDate = dayjs(userData.updateDate).format('DD/MM/YYYY h:mm:ss a');
    },
    async updateUserStatus(row) {
       try {
        const data = {
            id: row.uniqueId,
            isActive: row.status === 'ACTIVE' ? 0 : 1,
        };
        const {data: responseData} = await updateUserStatus(data);
         this.$message.success(responseData.msg);
        this.fetch();
       } catch(e) {
           this.$message.error(e.msg);
       }
       
        // console.log(msg);
    }
  }
}
</script>

<style scoped>
    .search-container {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 20px;
    }
</style>