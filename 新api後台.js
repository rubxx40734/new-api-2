//  bill60800
//  fy7m4bYPzKYrvMuECEXR38iTclm2
// 所以舊有的 API 網址「livejs-api.hexschool.io」將會淘汰替換成「livejs-api.hexschool.io」。



let orders = []
const BackstageOrderItem = document.querySelector('.BackstageOrder-item')
const deleteALLItem = document.querySelector('.deleteALL-item')
function init(){
    renderOrder()
}
init()
//渲染訂單
function renderOrder(){
    
    axios.get('https://livejs-api.hexschool.io/api/livejs/v1/admin/bill60800/orders',{
        headers:{
            "authorization": 'fy7m4bYPzKYrvMuECEXR38iTclm2'
        }
    }).then(res=>{
        // console.log(res.data.orders)
        orders = res.data.orders
        console.log(orders)
        let str = ''
        orders.forEach(item=>{
            let productStr = ''
            item.products.forEach(item=>{
                productStr+=`${item.title} * ${item.quantity}<br>`
            })
            let paidStatus = ''
            if(item.paid == false){
                paidStatus = "未付款"
            }else{
                paidStatus = "已付款"
            }
            str+=` <tbody class="BackstageOrder-item">
            <tr>
                <td style="width: 10%;">${item.id}</td>
                <td style="width: 10%; line-height: 1.2;">${item.user.name}<br> ${item.user.tel}</td>
                <td style="width: 18%;">${item.user.address}</td>
                <td style="width: 18%;">${item.user.email}</td>
                <td style="width: 18%; line-height: 1.2;" class="text-danger">${productStr}</td>
                <td style="width: 10%;">${getLocalTime(item.createdAt)}</td>
                <td style="width: 8%;"><a href="#" data-id="${item.id}" class='link'>${paidStatus}</a></td>
                <td style="width: 8%;"><input type="button" value="刪除" class="deleteSelf btn btn-danger btn-sm" data-id="${item.id}"></td>
            </tr>
        </tbody>`
        })
        BackstageOrderItem.innerHTML = str
        renderC3()
    })
}

//修改訂單 以及刪除單筆
BackstageOrderItem.addEventListener('click',e=>{
    e.preventDefault()
    let id = e.target.getAttribute('data-id')
    console.log(id)
    console.log(e.target.innerText) 
    let status
    if(e.target.innerText == '未付款'){
        status = true
    }else{
        status = false
    }
    if(e.target.getAttribute('class') == 'link'){
        axios.put('https://livejs-api.hexschool.io/api/livejs/v1/admin/bill60800/orders',{
            "data": {
                "id": id,
                "paid": status
              }
        },{
            headers:{
                "authorization": 'fy7m4bYPzKYrvMuECEXR38iTclm2'
            }
        }).then(res=>{
            console.log(res)
            alert('訂單修改成功!')
            renderOrder()
        })
    }
    else if(e.target.value == '刪除'){
        axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/bill60800/orders/${id}`,{
            headers:{
                "authorization": 'fy7m4bYPzKYrvMuECEXR38iTclm2'
            }
        }).then(res=>{
            alert('刪除該單筆成功!')
            renderOrder()
        })
    }
})

//delete all
deleteALLItem.addEventListener('click',e=>{
    if(e.target.value == '刪除全部品項'){
        axios.delete('https://livejs-api.hexschool.io/api/livejs/v1/admin/bill60800/orders',{
            headers:{
                "authorization": 'fy7m4bYPzKYrvMuECEXR38iTclm2'
            }
        }).then(res=>{
            console.log(res)
            alert('已刪除全部訂單!')
            renderOrder()
        })
    }
})
//C3圖表
function renderC3(){
    let totalObj ={}
    // console.log(orders)
    orders.forEach(item=>{
      item.products.forEach(productsItem=>{
        //   console.log(productsItem)
        if(totalObj[productsItem.title] == undefined){
            totalObj[productsItem.title] = productsItem.quantity *  productsItem.price
        }else{
            totalObj[productsItem.title] += productsItem.quantity * productsItem.price
        }
      })
    })
    console.log(totalObj)
    const ary = Object.keys(totalObj)
    // console.log(ary)
    let totalAry = []
    ary.forEach(item=>{
        let smallAry = []
        smallAry.push(item)
        smallAry.push(totalObj[item])
        totalAry.push(smallAry)
    })
    //整理前三名跟其他
    totalAry.sort(function(a,b){
        return b[1] - a[1]
    })
    console.log(totalAry)
    if(totalAry.length>3){
      let otherPrice = 0
      totalAry.forEach((item,index)=>{
          if(index>2){
              otherPrice += totalAry[index][1]
          }
      })
      totalAry.splice(3,totalAry.length-3)
      totalAry.push(['其他',otherPrice])
    }
    console.log(totalAry)

    var chart = c3.generate({
        bindto: '.c3Pct',
        data: {
          columns: totalAry,
          type: 'pie'
        },
        color:{
            pattern:['#301E5F','#5434A7','#9D7FEA','#DACBFF']
        }
    });
}
//時間戳

function getLocalTime(nS) {  
    return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');  
    }