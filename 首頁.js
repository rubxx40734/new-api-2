// =============這是swiper===============
const mySwiper = new Swiper('.swiper-container', {
    // Optional parameters
    direction: 'horizontal',
    loop: true,
    speed:1000,
    effect:"horizontal",

  
    // If we need pagination
    pagination: {
      el: '.swiper-pagination',
    },
  
    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  
  });

//  bill60800
//  fy7m4bYPzKYrvMuECEXR38iTclm2
// 所以舊有的 API 網址「hexschoollivejs.herokuapp.com」將會淘汰替換成「livejs-api.hexschool.io」。

let totalList = []
let cartsList = []
let finalTotal 
const productList = document.querySelector('.productList')
const productChoose = document.querySelector('.productChoose')
const myshoopingJs = document.querySelector('.myshoopingJs')
const totalPrice = document.querySelector('.totalPrice')
const shoppingCarItem = document.querySelector('.shoppingCar-item')
console.log(productChoose)
function init(){
    renderProductList()
    getCartsList()
}
init()
// 取得產品列表
function renderProductList(){
    axios.get('https://livejs-api.hexschool.io/api/livejs/v1/customer/bill60800/products')
       .then(function(res){
           console.log(res.data.products)
           totalList = res.data.products
           console.log(totalList)
           let str = ''
           totalList.forEach(item=>{
               str += `<li>
               <div class="img">
                 <p class="newLogo">新品</p>
                 <img src="${item.images}" alt="">
                 <div class='addCart'><input type="button" class="addCartBtn btn btn-secondary"  data-id='${item.id}' value="加入購物車"></div>
               </div>
               <div class="info">
                 <p class="item">${item.title}</p>
                 <p class="price">NT$ ${toCurrency(item.origin_price)}</p>
                 <p class="sell">NT$ ${toCurrency(item.price)}</p>
               </div>
             </li>`
           })
           productList.innerHTML = str
       })
}
//邏輯篩選
productChoose.addEventListener('click',function(e){
    console.log(e.target.value)
    if(e.target.value == '全部'){
      let str = ''
        totalList.forEach(function(item){
           str+=`<li>
           <div class="img">
             <p class="newLogo">新品</p>
             <img src="${item.images}" alt="">
             <div class='addCart'><input type="button" class="addCartBtn btn btn-secondary" data-id='${item.id}' value="加入購物車"></div>
           </div>
           <div class="info">
             <p class="item">${item.title}</p>
             <p class="price">NT$ ${item.origin_price}</p>
             <p class="sell">NT$ ${item.price}</p>
           </div>
         </li>`
        })
        productList.innerHTML = str
        return
    }else{
        let str = ''
        totalList.forEach(function(item){
            if(e.target.value == item.category){
                str+=`<li>
                <div class="img">
                  <p class="newLogo">新品</p>
                  <img src="${item.images}" alt="">
                  <div class='addCart'><input type="button" class="addCartBtn btn btn-secondary" data-id='${item.id}' value="加入購物車"></div>
                </div>
                <div class="info">
                  <p class="item">${item.title}</p>
                  <p class="price">NT$ ${item.origin_price}</p>
                  <p class="sell">NT$ ${item.price}</p>
                </div>
              </li>`
            }
            productList.innerHTML = str
        })
    }
})

//取得購物車列表
function getCartsList(){
   axios.get('https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/bill60800/carts')
      .then(function(res){
        console.log(res.data)
        finalTotal = res.data.finalTotal
        cartsList = res.data.carts
        let str = ''
        cartsList.forEach(item=>{
          str += ` <tr>
          <th scope="row">
              <div class="table-item d-flex align-items-center">
                  <img src="${item.product.images}" alt="">
                  <p>${item.product.title}</p>
              </div>
          </th>
          <td class="">NT$ ${toCurrency(item.product.price)}</td>
          <td>${item.quantity}</td>
          <td>NT$ ${toCurrency((item.quantity)*(item.product.price))}</td>
          <td><input type="button" class="btn btn-danger" data-id="${item.id}" value="刪除"></td>
      </tr>`
        })
        myshoopingJs.innerHTML = str
        totalPrice.innerHTML = `<p>總金額</p>
        <p>NT $ ${toCurrency(finalTotal)}</p>`
      })
}

//加入購物車
productList.addEventListener('click',e=>{
  let id = e.target.getAttribute('data-id')
  let num = 1
  cartsList.forEach(item=>{
    if( id === item.product.id){
      num = item.quantity+=1
    }
  })
  if(e.target.value == '加入購物車'){
    axios.post('https://livejs-api.hexschool.io/api/livejs/v1/customer/bill60800/carts',{
      "data": {
        "productId": id,
        "quantity": num
      }
    }).then(function(res){
      alert('新增成功!')
      getCartsList()
    })
  }
})

//刪除特定品項
myshoopingJs.addEventListener('click',e=>{
  console.log(e.target.value)
  if(e.target.value !== '刪除'){
    return
  }
  let deleteId = e.target.getAttribute('data-id')
  console.log(deleteId)
  axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/bill60800/carts/${deleteId}`)
    .then(res=>{
      alert('刪除該單筆訂單  成功!')
      getCartsList()
    })
})

shoppingCarItem.addEventListener('click',e=>{
   if(e.target.value == '刪除所有品項'){
     axios.delete('https://livejs-api.hexschool.io/api/livejs/v1/customer/bill60800/carts')
       .then(res=>{
         alert('訂單全部刪除!')
         getCartsList()
       })
   }
})

//訂單資訊
const personJs = document.querySelector('.person-js')
const phoneJs = document.querySelector('.phone-js')
const emailJs = document.querySelector('.email-js')
const localJs = document.querySelector('.local-js')
const moneyJs = document.querySelector('.money-js')
const send = document.querySelector('.send')
console.log(personJs,phoneJs,emailJs,localJs,moneyJs,send)
send.addEventListener('click',e=>{
  e.preventDefault()
  if(e.target.value == '送出訂單'){
    if(personJs.value ==''||phoneJs.value==''||emailJs.value==''||localJs.value==''){
       alert('請確認資料是否有缺!')
       return
    }else{
      axios.post('https://livejs-api.hexschool.io/api/livejs/v1/customer/bill60800/orders',{
        "data": {
          "user": {
            "name": personJs.value,
            "tel": phoneJs.value,
            "email": emailJs.value,
            "address": localJs.value,
            "payment": moneyJs.value
          }
        }
      }).then(function(res){
        console.log(res)
        alert('訂單送出成功! 請至後台管理查看')
        personJs.value = ''
        phoneJs.value = ''
        emailJs.value = ''
        localJs.value = ''
        getCartsList()
      }).catch(function(err){
        console.log(err)
      })
    }
  }

})
// 千分為
function toCurrency(num){
  var parts = num.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}