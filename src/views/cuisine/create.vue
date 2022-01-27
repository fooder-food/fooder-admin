<template>
    <div class="app-container">
        <h3>Create Cusine</h3>
        <el-form ref="form" :model="form" label-width="120px">
            <el-form-item label="Cuisine Name">
                <el-input v-model="form.cuisineName"></el-input>
            </el-form-item>
            <el-form-item label="Cuisine Icon">
                <el-upload
                class="avatar-uploader"
                :action="actionUrl"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                on-
                :before-upload="beforeAvatarUpload">
                    <img v-if="form.cuisineIcon" :src="form.cuisineIcon" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">Create</el-button>
                <el-button>Cancel</el-button>
            </el-form-item>
        </el-form>

    </div>
</template>

<script>
import { createCruisine } from '@/api/cuisine';
  export default {

    data() {
        return {
            actionUrl: `${process.env.VUE_APP_BASE_API}/uploads/image`,
            form: {
                cuisineName:'',
                cuisineIcon: '',
            },
        }
    },
    methods: {
        async onSubmit() {
            try {
                const body = {
                    categoryIcon: this.form.cuisineIcon,
                    categoryName: this.form.cuisineName,
                }
                const result = await createCruisine(body);
                const message = result.data.message;
                this.$message({
                 message: message,
                 type: 'success'
                });
                this.form.cuisineName = '';
                this.form.cuisineIcon = '';

            } catch(e) {
                this.$message({
                message: e.message,
                type: 'error'
                });
            }
        },
      handleAvatarSuccess(res, file) {
        this.form.cuisineIcon = res.data.url;
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

<style>
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