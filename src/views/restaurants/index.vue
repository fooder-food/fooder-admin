<template>
  <div class="app-container">
    <h3>Restaurant View</h3>
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
      prop="restaurantName"
      label="Restaurant Name">
    </el-table-column>
    <el-table-column
      prop="address"
      label="Address">
    </el-table-column>
   <el-table-column
      prop="image"
      width="200"
      label="Restaurant Image">
      <template slot-scope="scope">
        <el-image 
          style="width: 100px; height: 100px"
          :src="scope.row.image" 
        >
        </el-image>
      </template>
    </el-table-column>
    <el-table-column
      prop="status"
      label="status"
      width="150"
      :filters="[{text:'Pending', value:'PENDING'},{text:'Approve', value:'APPROVE'}]"
      :filter-method="filterHandler"
      >
      <template slot-scope="scope">
        <el-tag
          :type="scope.row.status === 'APPROVE' ? 'success' :'primary'"
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
        </div>
      </template>
    </el-table-column>
  </el-table>
 <el-dialog
    width="90%"
    title="Restaurant Info"
    :visible.sync="editVisible"
    >
     <div>
        <el-form ref="form" :model="restaurantInfoForm" label-width="120px">
          <el-form-item label="Id">
              <el-input v-model="restaurantInfoForm.id" readonly></el-input>
          </el-form-item>
          <el-form-item label="Unique Id">
              <el-input v-model="restaurantInfoForm.uniqueId" readonly></el-input>
          </el-form-item>
           <el-form-item label="Name">
              <el-input v-model="restaurantInfoForm.restaurantName"></el-input>
          </el-form-item>
           <el-form-item label="Image">
              <el-upload
              class="avatar-uploader"
              :action="actionUrl"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              on-
              :before-upload="beforeAvatarUpload">
                  <img v-if="restaurantInfoForm.image" :src="restaurantInfoForm.image" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
          </el-form-item>
          <el-form-item label="Address">
              <el-input v-model="restaurantInfoForm.address" type="textarea"  autosize></el-input>
          </el-form-item>
          <el-form-item label="Price Person">
              <el-input v-model="restaurantInfoForm.pricePerson" type="number"></el-input>
          </el-form-item>
          <el-form-item label="Website">
              <el-input v-model="restaurantInfoForm.website"></el-input>
          </el-form-item>
          <el-form-item label="Business Hours">
              <div v-for="item in restaurantInfoForm.businessHour" :key="item.day" style="display: flex; justify-content: space-between;margin-left: 30px">
                  <p>{{ item.day }}</p>
                <el-time-picker
                is-range
                v-model="item.time"
                range-separator="To"
                start-placeholder="Start time"
                end-placeholder="End time">
            </el-time-picker>
              </div>
              
          </el-form-item>
          <el-form-item label="Break Time">
              <el-time-picker
                is-range
                v-model="restaurantInfoForm.breakTime"
                range-separator="To"
                start-placeholder="Start time"
                end-placeholder="End time">
            </el-time-picker>
          </el-form-item>
          <el-form-item label="Phone Number">
              <el-input v-model="restaurantInfoForm.restaurantPhone" type="tel"></el-input>
          </el-form-item>
          <!-- <el-form-item label="Country">
            <el-select 
            :remote-method="remoteMethod"
            filterable
            :loading="countrySearchLoading"
            v-model="restaurantInfoForm.country" 
            placeholder="">
              <el-option v-for="country in countryList" :key="country.id" :label="country.name" :value="country.name">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="State">
               <el-select 
            :remote-method="remoteMethod"
            filterable
            :loading="countrySearchLoading"
            v-model="restaurantInfoForm.state" 
            placeholder="">
              <el-option v-for="state in stateList" :key="state.id" :label="state.name" :value="state.name">
              </el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="Status">
              <el-select v-model="restaurantInfoForm.status" placeholder="">
              <el-option label="Pending" value="PENDING"></el-option>
              <el-option label="Approve" value="APPROVE"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Create By">
              <el-input v-model="restaurantInfoForm.createBy" readonly></el-input>
          </el-form-item>
        </el-form>

     </div>
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="updateInfo">Update</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getRestaurants, getRestaurantInfo , getCountry, getState, updateRestaurantInfo} from '@/api/restaurants';
import dayjs from 'dayjs';
export default {
  data() {
    return {
      actionUrl: `${process.env.VUE_APP_BASE_API}/uploads/image`,
      tableData: [],
      loading: true,
      countrySearchLoading: false,
      editVisible: false,
      countryList: [],
      stateList: [],
      search: '',
      restaurantInfoForm: {
          id: null,
          uniqueId: '',
          restaurantName: '',
          address: '',
          pricePerson: '',
          website: '',
          businessHour: [
            {
              day: 'Monday',
              time: [],
            },
            {
              day: 'Tuesday',
              time: [],
            },
            {
              day: 'Wednesday',
              time: [],
            },
            {
              day: 'Thursday',
              time: [],
            },
            {
              day: 'Friday',
              time: [],
            },
            {
              day: 'Saturday',
              time: [],
            },
            {
              day: 'Sunday',
              time: [],
            },
          ],
          breakTime: '',
          restaurantPhone: '',
          country: '',
          state: '',
          status: '',
          view: '',
          createBy: '',
          image: '',

      }
    }
  },
  mounted() {
   this.fetchCountry();
   this.fetch();
  },
  methods: {
      async updateInfo() {
         try {
             this.editVisible = false;
            if(this.restaurantInfoForm.pricePerson) {
                this.restaurantInfoForm.pricePerson =  this.restaurantInfoForm.pricePerson;
            }
            //business hours
            this.restaurantInfoForm.businessHour = JSON.stringify(this.restaurantInfoForm.businessHour.map(item => {
                return `${item.day}: ${this.convertTime(item.time[0])} – ${this.convertTime(item.time[1])}`
            }));
            if(this.restaurantInfoForm.breakTime) {
                this.restaurantInfoForm.breakTime = JSON.stringify([this.convertTime(this.restaurantInfoForm.breakTime[0]), this.convertTime(this.restaurantInfoForm.breakTime[1])]);
            }
            this.restaurantInfoForm.status = this.restaurantInfoForm.status.toLowerCase(); 
            const res = await updateRestaurantInfo(this.restaurantInfoForm);
            this.$message.success(res.data.message);
            this.fetch();
            console.log(res);
         } catch(e) {
            this.$message.error(e.message);
         }
      },
    convertTime(time) {
        return dayjs(time).format('hh:mm A');
    },
    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    },
    remoteMethod(query) {
        if (query !== '') {
          this.countrySearchLoading = true;
          setTimeout(() => {
            this.countrySearchLoading = false;
            this.countryList = this.countryList.filter(item => {
              return item.name.toLowerCase()
                .indexOf(query.toLowerCase()) > -1;
            });
          }, 200);
        } else {
          this.countryList = [];
        }
      },
    async fetchCountry() {
        const res = await getCountry();
        const countryList = res.data;
        this.countryList = [...countryList];
    },
    async fetch() {
      try {
        this.loading = true;
        const {data: restaurantsData} = await getRestaurants();
        this.tableData = [...restaurantsData.map(restaurant => {
            return {
                id: restaurant.id,
                uniqueId: restaurant.uniqueId,
                restaurantName: restaurant.restaurantName,
                image: restaurant.image,
                address: restaurant.address,
                status: restaurant.status === 'pending' ? 'PENDING': 'APPROVE'
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
       this.editVisible = true;
    },
    timeFormatter(time) {
        const isPm = time.split(' ')[1].includes('PM');
        if(isPm) {
            //ispm
             const newTime = time.split(' ')[0];
            return new Date(2016, 9, 10, Number(newTime.split(':')[0]) + 12, Number(newTime.split(':')[1]));
        } else {
            const newTime = time.split(' ')[0];
            return new Date(2016, 9, 10, Number(newTime.split(':')[0]), Number(newTime.split(':')[1]));
        }
        
    },
    breakTimeConverter(time) {

    },
    async fetchState(code) {
        const res = await getState(code);
        const stateList = res.data;
        this.stateList = [...stateList];
    },
    async fetchSingle(id) {
         const {data: restaurantData} = await getRestaurantInfo(id);
         console.log(restaurantData);
         const restaurantBusinessHours = JSON.parse(restaurantData.businessHour);
         console.log(restaurantBusinessHours);
         const newRestaurantBusinessHours = restaurantBusinessHours.map(item => {
             const splitArray = item.split(': ');
             const day = splitArray[0];
             const start = splitArray[1].split(' – ')[0];
             const end = splitArray[1].split(' – ')[1];
             const startTime = this.timeFormatter(start);
             const endTime = this.timeFormatter(end);
             return {
                 day,
                 time: [startTime, endTime],
             }
         });
        this.restaurantInfoForm = {
            ...this.restaurantInfoForm,
          id: restaurantData.id,
          uniqueId: restaurantData.uniqueId,
          restaurantName: restaurantData.restaurantName,
          address: restaurantData.address,
          pricePerson: restaurantData.pricePerson,
          website: restaurantData.website,
          breakTime: restaurantData.breakTime,
          restaurantPhone: restaurantData.restaurantPhone,
          country: restaurantData.country,
          state: restaurantData.state,
          status: restaurantData.status === 'pending' ? 'PENDING': 'APPROVE',
          view: restaurantData.view + '',
          createBy: restaurantData.createBy.username,
          image: restaurantData.image,

      };

       this.fetchState(restaurantData.countryAlias);
      
        if(restaurantBusinessHours.length > 0) {
            this.restaurantInfoForm.businessHour = newRestaurantBusinessHours;
        }

    },
     handleAvatarSuccess(res, file) {
        this.restaurantInfoForm.image = res.data.url;
   },
  beforeAvatarUpload(file) {
      console.log(file.type);
    const acceptFormat = ['image/jpeg','image/png'];
    const isPass = acceptFormat.includes(file.type);
    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!isPass) {
      this.$message.error('Avatar picture must be JPG format or PNG format!');
    }
    if (!isLt2M) {
      this.$message.error('Avatar picture size can not exceed 2MB!');
    }
    return isPass && isLt2M;
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
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>


</style>