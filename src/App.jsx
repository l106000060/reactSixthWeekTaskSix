// 外部資源
import { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";

// 內部資源
import logo from "./assets/images/logos/FOCUS-FITNESS-logo-3-long-big.png";

// 取得RHF方法
function App() {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const path = import.meta.env.VITE_API_PATH;

  // 儲存取得的商品資料網路請求API
  const [products, setProducts] = useState([]);
  // 儲存商品細節的商品資料
  const [productDetails, setproductDetails] = useState([]);
  // 儲存商品細節的商品數量增減值
  const [productQty, setProductQty] = useState(1);
  // 儲存商品細節的商品資料
  const [cartProducts, setCartProducts] = useState({});
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
  });

  // 取得商品資料網路請求API
  // 取得購物車列表網路請求API
  useEffect(() => {
    getProducts();
    getCartProducts();
  }, []);

  // 表單提交事件處理函式
  const handleOnSubmit = (data) => {
    console.log(data);
    const userSetOrder = {
      data: {
        user: {
          name: data.userName,
          email: data.userEmail,
          tel: data.userPhone,
          address: data.userAddress,
        },
        message: data.userNote,
      },
    };

    axios
      .post(`${baseUrl}/v2/api/${path}/order`, userSetOrder)
      .then((res) => {
        reset();
        getCartProducts();
        console.log("訂單成立成功");
        console.log(res);
      })
      .catch((err) => {
        console.log("訂單成立失敗");
        console.dir(err);
      });
  };

  // 取得商品資料網路請求API
  function getProducts() {
    axios
      .get(`${baseUrl}/v2/api/${path}/products`)
      .then((res) => {
        setProducts(res.data.products);
        console.log("取得商品成功");
        console.log(res);
      })
      .catch((err) => {
        console.log("取得商品失敗");
        console.dir(err);
      });
  }

  // 加入購物車事件處理函式(網路請求API)
  function handleAddToCart(cartProductId, productQty) {
    const productAddtoCart = {
      data: {
        product_id: cartProductId,
        qty: productQty,
      },
    };
    axios
      .post(`${baseUrl}/v2/api/${path}/cart`, productAddtoCart)
      .then((res) => {
        getCartProducts();
        console.log("商品加入購物車成功");
        console.log(res);
      })
      .catch((err) => {
        console.log("商品加入購物車失敗");
        console.dir(err);
      });
  }

  // 取得購物車列表(網路請求API)
  function getCartProducts() {
    axios
      .get(`${baseUrl}/v2/api/${path}/cart`)
      .then((res) => {
        setCartProducts(res.data.data);
        console.log("取得購物車列表成功");
        console.log(res);
      })
      .catch((err) => {
        console.log("取得購物車列表失敗");
        console.dir(err);
      });
  }

  // 刪除購物車單一商品事件處理函式(網路請求API)
  function handleDelProduct(delProductId) {
    axios
      .delete(`${baseUrl}/v2/api/${path}/cart/${delProductId}`)
      .then((res) => {
        getCartProducts();
        console.log("刪除特定商品成功");
        console.log(res);
      })
      .catch((err) => {
        console.log("刪除特定商品失敗");
        console.dir(err);
      });
  }

  // 刪除購物車全部商品事件處理函式(網路請求API)
  function handleDelAllProducts() {
    axios
      .delete(`${baseUrl}/v2/api/${path}/carts`)
      .then((res) => {
        getCartProducts();
        console.log("刪除全部商品成功");
        console.log(res);
      })
      .catch((err) => {
        console.log("刪除全部商品失敗");
        console.dir(err);
      });
  }

  // 點擊商品詳情按鈕時，帶入詳情頁資料、將商品數量重置為1
  function handleGetProductDetails(productDetails) {
    setproductDetails(productDetails);
    setProductQty(1);
  }

  // 在購物車內，增減購商品數量
  function handleCartProductNum(cartProductId, productId, productQty) {
    if (productQty < 1) return;
    const cartProductNum = {
      data: {
        product_id: productId,
        qty: productQty,
      },
    };
    axios
      .put(`${baseUrl}/v2/api/${path}/cart/${cartProductId}`, cartProductNum)
      .then((res) => {
        getCartProducts();
        console.log("更新特定商品數量成功");
        console.log(res);
      })
      .catch((err) => {
        console.log("更新特定商品數量失敗");
        console.dir(err);
      });
  }

  // JSX
  return (
    <>
      <div className="container">
        <h1 className="text-center mb-4">Focus Fitness</h1>
        {/* 格線系統 */}
        <div className="row mb-11">
          {/* 商品清單區塊 */}
          <div className="col-6">
            <div className="border p-2 rounded-1">
              <h2 className="text-center  mb-3">裝備清單</h2>
              <table className="table mb-0 table-hover table-bg table-color mb-3">
                <thead>
                  <tr>
                    <th scope="col">圖片</th>
                    <th scope="col">名稱</th>
                    <th scope="col">原價</th>
                    <th scope="col">售價</th>
                    <th scope="col">裝備介紹</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length > 0 ? (
                    products.map((product) => (
                      <tr key={product.id}>
                        <th scope="row" className="max-w-210">
                          <img src={product.imageUrl} alt="" />
                        </th>
                        <td>{product.title}</td>
                        <td>{product.origin_price}</td>
                        <td>{product.price}</td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-primary-400 text-grey-900 fs-6 hover-effect"
                            onClick={() => handleGetProductDetails(product)}
                          >
                            更多詳情
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">
                        商品載入中...
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {/* 裝備介紹區塊 */}
          <div className="col-6">
            <div className="border p-2 rounded-1">
              <h2 className="text-center mb-3">裝備介紹</h2>
              {productDetails.title ? (
                <div className="card p-2 bg-white-opacity-20">
                  <img
                    src={productDetails.imageUrl}
                    className="card-img-top max-w-50 mx-auto"
                    alt="..."
                  />
                  <div className="card-body text-white">
                    <h5 className="card-title">
                      {productDetails.title}{" "}
                      <span className="badge bg-primary-600 rounded-pill">
                        {productDetails.category}
                      </span>
                    </h5>
                    <p className="card-text">
                      商品描述：{productDetails.description}
                    </p>
                    <p>商品內容：{productDetails.content}</p>
                    <p>
                      {productDetails.price}元 /
                      <del>{productDetails.origin_price}</del>元
                    </p>
                    {/*商品數量增減按鈕*/}
                    <div className="rounded-pill bg-white-opacity-20 d-flex justify-content-between justify-content-md-center align-items-center max-w-210 my-3">
                      <button
                        className="btn p-2 border-0 text-white fs-2"
                        onClick={() =>
                          setProductQty((preQty) => Math.max(1, preQty - 1))
                        }
                      >
                        -
                      </button>
                      <input
                        className="w-50 fs-5 placeholder-lg text-gray-950 fw-bold lh-sm border-0 bg-transparent input-focus text-cenetr p-2 text-center remove-spin"
                        type="number"
                        value={productQty}
                        onChange={(e) =>
                          setProductQty(Number(e.target.value) || 1)
                        }
                      />
                      <button
                        className="btn p-2 border-0 text-white fs-2"
                        onClick={() => setProductQty((preQty) => preQty + 1)}
                      >
                        +
                      </button>
                    </div>
                    {/*加入購物車按鈕*/}
                    <button
                      type="button"
                      className="btn btn-primary-400 text-grey-900 fs-6 hover-effect w-100 mb-3"
                      onClick={() =>
                        handleAddToCart(productDetails.id, productQty)
                      }
                    >
                      加入購物車
                    </button>
                    {/*更多圖片*/}
                    <p>更多圖片：</p>
                    <div className="d-flex flex-wrap">
                      {productDetails.imagesUrl.map((url, index) => {
                        return <img src={url} key={index} className="w-50" />;
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-center">
                  點擊「更多詳情」按鈕，查看裝備介紹
                </p>
              )}
            </div>
          </div>
        </div>
        {/* 購物車列表區塊 */}
        <div className=" border p-2 rounded-1 mb-11">
          <div>
            <h2 className="text-center  mb-3">購物車</h2>
          </div>
          {/* 刪除全部商品按鈕 */}
          {cartProducts.carts?.length > 0 ? (
            <table className="table mb-0 table-hover table-bg table-color mb-3">
              <thead>
                <tr>
                  <th scope="col">圖片</th>
                  <th scope="col">名稱</th>
                  <th scope="col">數量</th>
                  <th scope="col">單價</th>
                  <th scope="col">刪除按鈕</th>
                </tr>
              </thead>
              <tbody>
                {cartProducts.carts?.map((cartProduct) => (
                  <tr key={cartProduct.product.id}>
                    <th scope="row" className="max-w-210">
                      <img
                        src={cartProduct.product.imageUrl}
                        alt=""
                        className="w-50"
                      />
                    </th>
                    <td>{cartProduct.product.title}</td>
                    <td>
                      {/*商品數量增減按鈕*/}
                      <div className="rounded-pill bg-white-opacity-20 d-flex justify-content-between justify-content-md-center align-items-center max-w-210 my-3">
                        <button
                          className="btn p-2 border-0 text-white fs-2"
                          onClick={() =>
                            handleCartProductNum(
                              cartProduct.id,
                              cartProduct.product.id,
                              cartProduct.qty - 1,
                            )
                          }
                        >
                          -
                        </button>
                        <input
                          className="w-50 fs-5 placeholder-lg text-gray-950 fw-bold lh-sm border-0 bg-transparent input-focus text-cenetr p-2 text-center remove-spin"
                          type="number"
                          value={cartProduct.qty}
                          onChange={(e) =>
                            setProductQty(Number(e.target.value) || 1)
                          }
                        />
                        <button
                          className="btn p-2 border-0 text-white fs-2"
                          onClick={() =>
                            handleCartProductNum(
                              cartProduct.id,
                              cartProduct.product.id,
                              cartProduct.qty + 1,
                            )
                          }
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>{cartProduct.total}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-danger-dark text-grey-900 fs-6 hover-effect"
                        onClick={() => {
                          handleDelProduct(cartProduct.id);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          class="bi bi-trash3-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td>
                    {/* 刪除購物車內全部商品按鈕 */}
                    <div>
                      <button
                        type="button"
                        className="btn btn-danger-dark text-grey-900 fs-6 hover-effect"
                        onClick={handleDelAllProducts}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          class="bi bi-trash3-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                        </svg>
                        <span className="ms-2">刪除全部商品</span>
                      </button>
                    </div>
                  </td>
                  <td colSpan="4" className="text-end fs-4">
                    {`總計：${cartProducts.total}`}
                  </td>
                </tr>
              </tfoot>
            </table>
          ) : (
            <div className="text-center text-primary-400">
              <h2 className="mb-2">您的購物車目前無任何商品</h2>
              <h3>立即前往購物</h3>
            </div>
          )}
        </div>
        {/* 收件人資料結帳表單 */}
        <div className="mb-4 mb-sm-8 container px-0   border p-2 rounded-1">
          <div>
            <h2 className="text-center  mb-3">收件人資料</h2>
          </div>
          {/* 表單 */}
          <form className="p-6 p-xl-8" onSubmit={handleSubmit(handleOnSubmit)}>
            {/* 姓名 */}
            <div className="mb-8">
              <label htmlFor="userName" className="form-label">
                姓名<span className="must">*</span>
              </label>
              <input
                {...register("userName", {
                  required: "使用者名稱為必填",
                })}
                type="text"
                className={`form-control ${errors.userName && "is-invalid"}`}
                id="userName"
                placeholder="請輸入姓名"
              />
              {errors.userName && (
                <div className="invalid-feedback text-primary-400">
                  {errors?.userName?.message}
                </div>
              )}
            </div>

            {/* 信箱 */}
            <div className="mb-8">
              <label htmlFor="userEmail" className="form-label fs-8">
                信箱<span className="must">*</span>
              </label>
              <input
                {...register("userEmail", {
                  required: "電子郵件為必填",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "請輸入正確的電子郵件格式",
                  },
                })}
                type="email"
                className="form-control is-invalid"
                id="userEmail"
                placeholder="請輸入聯絡信箱，例如example@gmail.com"
              />
              {errors.userEmail && (
                <div className="invalid-feedback text-primary-400">
                  {errors?.userEmail?.message}
                </div>
              )}
            </div>
            {/* 電話 */}
            <div className="mb-8">
              <label htmlFor="userPhone" className="form-label">
                連絡電話<span className="must">*</span>
              </label>
              <input
                {...register("userPhone", {
                  required: "連絡電話為必填",
                  pattern: {
                    value: /^(0[2-8]\d{7}|09\d{8})$/,
                    message: "請輸入正確的手機號碼",
                  },
                  minLength: { value: 10, message: "手機號碼長度不足" },
                  maxLength: { value: 11, message: "手機號碼長度過長" },
                })}
                type="tel"
                className="form-control is-invalid"
                id="userPhone"
                placeholder="請輸入手機號碼"
              />
              {errors.userPhone && (
                <div className="invalid-feedback text-primary-400">
                  {errors?.userPhone?.message}
                </div>
              )}
            </div>
            {/* 地址 */}
            <div className="mb-8">
              <label htmlFor="userAddress" className="form-label">
                地址<span className="must">*</span>
              </label>
              <input
                {...register("userAddress", {
                  required: "地址為必填",
                  minLength: { value: 10, message: "地址長度過短" },
                })}
                type="text"
                className="form-control is-invalid"
                id="inputAddres"
                placeholder="請輸入完整配送地址，例如台北市信義區信義路100號1樓"
              />
              {errors.userAddress && (
                <div className="invalid-feedback text-primary-400">
                  {errors?.userAddress?.message}
                </div>
              )}
            </div>
            {/* 備註欄 */}
            <div className="mb-8">
              <label htmlFor="userNote" className="form-label">
                備註欄
              </label>
              <textarea
                {...register("userNote")}
                className="form-control"
                type="text"
                id="userNote"
                placeholder="備註內容"
                rows="8"
              ></textarea>
            </div>
            {/* 表單提交按鈕 */}
            <div className="text-center">
              <button
                className="btn btn-primary-400 text-grey-900 fs-6 hover-effect w-100"
                type="submit"
              >
                結帳
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

// export default App;
