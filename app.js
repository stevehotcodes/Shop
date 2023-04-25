class Product{
    //deal with a single product

    constructor(product){
        this.product=product
    }

    render(){
        //rendering a single product
        let html = `
        
        <div class="item">
        <img src=${this.product.productImg} alt="${this.product.productName}" >
        <div class="product-item__content">
          <h2>${this.product.productName}</h2>
          <h3>\$ ${this.product.productPrice}</h3>
          <p>${this.product.productDescription}</p>
          <button onclick="new Product().updateProduct(${this.product.id})">update</button>
         <button onclick="new Product().deleteProduct(${this.product.id})" ><ion-icon name="trash-outline"></ion-icon></button>
         <button onclick="new Cart().addProduct(${this.product.id})">add to cart</button>
        </div>
     </div>
        
        `

        return html
    }
    async deleteProduct(id) {
        await fetch(`http://localhost:3000/products/${id}`, {
            method:'DELETE',
            headers:{
                "Content-Type": "application/json"
            }
        })
    }
    async updateProduct(id){
        const response = await fetch(`http://localhost:3000/products/${id}`)
        const product = await response.json()
      
       this.prePopulate(product)
       const btn = document.querySelector("#btn")
       btn.addEventListener('click', (e)=>{
        e.preventDefault()
        
        const updatedProduct= new Product().readValues();
        if(btn.innerText==="Update Product"){
            console.log("Updating");
            this.sendUpdate({...updatedProduct, id})
           }
       })

    }

    async sendUpdate(product){
        
        await fetch(`http://localhost:3000/products/${product.id}`, {
            method:'PUT',
            body:JSON.stringify(product),
            headers:{
                "Content-Type": "application/json"
            }
        })
    }
    prePopulate(product){
        document.querySelector("#p_name").value=product.productName
        document.querySelector("#p_image").value = product.productImg
        document.querySelector("#p_price").value =product.productPrice
        document.querySelector("#p_description").value=product.productDescription
        document.querySelector("#btn").textContent= `Update Product`
    }

    readValues(){
        const productName= document.querySelector("#p_name").value
        const productImg = document.querySelector("#p_image").value
        const productPrice =document.querySelector("#p_price").value
        const productDescription =document.querySelector("#p_description").value
        return {productName,productImg,productDescription, productPrice};
    }
    async addProduct(){
        const newProduct =new Product().readValues();
        await fetch(' http://localhost:3000/products', {
            method:'POST',
            body:JSON.stringify(newProduct),
            headers:{
                "Content-Type": "application/json"
            }
        })
    }
}

const btn = document.querySelector("#btn")

    btn.addEventListener('click', ()=>{
        if(btn.innerText==='Add Product'){
            new Product().addProduct()
        }
    })


class ProductList{
//deal with all products

     async render(){
        //get list of products and render- api call
        let products= await this.fetchProduct()
        // console.log(products);
        let html=''
        for(let product of products){
            const productHTML = new Product(product).render()
            html +=productHTML
        }
        return html
     }

     async fetchProduct(){
        const response = await fetch('http://localhost:3000/products')
        const products = await response.json()
        return products
     }
}


class App{
    static async Init(){
        let productList=new ProductList()
        let htmlProducts = await productList.render()
        // console.log((htmlProducts));
        let app= document.querySelector('#app')
        app.innerHTML=htmlProducts
    }    
}
let cartDB = {}//
class Cart{

    addProduct(id){
        
        if (cartDB.hasOwnProperty(id)) {
            cartDB[id].quantity +=1
        } else {
            cartDB[id]={quantity:1};
            // console.log(cartDB);
        }

       
        this.render();
    }

     async  render(){
        let cartCont=document.getElementById("cartcont");
        cartCont.innerHTML=" ";
        console.log(cartDB);
        
        for (const index in cartDB) {
            let cart_el=document.createElement("div");
            
            // console.log(index)
            let response=await fetch(`http://localhost:3000/products/${index}`)
            let productDetails= await response.json();
            let cart_el_name=document.createElement("div");
            let cart_el_price=document.createElement("div");
            let cart_el_img=document.createElement("div");
            let cart_el_description=document.createElement("div"); 

            cart_el_name.innerHTML=productDetails.productName;
            cart_el_price.innerHTML=productDetails.productPrice
            cart_el_img.innerHTML=productDetails.productImg
            cart_el_description.innerHTML=productDetails.productDescription;

            let minus=document.createElement("button");
            let plus=document.createElement("button");
            let del=document.createElement("button");

             minus.innerHTML="minus";
             minus.addEventListener("click",()=>{
                if (cartDB[index]["quantity"]==1) {
                    this.deleteCartProduct(index);
                    this.render()
                } else {
                    console.log(index)
                    console.log(cartDB[index])
                    
                    cartDB[index]["quantity"]-=1
                    console.log(cartDB[index]["quantity"])
                    this.render()
                }
             })
             plus.innerHTML="plus";
             plus.addEventListener('click',()=>{
                this.addProduct(index);
                this.render();
             })
             del.innerHTML="delete";
             del.addEventListener("click",()=>{
                this.deleteCartProduct(index);
                this.render();
             })

    


            cart_el.append(cart_el_name,cart_el_price,cart_el_img,minus,plus,del);

       cartCont.appendChild(cart_el);
        }
        let totalCart
    }
    deleteCartProduct(id){
        delete cartDB[id]
    }
    }    
//        this.prePopulate(product)
//        const addToCArt = document.querySelector("#addToCArt")
//        btn.addEventListener('click', (e)=>{
//         e.preventDefault()
        
//         const updatedProduct= new Product().readValues();
//         if(btn.innerText==="Added to Cart"){
//             console.log("added to cart");
//             this.sendUpdate({...addProduct, id})
//            }
//        })

//     }
//     }
// }

App.Init()
// class CustomElement extends HTMLElement{
//     static async Init(){
//         let productList=new ProductList()
//         let htmlProducts = await productList.render()
//         // console.log((htmlProducts));
//         let app= document.querySelector('#app')
//         app.innerHTML=htmlProducts
//     }  
// }
// CustomElement.Init()
// CustomElement.define( "product-item" , CustomElement);

