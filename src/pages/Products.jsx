// 外部資源
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ThreeCircles } from "react-loader-spinner";
import Loading from "../component/loading";

const baseUrl = import.meta.env.VITE_BASE_URL;
const path = import.meta.env.VITE_API_PATH;

function Products() {
  // 儲存取得的商品資料網路請求API
  const [products, setProducts] = useState([]);
  // 判斷載入動畫
  // const [loading, setloading] = useState(true);

  // 取得商品資料網路請求API
  useEffect(() => {
    getProducts();
  }, []);

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

  return (
    <>
      <div className="container">
        {/* 商品清單區塊 */}

        {products.length > 0 ? (
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
                        <Link
                          to={`/products/${product.id}`}
                          className="btn btn-primary-400 text-grey-900 fs-6 hover-effect"
                        >
                          更多詳情
                        </Link>
                        {/* <button
                        type="button"
                        className="btn btn-primary-400 text-grey-900 fs-6 hover-effect"
                        onClick={() => handleGetProductDetails(product)}
                      >
                        更多詳情
                      </button> */}
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
        ) : (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "100vh" }}
          >
            <Loading />
          </div>
        )}
      </div>
    </>
  );
}

export default Products;
