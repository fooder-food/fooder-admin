<template>
  <div class="app-container">
       <div class="dashboard-section">
         <div @click="toUserPage" class="section">
            <el-card  class="box-card" :body-style="{
              padding: '15px',
              }">
              <div class="card" >
                <div class="left">
                  <img src="@/icons/png/user.png" alt="">
                </div>   
                <div class="right">
                <p class="title"> Total User</p>
                <p class="subtitle">{{userCount}}</p>
                </div>
              </div>
            </el-card>
           
         </div>
        
        <div @click="toReataurantPage" class="section">
            <el-card  class="box-card" :body-style="{
              padding: '10px',
              }">
              <div class="card" >
                <div class="left">
                  <img src="@/icons/png/canting.png" alt="">
                </div>   
                <div class="right">
                 <p class="title"> Total Retaurant</p>
                <p class="subtitle">{{restaurantCount}}</p>
                </div>
              </div>
            </el-card>
           
         </div>

         <div @click="toReportPage" class="section">
            <el-card  class="box-card" :body-style="{
              padding: '10px',
              }">
              <div class="card" >
                <div class="left">
                  <img src="@/icons/png/report.png" alt="">
                </div>   
                <div class="right">
                  <p class="title"> Total Report</p>
                <p class="subtitle">{{reportCount}}</p>
                </div>
              </div>
            </el-card>
           
         </div>
       </div>
       <div class="chart-container">
         <apexchart type="line" :options="options" :series="series"></apexchart>
      </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { getData } from '@/api/home';
export default {
  name: 'Dashboard',
  data() {
    return {
      options: {
        chart: {
          id: 'vuechart-example'
        },
        xaxis: {
          categories: ['JAN', 'FEB', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
        }
      },
      userCount: 0,
      restaurantCount: 0,
      reportCount: 0,
      series: []
    }
  },
  components: {
    
  },
  mounted () {
    this.fetch();
  },
  methods: {
    async fetch()  {
      const {data: resultData} = await getData();
      console.log(resultData);
      this.restaurantCount = resultData.restaurant.count;
      this.userCount = resultData.user.count;
      this.reportCount = resultData.report.count;
      const userSeries = {
        name: 'user',
        data: resultData.user.data,
      }

       const restaurantSeries = {
        name: 'restaurant',
        data: resultData.restaurant.data,
      }

       const reportSeries = {
        name: 'report',
        data: resultData.report.data,
      }

      this.series.push(userSeries,restaurantSeries,reportSeries);
      
    },
    toUserPage() {
       this.$router.push('/users/index');
    },
    toReataurantPage() {
      this.$router.push('/restaurants/index');
    },
    toReportPage() {
       this.$router.push('/report/index');
    }
  }

}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
  
 
}
  .el-card__body {
      padding: 0px !important;
  }
  .chart-container {
    width: 95%;
    margin: 0px 10px;
    margin-top: 50px;
  }
 .dashboard-section {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .section {
      margin-right: 10px;
      cursor: pointer;
    }
    .card {
      display: flex;
      justify-content: space-around;
      align-items: center;
      width: 100%;
      .left {
        width: 20%;
        height: 100%;
        img {
          width: 100%;
          height: inherit;

        }
      }
      .right {
        width: 50%;
        .title {
          margin-bottom: 0px;
        }
        .subtitle {
          font-weight: bold;
          font-size: 24px;
          margin-left: 15px;
          margin-top: 5px;
        }

      }
    }
  }
</style>
