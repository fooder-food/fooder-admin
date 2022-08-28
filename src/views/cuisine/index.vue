<template>
  <div class="app-container">
    <h3>Cusine View</h3>
   <el-table
    :data="tableData"
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
      prop="categoryName"
      label="Cuisine Name">
    </el-table-column>
    <el-table-column
      prop="categoryIcon"
      width="200"
      label="Cuisine Icon">
      <template slot-scope="scope">
        <el-image 
          style="width: 100px; height: 100px"
          :src="scope.row.categoryIcon" 
        >
        </el-image>
      </template>
    </el-table-column>
    <el-table-column
      prop="status"
      label="status"
      width="150"
      :filters="[{text:'Approved', value:'ACTIVE'},{text:'Rejcted', value:'PENDING'}]"
      >
      <template slot-scope="scope">
        <el-tag
          :type="scope.row.status === 'Approved' ? 'success' :'danger'"
          disable-transitions>{{scope.row.status}}</el-tag>
      </template>
    </el-table-column>
     <el-table-column
      prop="created By"
      label="createdBy"
      width="150"
      >
      <template slot-scope="scope">
        <el-tag
          type="primary"
          disable-transitions>{{scope.row.createdBy}}</el-tag>
      </template>
    </el-table-column>
     <el-table-column
      fixed="right"
      label="Operations">
      <template slot-scope="scope">
        <el-button
          size="mini"
          @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
      </template>
    </el-table-column>
  </el-table>
   <el-dialog
    title="Cusine Info"
    :visible.sync="editVisible"
    >
     <div>
        <el-form ref="form" :model="selectedForm" label-width="120px">
            <el-form-item label="Cuisine Name">
              <el-input v-model="selectedForm.cuisineName"></el-input>
          </el-form-item>
          <el-form-item label="Cuisine Icon">
              <el-upload
              class="avatar-uploader"
              :action="actionUrl"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              on-
              :before-upload="beforeAvatarUpload">
                  <img v-if="selectedForm.cuisineIcon" :src="selectedForm.cuisineIcon" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
          </el-form-item>
          <el-form-item label="Activity zone">
            <el-select v-model="selectedForm.status" placeholder="">
              <el-option label="Approved" value="Approved"></el-option>
              <el-option label="Rejected" value="Rejected"></el-option>
            </el-select>
          </el-form-item>
        </el-form>

     </div>
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="updateCuisine">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getCuisines, getSingleCuisine, updateCuisine } from '@/api/cuisine';
export default {
  data() {
    return {
      actionUrl: `${process.env.VUE_APP_BASE_API}/uploads/image`,
      tableData: [],
      loading: true,
      editVisible: false,
      selectedForm: {
        id: null,
        cuisineName:'',
        cuisineIcon: 'https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dmlld3xlbnwwfHwwfHw%3D&w=1000&q=80',
        status: '',
      }
    }
  },
  mounted() {
   this.fetch();
  },
  methods: {
    async fetch() {
      try {
        this.loading = true;
        const {data: resultData} = await getCuisines();
        const cuisinesData = resultData.categories;
        this.tableData = [...cuisinesData.map((item) => ({
          id: item.id,
          uniqueId: item.uniqueId,
          categoryName: item.categoryName,
          categoryIcon: item.categoryIcon,
          status: item.isActive ? 'Approved' : 'Rejected',
          createdBy: item.createdBy.username,
        }))];
      this.loading = false;
        
      } catch (error) {
         this.$message({
          message: e,
          type: 'error'
         });
      }
    },
    async fetchSingle(id) {
      try {
        const result = await getSingleCuisine(id);
        const category = result.data.categories;
        this.selectedForm.id = id;
        this.selectedForm.cuisineIcon = category.categoryIcon;
        this.selectedForm.cuisineName = category.categoryName;
        this.selectedForm.status = category.isActive ? 'Approved' : 'Rejected';

      }catch(e) {

      }
    },

   async updateCuisine() {
     try {
       const data = {
         id: Number(this.selectedForm.id),
         categoryName: this.selectedForm.cuisineName,
         categoryIcon: this.selectedForm.cuisineIcon,
         isActive: this.selectedForm.status === 'Approved',
       }

      const result = await updateCuisine(data);
      const message = result.data.message;
      await this.fetch();
      this.$message({
        message: message,
        type: 'success'
      });

     } catch (error) {
       
     }
     this.editVisible = false
   },
   handleEdit(index, row) {
     this.fetchSingle(row.id);
     this.editVisible = true;
   },
   handleAvatarSuccess(res, file) {
        this.selectedForm.cuisineIcon = res.data.url;
   },
  beforeAvatarUpload(file) {
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

