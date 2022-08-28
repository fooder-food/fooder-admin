<template>
  <div class="app-container">
    <h3>Report View</h3>
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
      prop="content"
      label="Content">
    </el-table-column>
    <el-table-column
      prop="reporter"
      label="Reporter">
       <template slot-scope="scope">
        <el-tag
          type="primary"
          disable-transitions>{{scope.row.reporter}}</el-tag>
      </template>
    </el-table-column>
    <el-table-column
      prop="createDate"
      label="Create Date">
    </el-table-column>
    <el-table-column
      prop="updateDate"
      label="Update Date">
    </el-table-column>
    <el-table-column
      prop="status"
      label="status"
      width="150"
      :filters="[{text:'Accept', value:'ACCEPT'},{text:'Pending', value:'PENDING'}, {text:'Reject', value:'REJECT'},{text:'completed', value:'COMPLETED'}]"
      :filter-method="filterHandler"
      >
      <template slot-scope="scope">
        <el-tag
          :type="scope.row.status === 'ACCEPT' ||  scope.row.status === 'COMPLETED'? 'success' : scope.row.status === 'PENDING' ? 'primary':'danger'"
          disable-transitions>{{scope.row.status}}</el-tag>
      </template>
    </el-table-column>
     <el-table-column
     width="240"
      fixed="right"
      label="Operations">
      <template slot-scope="scope">
        <div v-if="scope.row.status === 'PENDING'" style="display: flex; padding-right: 20px">
         <el-button
          size="mini"
          @click="viewInfo(scope.row)">
            View
        </el-button>
         <el-button
          size="mini"
          type="success"
          @click="updateReport(scope.row, 'accept')">
            Accept
        </el-button>
         <el-button
          size="mini"
          type="danger"
          @click="updateReport(scope.row, 'reject')">
            Reject
        </el-button>
      </div>
         <div v-if="scope.row.status === 'ACCEPT'" style="display: flex; padding-right: 20px">
         <el-button
            size="mini"
            @click="viewInfo(scope.row)">
              View
          </el-button>
        <div v-if="scope.row.type == 'review'">
         <!-- <el-button @click="updateReport({
              uniqueId: reportForm.uniqueId,
              userId: commentForm.userId,
              restaurntUniqueId: commentForm.restaurntUniqueId,
               isBan: true,
            }, 'completed')" type="danger" size="mini">Ban User</el-button>
            <el-button @click="updateReport({
              uniqueId: reportForm.uniqueId,
              userId: commentForm.userId,
              restaurntUniqueId: commentForm.restaurntUniqueId,
              isBan: false,
            }, 'completed')" type="primary" size="mini">No Ban User</el-button> -->
        </div>
        <div v-else>
          <el-button
            size="mini"
            type="success"
            @click="updateReport(scope.row, 'completed')">
              Complete
          </el-button>
        </div>
      </div>
       <div v-if="scope.row.status === 'COMPLETED' || scope.row.status === 'REJECT'" style="display: flex; padding-right: 20px">
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
    title="Report Info"
    :visible.sync="viewInfoVisible"
    >
     <div>
        <el-form ref="reportForm" :model="reportForm" label-width="120px">
            <el-form-item label="Id">
              <el-input v-model="reportForm.id" readonly></el-input>
            </el-form-item>
            <el-form-item label="Unique Id">
              <el-input v-model="reportForm.uniqueId" readonly></el-input>
            </el-form-item>
             <el-form-item label="content">
              <el-input v-model="reportForm.content" 
              type="textarea"
              autosize ></el-input>
            </el-form-item>
             <el-form-item label="type">
              <el-input v-model="reportForm.reportType" 
              type="textarea"
              autosize 
              readonly></el-input>
            </el-form-item>
             <el-form-item label="Create Date">
              <el-input v-model="reportForm.createDate"></el-input>
            </el-form-item>
             <el-form-item label="Update Date">
              <el-input v-model="reportForm.updateDate"></el-input>
            </el-form-item>
        </el-form>
        <div v-if="reportForm.type === 'restaurant'" >
          <p>Restuarant</p>
        </div>
        <div v-else>
          <hr/>
          <h4>Review Info</h4>
           <el-form ref="commentForm" :model="commentForm" label-width="120px">
            <el-form-item label="Id">
              <el-input v-model="commentForm.uniqueId" readonly></el-input>
            </el-form-item>
            <el-form-item label="Unique Id">
              <el-input v-model="commentForm.content" type="textarea"
                autosize
               readonly></el-input>
            </el-form-item>
             <el-form-item label="Restaurant Name">
              <el-input v-model="commentForm.restaurantName" readonly></el-input>
            </el-form-item>
             <el-form-item label="Username">
              <el-input v-model="commentForm.username" readonly></el-input>
            </el-form-item>
             <el-form-item label="Create Date">
              <el-input v-model="commentForm.createDate" readonly></el-input>
            </el-form-item>
             <el-form-item label="Update Date">
              <el-input v-model="commentForm.updateDate" readonly></el-input>
            </el-form-item>
          </el-form>
         
        </div>

     </div>
      <span slot="footer" class="dialog-footer">
        <div v-if="reportForm.status === 'PENDING'">
           <el-button type="success" @click="updateReport({
             uniqueId: reportForm.uniqueId,
           }, 'accept')">Accpet</el-button>
           <el-button @click="updateReport({
             uniqueId: reportForm.uniqueId,
           }, 'reject')" type="danger">Reject</el-button>
        </div>
         <div v-if="reportForm.status === 'ACCEPT'">
         <div v-if ="reportForm.type === 'review'">
          <el-button @click="updateReport({
              uniqueId: reportForm.uniqueId,
              userId: commentForm.userId,
              restaurantUniqueId: commentForm.restaurantUniqueId,
               isBan: true,
            }, 'completed')" type="danger">Ban User</el-button>
            <el-button @click="updateReport({
              uniqueId: reportForm.uniqueId,
              userId: commentForm.userId,
              restaurantUniqueId: commentForm.restaurantUniqueId,
              isBan: false,
            }, 'completed')" type="primary">No Ban User</el-button>
         </div>
           <el-button v-else @click="updateReport({
             uniqueId: reportForm.uniqueId,
           }, 'completed')" type="success">Complete</el-button>
        </div>
         
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {getReports, getSingleReport, updateReport} from '@/api/report';
import dayjs from 'dayjs';
export default {
  data() {
    return {
      tableData: [],
      loading: true,
      viewInfoVisible: false,
      search: '',
      reportForm: {
        id: null,
        uniqueId: '',
        content: '',
        type: '',
        createDate: '',
        updateDate: '',
        status: null,
     },
     commentForm: {
      content: '',
      uniqueId: '',
      updateDate: '',
      createDate: '',
      restaurantName: '',
      username: '',
      userId: '',
      restaurantUniqueId: '',
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
        const result = await getReports();
        const reportsData = result.data;
        this.tableData = reportsData.map((report) => {
          return {
            id: report.id,
            uniqueId: report.uniqueId,
            content: report.content,
            reporter: report.reporter.username,
            type: report.type,
            createDate: dayjs(report.createDate).format('DD/MM/YYYY h:mm:ss a'),
            updateDate: dayjs(report.updateDate).format('DD/MM/YYYY h:mm:ss a'),
            status: report.status === 'pending' ? 'PENDING': report.status === 'accept' ? 'ACCEPT': report.status === 'reject' ? 'REJECT' : 'COMPLETED',
          }
        });
       
      this.loading = false;
        
      } catch (error) {
         this.$message({
          message: e,
          type: 'error'
         });
      }
    },

    async viewInfo(row) {
       const result = await getSingleReport(row.uniqueId);
       const reportData = result.data.report;
       if (result.data.comment !== undefined) {
        const comment = result.data.comment;
        this.commentForm = {
          content: comment.content,
          uniqueId: comment.uniqueId,
          updateDate: dayjs(comment.createDate).format('DD/MM/YYYY h:mm:ss a'),
          createDate: dayjs(comment.updateDate).format('DD/MM/YYYY h:mm:ss a'),
          restaurantName: comment.restaurant.restaurantName,
          username: comment.user.username,
          userId: comment.user.uniqueId,
          restaurantUniqueId: comment.restaurant.uniqueId,
        }
       } else {}

       this.reportForm = {
          id: reportData.id,
        uniqueId: reportData.uniqueId,
        content: reportData.content,
        reportType: reportData.reportType,
        type: reportData.type,
        createDate: dayjs(reportData.createDate).format('DD/MM/YYYY h:mm:ss a'),
        updateDate: dayjs(reportData.updateDate).format('DD/MM/YYYY h:mm:ss a'),
        status: reportData.status === 'pending' ? 'PENDING': reportData.status === 'accept' ? 'ACCEPT': reportData.status === 'reject' ? 'REJECT' : 'COMPLETED',
       }
       this.viewInfoVisible = true;
    },
    async updateReport(row, status) {
      try {
        const result = await updateReport(row.uniqueId, {
          status,
          type: row.type,
          userId: row.userId,
          restaurantUniqueId: row.restaurantUniqueId,
          isBan: row.isBan ? 0 : 1,
        
        });
        if(this.viewInfoVisible) {
          this.viewInfoVisible = false;
        }
        this.$message.success('update success');

      }catch(e) {
        // console.log(e);
         this.$message.error(e.message);
      }
     this.fetch();
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