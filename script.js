console.log("Script is running.");
const categoryListElem = document.querySelector("div.category-list");
if (categoryListElem != undefined) {
  function fetchCategories() {
    fetch("https://kea-alt-del.dk/t7/api/categories")
      .then((resp) => resp.json()) // extract json - we don't care about the rest of the response.
      .then((categories) => categories.forEach(createCategory));
  }
  console.log("Category list detected.");
  // here I hard code the number of categories
  //   const categories = [{ category: "Accessories" }, { category: "Apparel" }, { category: "Footwear" }, { category: "Free Items" }, { category: "Personal Care" }, { category: "Sporting Goods" }];

  function createCategory(category) {
    // find category template in DOM
    const categoryListItemTemplate = document.querySelector("#category-list-item-template").content;
    // clone the content of the template so we can start filling it out
    const clone = categoryListItemTemplate.cloneNode(true);
    // find the acnhor (a) element in the template clone, so we can start setting it up
    const categoryLink = clone.querySelector("a");
    // overwrite the hyperlink (where the link points) of the anchor element
    // we add a querystring parameter (after ?-mark) called "category" to use for product filtering on the product list site
    categoryLink.href = "product_list.html?category=" + category.category;
    // overwrite the text of the anchor element
    categoryLink.text = category.category;
    // add the template clone to the dom, by adding it as a child to
    // the category list element, so it is shown on the page.
    categoryListElem.appendChild(clone);
  }
  fetchCategories();
}

const productListElem = document.querySelector("div.product-list");
if (productListElem != undefined) {
  function fetchProducts() {
    // here we filter on category if we can find one in the url (querystring)
    const categoryParam = new URLSearchParams(window.location.search).get("category");
    let categoryFilter = "";
    if (categoryParam != null) categoryFilter = "&category=" + categoryParam;
    // this is the end of the category filter code

    fetch("https://kea-alt-del.dk/t7/api/products?limit=150" + categoryFilter)
      .then((resp) => resp.json()) // extract json - we con't care about the rest of the response.
      .then((products) => products.forEach(createProduct));
  }
  console.log("Product list detected on category .");

  function createProduct(product) {
    // find category template in DOM
    const productListItemTemplate = document.querySelector("#product-list-item-template").content;
    // clone the content of the template so we can start filling it out
    const clone = productListItemTemplate.cloneNode(true);
    // let's fill the template with product data
    clone.querySelector(".product-title").textContent = product.productdisplayname + " | $" + product.price;
    // add product id to product link
    const anchorElem = clone.querySelector("a");
    anchorElem.href = "product.html?productid=" + product.id;
    // sold out?
    const prodImgElem = clone.querySelector(".product-list-image");
    prodImgElem.src = "https://kea-alt-del.dk/t7/images/webp/640/" + product.id + ".webp";
    if (product.soldout == 1) prodImgElem.classList.add("product-sold-out");
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

// this is the URL to fetch a single product
// https://kea-alt-del.dk/t7/api/products/1163

const itemParam = new URLSearchParams(window.location.search).get("category");
let itemFilter = "";
if (itemParam != null) itemFilter = "&category=" + itemParam;
// this is the end of the category filter code

fetch("https://kea-alt-del.dk/t7/api/products/1163" + itemFilter)
  .then((resp) => resp.json()) // extract json - we con't care about the rest of the response.
  .then((product) => product.forEach(createProduct));

console.log("Hver product detected");
