<template>
  <div>
    <div id="qrcode"></div> <!-- 创建一个div，并设置id为qrcode -->
  </div>
</template>
   
<script>
import QRCode from 'qrcodejs2'  // 引入qrcode
export default {
  name : 'qrcode',
  props: {
      deliverParentAge: Number
    },
  mounted () {
	  console.log(this.deliverParentAge)
    // this.qrcode();
  },
  methods: {
    qrcode() {
      let qrcode = new QRCode('qrcode', {
        width: 50,  
        height: 50,
        text: this.deliverParentAge, // 二维码地址
        colorDark : "#000",
        colorLight : "#fff",
      })
    },
  }
}
</script>
<style lang='scss'>
 #qrcode {
    display: inline-block;
    img {
      width: 132px;
      height: 132px;
      background-color: #fff; 
      padding: 6px; 
    }
  }
</style>