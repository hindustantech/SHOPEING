import slugify from "slugify";
import productModle from "../models/ProductModel.js";
import fs from "fs";
import OrderModel from "../models/OrderModel.js";
import braintree from "braintree";
import categoryModel from "./../models/categoryModel.js";
import dotenv from 'dotenv';

dotenv.config();


//Payment Getway
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

export const CreateProductController = async (req, res) => {
  try {
    const { name, slug, decs, price, category, quantity, shpping } = req.fields;
    const { photo } = req.files;
    if (!name) {
      return res.status(500).send({ error: "Name is Required" });
    } else if (!decs) {
      return res.status(500).send({ error: "Decs is Required" });
    } else if (!price) {
      return res.status(500).send({ error: "Price is Required" });
    } else if (!category) {
      return res.status(500).send({ error: "Category is Required" });
    } else if (!quantity) {
      return res.status(500).send({ error: "Quantity is Required" });
    } else if (!photo || photo.size > 1000000) {
      return res.status(500).send({
        error: "Photo is required, and its size should be less than 1MB",
      });
    }
    const products = new productModle({ ...req.fields, slug: slugify(name) });
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    res.status(201).send({
      success: true,
      message: "Products Created  Successfully",
      products,
    });
    await products.save();
  } catch (error) {
    
    res.status(500).send({
      success: false,
      error,
      message: "Error in Creating Product ",
    });
  }
};

//updateProduct
export const updateProductController = async (req, res) => {
  try {
    const { name, decs, price, category, quantity, shipping } = req.fields;
    const { photo } = req.files;
    //alidation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !decs:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is Required and should be less then 1mb" });
    }

    const products = await productModle.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Updated Successfully",
      products,
    });
  } catch (error) {
    
    res.status(500).send({
      success: false,
      error,
      message: "Error in Updte product",
    });
  }
};
//get Product Controller

export const GetProductController = async (req, res) => {
  try {
    const product = await productModle
      .find({})
      .select("-photo")
      .populate("category")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      counTotal: product.length,
      message: "All Products",
      product,
    });
  } catch (error) {
    
    res.status(500).send({
      success: false,
      error,
      message: "Error in get All Product ",
    });
  }
};

//get single Products
export const GetSingleProductController = async (req, res) => {
  try {
    const product = await productModle
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.status(200).send({
      success: true,
      message: "All Products",
      product,
    });
  } catch (error) {
    
    res.status(500).send({
      success: false,
      error,
      message: "Error in  Singal Product ",
    });
  }
};

//get Photo Product contoller
export const PhotoProductController = async (req, res) => {
  try {
    const product = await productModle.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      res.set("content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    
    res.status(500).send({
      success: false,
      error,
      message: "Error in Photot Product ",
    });
  }
};
// Delet Product Controler

export const deletProductController = async (req, res) => {
  try {
    await productModle.findByIdAndDelete(req.params.pid).select("-photo");
    res.status(200).send({
      success: true,
      message: "Product Delet Successfully ",
    });
  } catch (error) {
    
    res.status(500).send({
      success: false,
      message: "Error While Deleting Product ",
      error,
    });
  }
};

//Filter Product Controller
export const ProductFilterControler = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const product = await productModle.find(args);
    res.status(200).send({
      success: true,
      product,
    });
  } catch (error) {
    
    res.status(400).send({
      success: false,
      message: "Error  While Filtering  Products ",
      error,
    });
  }
};

// product Count Controller

export const ProductCountControler = async (req, res) => {
  try {
    const total = await productModle.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      message: "Success",
      total,
    });
  } catch (error) {
    
    res.status(400).send({
      success: false,
      message: "Error in Pagenamtions",
      error,
    });
  }
};

export const ProductListController = async (req, res) => {
  try {
    const Perpage = 6;
    const page = req.params.page ? req.params.page : 1;
    const product = await productModle
      .find({})
      .select("-photo")
      .skip((page - 1) * Perpage)
      .limit(Perpage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      product,
    });
  } catch (error) {
    
    res.status(400).send({
      success: false,
      message: "Error  in per Page",
    });
  }
};

export const searchProductControler = async (req, res) => {
  try {
    const { keyword } = req.params;
    const results = await productModle
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { decs: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    res.json(results);
  } catch (error) {
    
    res.status(400).send({
      success: false,
      message: "Error in searche filter",
      error,
    });
  }
};

export const relatedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const product = await productModle
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-photo")
      .limit(6)
      .populate("category");
    res.status(200).send({
      success: true,
      product,
    });
  } catch (error) {
    
    res.status(400).send({
      success: false,
      message: "Error While going",
      error,
    });
  }
};

export const ProductcategoryRoute = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const products = await productModle.find({ category }).populate("category");
    res.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (error) {
    
    res.status(500).send({
      success: true,
      error,
      message: "Error While geating Product Error",
    });
  }
};

// PaymentGetway Api
//Token
export const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    
  }
};

// Paymentgetway

export const braintreepaymentgetway = async (req, res) => {
  try {
    const {Cart, nonce} = req.body;
    let total = 0;
    Cart.map((i) => { 
      total += i.price;
    });
    let newTransaction=gateway.transaction.sale({
      amount:total,
      paymentMethodNonce:nonce,
      options:{
        submitForSettlement:true,
      } 
    },
      function(error,result){
        if(result){
          const order=new OrderModel({
            products:Cart,
            payment:result,
            buyers:req.user._id
          }).save();
          res.json({ok:true})
        }
        else{
          res.status(500).send(error)
        }
      }
    )
  } catch (error) {
    
  }
};
