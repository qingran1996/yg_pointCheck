<template>
  <div class="Agent">
    <el-card>
      <h3 style="display: flex;justify-content: center;">代办事项</h3>
      <div :style="{height:heightCheck,overflowY:overflowVal}">
        <div class="allContent">

            <div class="oneTip">
              <div class="imgclass">
                <img src="@/assets/user_images/main1.png"/>
              </div>
              <div class="textclass">
                <p style="font-size: 18px;"><b>维修</b></p>
                <span style="color: #6C7B8B;">发起人:黄阳</span>
                <span style="color: #6C7B8B;margin-bottom: 4px;">2020-12-3</span>
              </div>
            </div>
          <div class="oneTip">
            <div class="imgclass">
              <img src="@/assets/user_images/main2.png"/>
            </div>
            <div class="textclass">
              <p style="font-size: 18px;"><b>作业票</b></p>
              <span style="color: #6C7B8B;">发起人:黄阳</span>
              <span style="color: #6C7B8B;">2020-12-3</span>
            </div>
          </div>
          <div class="oneTip">
            <div class="imgclass">
              <img src="@/assets/user_images/main3.png"/>
            </div>
            <div class="textclass">
              <p style="font-size: 18px;"><b>备品备件</b></p>
              <span style="color: #6C7B8B;">发起人:黄阳</span>
              <span style="color: #6C7B8B;">2020-12-3</span>
            </div>
          </div>
          <div class="oneTip">
            <div class="imgclass">
              <img src="@/assets/user_images/main4.png"/>
            </div>
            <div class="textclass">
              <p style="font-size: 18px;"><b>保养</b></p>
              <span style="color: #6C7B8B;">发起人:黄阳</span>
              <span style="color: #6C7B8B;">2020-12-3</span>
            </div>
          </div>
          <div class="oneTip">
            <div class="imgclass">
              <img src="@/assets/user_images/main5.png"/>
            </div>
            <div class="textclass">
              <p style="font-size: 18px;"><b>出库</b></p>
              <span style="color: #6C7B8B;">发起人:1111111111</span>
              <span style="color: #6C7B8B;">2020-12-3</span>
            </div>
          </div>
          <div class="oneTip">
            <div class="imgclass">
              <img src="@/assets/user_images/main5.png"/>
            </div>
            <div class="textclass">
              <p style="font-size: 18px;"><b>出库</b></p>
              <span style="color: #6C7B8B;">发起人:77</span>
              <span style="color: #6C7B8B;">2020-12-3</span>
            </div>
          </div>
<!--          真正导入数据格式-->
<!--          <div class="oneTip" v-for="item in tableData" :key="item.person +item.title + new Date().getTime()">-->
<!--            <div class="imgclass">-->
<!--              <img :src="item.imgUrl"/>-->
<!--            </div>-->
<!--            <div class="textclass" >-->
<!--              <p style="font-size: 18px;"><b>{{item.title}}</b></p>-->
<!--              <span style="color: #6C7B8B;">发起人:{{ item.person }}</span>-->
<!--              <span style="color: #6C7B8B;">{{ item.time }}</span>-->
<!--            </div>-->
<!--          </div>-->
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      heightCheck: document.body.clientWidth / 7 + 24 + 'px',
      overflowVal: 'auto',
      tableData:[{
        title:'维修',
        person:'黄阳',
        time:'2020-12-5',
        imgUrl:'@/assets/user_images/main1.png'
      },{
        title:'作业票',
        person:'黄阳',
        time:'2020-12-5',
        imgUrl:'@/assets/user_images/main2.png'
      },{
        title:'备品备件',
        person:'一车面包人',
        time:'2020-12-6',
        imgUrl:'@/assets/user_images/main3.png'
      },{
        title:'保养',
        person:'大西瓜',
        time:'2021-1-5',
        imgUrl:'@/assets/user_images/main4.png'
      },{
        title:'出库',
        person:'披星戴月',
        time:'2021-1-5',
        imgUrl:'@/assets/user_images/main5.png'
      },
        {
          title:'备品备件',
          person:'张三',
          time:'2021-1-5',
          imgUrl:'@/assets/user_images/main3.png'
        },
        {
          title:'出库',
          person:'233',
          time:'2021-1-5',
          imgUrl:'@/assets/user_images/main5.png'
        }]
    }
  }
}
</script>

<style scoped>
.Agent {

}

.allContent {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  align-content: flex-start;
  flex-wrap: wrap;
}
.oneTip{
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 260px;
  margin: 5px 15px 10px 15px;
  padding: 3px;
  border: solid 1px #E3E3E3	;
  box-shadow: 1px 1px 2px #E3E3E3;
}
.imgclass {
  margin-right: 25px;
  margin-left: 20px;
}

.textclass {
  margin: 0;
  padding: 0;
}

.textclass span {
  display: flex;
  align-content: center;
}
</style>
