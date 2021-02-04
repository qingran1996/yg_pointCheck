import Vue from 'vue'

const timeout = 400

const preventReClick = Vue.directive('preventReClick',{
  inserted:function(el,binding){
    el.addEventListener('click',()=>{
      if (!el.disabled) {
        el.disabled = true
        setTimeout(() => {
          el.disabled = false
        }, timeout || binding.value || 3000)
      }
    })
  }
})

export { preventReClick }
