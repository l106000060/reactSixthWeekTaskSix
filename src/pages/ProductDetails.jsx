// 外部資源
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

const baseUrl = import.meta.env.VITE_BASE_URL;
const path = import.meta.env.VITE_API_PATH;

function ProductDetails() {
  // 拿到網址動態參數
  const { urlProductId } = useParams();

  // 儲存商品細節的商品資料
  const [productDetails, setproductDetails] = useState([]);
  // 儲存商品細節的商品數量增減值
  const [productQty, setProductQty] = useState(1);

  // 取得商品資料網路請求API
  // 取得購物車列表網路請求API
  useEffect(() => {
    getSpecificProduct();
  }, [urlProductId]);

  // 取得特定商品資料網路請求API
  function getSpecificProduct() {
    axios
      .get(`${baseUrl}/v2/api/${path}/product/${urlProductId}`)
      .then((res) => {
        setproductDetails(res.data.product);
        console.log("取得特定商品成功");
        console.log(res);
      })
      .catch((err) => {
        console.log("取得特定商品失敗");
        console.dir(err);
      });
  }

  // 加入購物車事件處理函式(網路請求API)
  function handleAddToCart(cartProductId, productQty) {
    const productAddtoCart = {
      data: {
        product_id: cartProductId,
        qty: productQty,
        test123: 123456,
      },
    };
    axios
      .post(`${baseUrl}/v2/api/${path}/cart`, productAddtoCart)
      .then((res) => {
        toast.success("加入購物車成功！", {
          className: "my-toast",
          icon: "🛒",
        });
        console.log("商品加入購物車成功");
        console.log(res);
      })
      .catch((err) => {
        console.log("商品加入購物車失敗");
        console.dir(err);
      });
  }

  return (
    <>
      <div className="container">
        {/* 裝備介紹區塊 */}

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
                    onChange={(e) => setProductQty(Number(e.target.value) || 1)}
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
                  onClick={() => handleAddToCart(productDetails.id, productQty)}
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
            <p className="text-center text-primary-400">商品載入中...</p>
          )}
        </div>
      </div>
    </>
  );
}

export default ProductDetails;
