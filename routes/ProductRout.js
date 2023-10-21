import exprees from "express";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";
import {
  CreateProductController,
  GetProductController,
  GetSingleProductController,
  PhotoProductController,
  ProductCountControler,
  ProductFilterControler,
  ProductListController,
  ProductcategoryRoute,
  braintreeTokenController,
  braintreepaymentgetway,
  deletProductController,
  relatedProductController,
  searchProductControler,
  updateProductController,
} from "../controllers/ProductController.js";
import formidable from "express-formidable";

const router = exprees.Router();

// createProduct
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  CreateProductController
);

// updateproduct
router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController
);

// get Products
router.get("/get-product", GetProductController);

//get Single Products
router.get("/get-product/:slug", GetSingleProductController);

// get Photo Controler

router.get("/photo-product/:pid", PhotoProductController);
//Delet Product

router.delete("/delet-product/:pid", deletProductController);

//Filter Route

router.post("/Product-filter", ProductFilterControler);

// Product Count Controller
router.get("/Product-count", ProductCountControler);

// product list router 
router.get('/product_list/:page',ProductListController);

router.get('/search/:keyword',searchProductControler);

//similler Product
router.get("/related-Product/:pid/:cid",relatedProductController);

router.get("/Product-category/:slug",ProductcategoryRoute );
// Payment Route
//token 
router.get("/braintree/token",braintreeTokenController);
//paymentgetway
router.post('/braintree/payment',requireSignIn,braintreepaymentgetway);

export default router;
