console.log("Script is running.");

// ----------------- CATEGORY LIST -------------------
const categoryListElem = document.querySelector("div.category-list");
if (categoryListElem != undefined) {
  function fetchCategories() {
    fetch("https://kea-alt-del.dk/t7/api/categories")
      .then((resp) => resp.json()) // extract json - we don't care about the rest of the response.
      .then((categories) => categories.forEach(createCategory));
  }
  console.log("Category list detected.");

  function createCategory(category) {
    // find category template in DOM
    const categoryListItemTemplate = document.querySelector("#category-list-item-template").content;
    // clone the content of the template so we can start filling it out
    const clone = categoryListItemTemplate.cloneNode(true);
    // find the acnhor (a) element in the template clone, so we can start setting it up
    const categoryItem = clone.querySelector("div.category-item");

    categoryItem.textContent = category.category;
    // add the template clone to the dom, by adding it as a child to
    // the category list element, so it is shown on the page.

    var button = clone.querySelector(".category-button");
    button.addEventListener("click", function () {
      window.location.href = `product_list.html?cat=${category.category}`;
    });

    categoryListElem.appendChild(clone);
  }
  fetchCategories();
}

// ----------------- PRODUCT LIST -------------------
const productListElem = document.querySelector("div.product-list");
if (productListElem != undefined) {
  function fetchProducts() {
    // here we filter on category if we can find one in the url (querystring after "?")
    // http://127.0.0.1:5500/product_list.html?category=Apparel
    const categoryParam = new URLSearchParams(window.location.search).get("cat");
    let categoryFilter = "";
    if (categoryParam != null) categoryFilter = "&category=" + categoryParam;
    // this is the end of the category filter code
    // if category queryParameter exists in the querystring, we will add a category filter in the
    // request to the product webservice. The filter will be added by introducing a queryparameter called "category"
    fetch("https://kea-alt-del.dk/t7/api/products?limit=150" + categoryFilter)
      .then((resp) => resp.json()) // extract json - we don't care about the rest of the response.
      .then((prods) => prods.forEach(createProd));
  }
  console.log("Product list detected on category .");

  function createProd(product) {
    // find category template in DOM
    const productListItemTemplate = document.querySelector("#product-list-item-template").content;
    // clone the content of the template so we can start filling it out
    const clone = productListItemTemplate.cloneNode(true);
    // let's fill the template with product data
    clone.querySelector(".product-title").textContent = product.productdisplayname + " | $" + product.price;
    //clone.querySelector(".product-title").textContent = `${product.productdisplayname} | $ ${product.price}`;

    // add product id to product link
    const anchorElem = clone.querySelector("a");
    //here we overwrite the link in HTML
    anchorElem.href = "product.html?productid=" + product.id;
    // sold out?
    const prodImgElem = clone.querySelector(".product-list-image");
    prodImgElem.src = "https://kea-alt-del.dk/t7/images/webp/640/" + product.id + ".webp";
    if (product.soldout == 1) {
      prodImgElem.classList.add("product-sold-out"); // make product tranparent if sold out
    } else {
      clone.querySelector(".text-sold-out").classList.add("hide");
    }
    // discount on the product
    const productPriceBand = clone.querySelector(".product-price-band");
    if (product.discount != null) {
      // there is a discount on this product
      productPriceBand.textContent = "-" + product.discount + "%";
    } else {
      productPriceBand.classList.add("hide");
    }

    productListElem.appendChild(clone);
  }
  fetchProducts();
}

// ----------------- PRODUCT DETAILS (Single view) -------------------
// this is the URL to fetch a single product
// https://kea-alt-del.dk/t7/api/products/1163
const productDataElem = document.querySelector("div.product-data");
if (productDataElem != undefined) {
  const productIdParam = new URLSearchParams(window.location.search).get("productid");

  fetch("https://kea-alt-del.dk/t7/api/products/" + productIdParam)
    .then((response) => response.json())
    .then((data) => showProduct(data));

  function showProduct(product) {
    console.log(product);
    document.querySelector(".purchaseBox h3, .name-item").textContent = product.productdisplayname;
    document.querySelector(".name-item").textContent = product.productdisplayname;
    document.querySelector(".purchaseBox p").textContent = product.articletype;
    document.querySelector(".product-information .relid-number").textContent = product.relid;
    document.querySelector(".product-information .color-item").textContent = product.basecolour;
    document.querySelector(".brandname-item").textContent = product.brandname;
    document.querySelector(".brandbio-item").textContent = product.brandbio;
    // breadcrumb
    document.querySelector(".breadcrumb-item").textContent = product.productdisplayname;
    const bcCatLink = document.querySelector(".breadcrumb-cat a");
    bcCatLink.text = product.category;
    bcCatLink.href = `product_list.html?cat=${product.category}`;
  }

  if (productIdParam != undefined) {
    const productImg = productDataElem.querySelector("img");
    productImg.src = "https://kea-alt-del.dk/t7/images/webp/640/" + productIdParam + ".webp";
  }
}
