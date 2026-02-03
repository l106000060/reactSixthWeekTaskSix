// 外部資源
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Modal } from "bootstrap";
import { useForm } from "react-hook-form";
import Loading from "../component/loading";

// 內部資源
import logo from "../assets/images/logos/FOCUS-FITNESS-logo-3-long-big.png";

function Login() {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const path = import.meta.env.VITE_API_PATH;


    



  const modalInputValue = {
    imageUrl: "",
    title: "",
    category: "",
    unit: "",
    origin_price: "",
    price: "",
    description: "",
    content: "",
    is_enabled: 0,
    imagesUrl: [""],
  };

  const [isAuth, setIsAuth] = useState(false);
  const [products, setProducts] = useState([]);
  const [productData, setproductData] = useState(modalInputValue);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [modalCategory, setmodalCategory] = useState(null);
  const productsModalRef = useRef(null);
  const delproductsModalRef = useRef(null);
  const productsModalRefIns = useRef(null);
  const delproductsModalRefIns = useRef(null);
  // 判斷載入動畫
  const [allPageLoading, setAllPageLoading] = useState(true);

  const authorization = () => {
    // 從cookie取得token
    const autoken = document.cookie.replace(
      /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
      "$1",
    );

    //App.css
    if (autoken) {
      // 將tokens放入headers
      axios.defaults.headers.common["Authorization"] = autoken;
      checkLogin();
    }else {
    setAllPageLoading(false); // 沒登入直接關掉 loading
  }
  };

  useEffect(() => {
    authorization();
 
  }, []);


  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
  });

    // 表單提交事件處理函式
  const handleLoginSubmit = async (data) => {

    const login = {
      "username": data.userLoginEmail,
      "password": data.userLoginPassword
    }
         
  try {
      // 取得登入api
      const res = await axios.post(`${baseUrl}/v2/admin/signin`, login);
      const { token, expired } = res.data;
      const expireDate = new Date(expired).toUTCString();
      // 將token存入cookie
      document.cookie = `token=${token}; expires=${expireDate}`;
      // 權限
      authorization();
      // 驗證登入
      checkLogin();
    } catch (error) {
      console.log(error);
      alert("登入失敗");
    }
  
  }


  // 取得所有商品
  const getAllProducts = async () => {
    setLoadingProducts(true);
    try {
      const allProductRes = await axios.get(
        `${baseUrl}/v2/api/${path}/admin/products`,
      );
      setProducts(allProductRes.data.products);
      setLoadingProducts(false);
    } catch (error) {
      console.log(error);
    }
  };

  // 驗證登入
  const checkLogin = async () => {
    try {
      await axios.post(`${baseUrl}/v2/api/user/check`);

      // 判斷顯示登入頁面或商品列表頁
      setIsAuth(true);
      //取得商品api、loading
      getAllProducts();
    } catch (error) {
      console.log(error);
    } finally {
      setAllPageLoading(false); // 驗證結束，Loding 動畫結束
    }
  };

  // 新增商品功能
  const addProducts = async () => {
    try {
      await axios.post(`${baseUrl}/v2/api/${path}/admin/product`, {
        data: {
          ...productData,
          origin_price: Number(productData.origin_price),
          price: Number(productData.price),
          is_enabled: productData.is_enabled ? 1 : 0,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  // 修改商品功能
  const editProducts = async () => {
    try {
      await axios.put(
        `${baseUrl}/v2/api/${path}/admin/product/${productData.id}`,
        {
          data: {
            ...productData,
            origin_price: Number(productData.origin_price),
            price: Number(productData.price),
            is_enabled: productData.is_enabled ? 1 : 0,
          },
        },
      );
    } catch (error) {
      console.log(error);
    }
  };

  // 刪除商品功能
  const delProduct = async () => {
    try {
      await axios.delete(
        `${baseUrl}/v2/api/${path}/admin/product/${productData.id}`,
      );
    } catch (error) {
      console.log(error);
    }
  };

  // 取得modal的DOM節點
  useEffect(() => {
    productsModalRefIns.current = new Modal(productsModalRef.current);
    delproductsModalRefIns.current = new Modal(delproductsModalRef.current);
  }, []);

  // 編輯、新增商品modal
  const handleOpenProductsModal = (category, product) => {
    setmodalCategory(category);

    if (category === "edit" && product) {
      setproductData({ ...product });
    } else {
      setproductData({ ...modalInputValue });
    }

    productsModalRefIns.current.show();
  };

  const handleCloseProductsModal = () => {
    productsModalRefIns.current.hide();
  };

  const handleProductData = (e) => {
    const { value, name, checked, type } = e.target;

    setproductData({
      ...productData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageEdit = (e, index) => {
    const { value } = e.target;
    const newImages = [...productData.imagesUrl];
    newImages[index] = value;
    setproductData({
      ...productData,
      imagesUrl: newImages,
    });
  };

  // 新增圖片按鈕事件處理函式。
  const handleAddImage = () => {
    const newImages = [...productData.imagesUrl, ""];

    setproductData({
      ...productData,
      imagesUrl: newImages,
    });
  };

  // 刪除圖片按鈕事件處理函式
  const handleDelImage = () => {
    const newImages = [...productData.imagesUrl];

    newImages.pop();

    setproductData({
      ...productData,
      imagesUrl: newImages,
    });
  };

  const handleAddProduct = async () => {
    const apiExchange = modalCategory === "create" ? addProducts : editProducts;
    try {
      await apiExchange();
      getAllProducts();
      handleCloseProductsModal();
    } catch (error) {
      console.log(error);
    }
  };

  // 刪除商品事件處理函式
  const handleDelProduct = async () => {
    try {
      await delProduct();
      getAllProducts();
      handleCloseDelProductsModal();
    } catch (error) {
      console.log("error");
    }
  };

  // 開啟、關閉刪除商品modal
  const handleOpenDelProductsModal = (product) => {
    setproductData(product);
    delproductsModalRefIns.current.show();
  };

  const handleCloseDelProductsModal = () => {
    delproductsModalRefIns.current.hide();
  };

  return (
    <>
      {allPageLoading ? (
        <Loading />
      ) : isAuth ? (
        // 商品清單
        <div className="container">
          <h1 className="text-center mb-4">Focus Fitness</h1>
          {/* 格線系統 */}
          <div className="row">
            {/* 商品清單區塊 */}
            <div className="col">
              <div className="border p-2 rounded-1">
                <h2 className="text-center  mb-3">商品清單</h2>

                <table className="table mb-0 table-hover table-bg table-color mb-3">
                  <thead>
                    <tr>
                      <th scope="col">裝備</th>
                      <th scope="col">原價</th>
                      <th scope="col">售價</th>
                      <th scope="col">是否上架</th>
                      <th scope="col" className="text-end">
                        <button
                          type="button"
                          className="btn btn-success-dark text-white fs-6 hover-effect"
                          onClick={() => handleOpenProductsModal("create")}
                        >
                          建立新商品
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingProducts ? (
                      <tr>
                        <td colSpan="5" className="text-center">
                          <Loading />
                        </td>
                      </tr>
                    ) : products.length > 0 ? (
                      products.map((product) => (
                        <tr key={product.id}>
                          <th scope="row">{product.title}</th>
                          <td>{product.origin_price}</td>
                          <td>{product.price}</td>
                          <td>
                            {product.is_enabled ? (
                              <span>上架</span>
                            ) : (
                              <span className="text-danger-normal">下架</span>
                            )}
                          </td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-primary-400 text-grey-900 fs-6 hover-effect me-2"
                              onClick={() =>
                                handleOpenProductsModal("edit", product)
                              }
                            >
                              編輯
                            </button>
                            <button
                              type="button"
                              className="btn btn-danger-normal text-white fs-6 hover-effect"
                              onClick={() =>
                                handleOpenDelProductsModal(product)
                              }
                            >
                              刪除
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center">
                          尚無商品
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // 登入頁
        <div className="p-5">
          <div className="container text-center bg-white-opacity-20 p-3 rounded-3">
            <div className="row">
              {/*圖片*/}
              <div className="col-6">
                <div className="h-100 d-flex justify-content-center align-items-end login-bg rounded-3">
                  {/*logo*/}
                  <div className="max-w-182 mb-8">
                    <img src={logo} alt="logo" />
                  </div>
                </div>
              </div>
              {/*表單*/}
              <div className="col-6 pt-107 pb-107">
                <div>
                  {/*標題*/}
                  <div className="text-start mb-7">
                    <h2 className="fs-7 fw-bold mb-3 text-primary-400">
                      / Log in /
                    </h2>
                    <h2 className="fs-2 fw-bold lh-sm">會員登入</h2>
                  </div>
                  <form onSubmit={handleSubmit(handleLoginSubmit)}>
                    <div className="mb-3 text-start">
                      <label
                        htmlFor="exampleInputEmail1"
                        className="form-label"
                      >
                        帳號<span className="text-danger-normal">*</span>
                      </label>
                      <input
                          {...register("userLoginEmail", {
                        required: "電子郵件為必填",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "請輸入正確的電子郵件格式",
                        },
                        })}                                
                        type="email"
                        className={`form-control ${errors.userLoginEmail && "is-invalid"}`}
                        id="userLoginEmail"
                        aria-describedby="emailHelp"
                         placeholder="請輸入聯絡信箱，例如example@gmail.com"
                      />
                        {errors.userLoginEmail && (
                        <div className="invalid-feedback text-primary-400">
                          {errors?.userLoginEmail?.message}
                        </div>
                        )}
                    </div>
                    <div className="mb-3 text-start">
                      <label
                        htmlFor="exampleInputPassword1"
                        className="form-label"
                      >
                        密碼<span className="text-danger-normal">*</span>
                      </label>
                      <input
                        {...register("userLoginPassword", {
                          required: "密碼為必填",
                        })}
                        type="password"
                        className={`form-control ${errors.userLoginPassword && "is-invalid"}`}
                        id="userLoginPassword"
                        placeholder="請輸入密碼"
                      />
                       {errors.userLoginPassword && (
                        <div className="invalid-feedback text-primary-400">
                          {errors?.userLoginPassword?.message}
                        </div>
                      )}
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary-400 w-100 pt-3 pb-3 fs-7 fw-bold"
                    >
                      登入
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* 新增、編輯商品modal */}
      <div className="modal " tabIndex="-1" ref={productsModalRef}>
        <div className="modal-dialog modal-xl">
          <div className="modal-content bg-blue-900 border-white text-white">
            {/* modal header */}
            <div className="modal-header border-white">
              <h5 className="modal-title">
                {modalCategory === "create" ? "新增商品" : "編輯商品"}
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                aria-label="Close"
                onClick={handleCloseProductsModal}
              ></button>
            </div>

            {/* modal body */}
            <div className="modal-body">
              <div className="row">
                {/* 商品圖片 */}
                <div className="col-4">
                  {/* 首圖 */}
                  <div className="mb-3">
                    <label
                      htmlFor="exampleFormControlInput1"
                      className="form-label"
                    >
                      請輸入首圖網址
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="cover-image"
                      placeholder="請輸入首圖網址"
                      name="imageUrl"
                      value={productData.imageUrl}
                      onChange={handleProductData}
                    />
                    {productData.imageUrl && (
  <img
    src={productData.imageUrl}
    alt="商品"
    className="img-fluid"
  />
)}
                  </div>
                  {/* 其他圖片 */}
                  <div>
                    {productData.imagesUrl?.map((image, index) => (
                      <div key={index} className="mb-2">
                        <label
                          htmlFor={`imagesUrl-${index + 1}`}
                          className="form-label"
                        >
                          圖片網址 {index + 1}
                        </label>
                        <input
                          type="text"
                          className="form-control mb-2"
                          id={`imagesUrl-${index + 1}`}
                          placeholder={`圖片網址 ${index + 1}`}
                          value={image}
                          onChange={(e) => handleImageEdit(e, index)}
                        />
                        {image && (
                          <img
                            src={image}
                            alt={`圖片 ${index + 1}`}
                            className="img-fluid mb-2"
                          />
                        )}
                      </div>
                    ))}
                    <div>
                      {productData.imagesUrl.length < 5 &&
                        productData.imagesUrl[
                          productData.imagesUrl.length - 1
                        ] !== "" && (
                          <button
                            type="button"
                            className="btn btn-primary-400 text-grey-900 fs-6 hover-effect me-2"
                            onClick={handleAddImage}
                          >
                            新增圖片
                          </button>
                        )}
                      {productData.imagesUrl.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-danger-normal text-white fs-6 hover-effect"
                          onClick={handleDelImage}
                        >
                          取消圖片
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                {/* 商品內容 */}
                <div className="col-8">
                  <div className="mb-3">
                    <label
                      htmlFor="exampleFormControlInput1"
                      className="form-label"
                    >
                      標題
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="title"
                      placeholder="請輸入商品標題"
                      name="title"
                      value={productData.title}
                      onChange={handleProductData}
                    />
                  </div>

                  <div className="row">
                    <div className="col-3">
                      <div className="mb-3">
                        <label
                          htmlFor="exampleFormControlInput1"
                          className="form-label"
                        >
                          分類
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="category"
                          placeholder="請輸入商品分類"
                          name="category"
                          value={productData.category}
                          onChange={handleProductData}
                        />
                      </div>
                    </div>
                    <div className="col-3">
                      <div className="mb-3">
                        <label
                          htmlFor="exampleFormControlInput1"
                          className="form-label"
                        >
                          單位
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="unit"
                          placeholder="請輸入商品單位"
                          name="unit"
                          value={productData.unit}
                          onChange={handleProductData}
                        />
                      </div>
                    </div>
                    <div className="col-3">
                      <div className="mb-3">
                        <label
                          htmlFor="exampleFormControlInput1"
                          className="form-label"
                        >
                          原價
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="origin_price"
                          placeholder="請輸入商品原價"
                          name="origin_price"
                          value={productData.origin_price}
                          onChange={handleProductData}
                        />
                      </div>
                    </div>
                    <div className="col-3">
                      <div className="mb-3">
                        <label
                          htmlFor="exampleFormControlInput1"
                          className="form-label"
                        >
                          售價
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="price"
                          placeholder="請輸入商品售價"
                          name="price"
                          value={productData.price}
                          onChange={handleProductData}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor="exampleFormControlInput1"
                      className="form-label"
                    >
                      描述
                    </label>
                    <textarea
                      type="text"
                      className="form-control"
                      id="description"
                      placeholder="請輸入商品描述"
                      name="description"
                      value={productData.description}
                      onChange={handleProductData}
                    />
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor="exampleFormControlInput1"
                      className="form-label"
                    >
                      內容
                    </label>
                    <textarea
                      type="text"
                      className="form-control"
                      id="content"
                      placeholder="請輸入商品內容"
                      name="content"
                      value={productData.content}
                      onChange={handleProductData}
                    />
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={productData.is_enabled}
                      onChange={handleProductData}
                      id="isEnabled"
                      name="is_enabled"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="flexCheckDefault"
                    >
                      是否上架
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* modal footer */}
            <div className="modal-footer border-white">
              <button
                type="button"
                className="btn btn-primary-400 text-grey-900 fs-6 hover-effect me-2"
                onClick={handleAddProduct}
              >
                確認
              </button>
              <button
                type="button"
                className="btn btn-danger-normal text-white fs-6 hover-effect"
                onClick={handleCloseProductsModal}
              >
                取消
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* 刪除商品modal */}
      <div className="modal" tabIndex="-1" ref={delproductsModalRef}>
        <div className="modal-dialog">
          <div className="modal-content bg-blue-900 border-white text-white">
            <div className="modal-header">
              <h5 className="modal-title">刪除商品</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                aria-label="Close"
                onClick={handleCloseDelProductsModal}
              ></button>
            </div>
            <div className="modal-body">
              <p>確定要刪除商品嗎?</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary-400 text-grey-900 fs-6 hover-effect me-2"
                onClick={handleDelProduct}
              >
                確認
              </button>
              <button
                type="button"
                className="btn btn-danger-normal text-white fs-6 hover-effect"
                onClick={handleCloseDelProductsModal}
              >
                取消
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
