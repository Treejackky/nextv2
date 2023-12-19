"use client";
import React, { useEffect, useState, useRef } from "react";

type Props = {
  params: any;
};

export default function Index({ params }: Props) {
  const [data, setData] = useState<any[]>([]);
  const [OutleID, setOutletID] = useState<any>(0);
  const [TableID, setTableID] = useState<any>(0);
  const [pkg, setPkg] = useState<any>("");
  const [WaiterID, setWaiterID] = useState<any>(0);
  const [filter, setFilter] = useState<string>("");
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [cart, setCart] = useState<any>([]);
  const [page, setPage] = useState<any>(1);
  const [overlay, setOverlay] = useState<any>(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [countItem, setCountItem] = useState(1);
  const [overlay3, setOverlay3] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<any>(null);
  const [overlay4, setOverlay4] = useState(false);
  const [overlay5, setOverlay5] = useState(false);
  const [overlay6, setOverlay6] = useState(false);
  const [order, setOrder] = useState<any>([]);
  const [ftime, setFTime] = useState<any>(0);
  const [activeSection, setActiveSection] = useState(null);
  const [originalCount, setOriginalCount] = useState(0);

  useEffect(() => {
    getItem(params, OutleID, TableID).then((data) => {
      setData(data.items);
      setOutletID(data.OutletID);
      setTableID(data.TableID);
      setPkg(data.Package);
      setWaiterID(data.WaiterID);
    });
  }, []);

  useEffect(() => {
    if (filter) {
      const filterData = data.filter((item: any) => item.GrpSub === filter);
      // console.log(filterData);
    } else {
      setFilteredData(data);
    }
  }, [data, filter]);

  useEffect(() => {
    let cart_local = localStorage.getItem("cart");
    let storedTime = localStorage.getItem("ftime");
    if (cart_local) {
      setCart(JSON.parse(cart_local!));
    }
    if (!storedTime) {
      setFTime(storedTime);
    }
  }, []);

  useEffect(() => {
    if (selectedItem) {
      const foundItem = cart.find(
        (cartItem: any) => cartItem.ItemCode === selectedItem.ItemCode
      );
      const originalQuantity = foundItem ? foundItem.Quantity : 1;
      setCountItem(originalQuantity);
      setOriginalCount(originalQuantity);
    }
  }, [selectedItem, cart]);

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart!));
    }
    if (cart.length >= 1 && !localStorage.getItem("ftime")) {
      localStorage.setItem("ftime", new Date().toLocaleTimeString());
      let storedTime = localStorage.getItem("ftime");
      setFTime(storedTime);
      // console.log(storedTime);
    }
    if (!cart.length) {
      localStorage.removeItem("cart");
    }
    if (cart.length <= 0) {
      localStorage.removeItem("ftime");
      localStorage.setItem("2ftime", "00:00:00");
      let storedTime = localStorage.getItem("2ftime");
      setFTime(storedTime);
    }
  }, [cart, ftime]);

  const foodimg = [
    "51306",
    "51307",
    "51321",
    "51323",
    "51324",
    ,
    "51325",
    "51327",
    "51328",
    "515020",
    "51317",
    "51318",
    "51320",
    "74134",
    "51353",
    "514005",
    "514007",
    "514002",
    "514003",
    "74101",
    "74108",
    "74117",
    "51337",
    "51338",
    "51339",
    "514008",
    "79152",
    "74118",
    "74119",
    "74129",
    "51347",
    "51348",
    "51350",
    "51351",
    "5973138",
    "75101",
    "75102",
    "75103",
    "75104",
    "75106",
    "75109",
    "75110",
    "75111",
    "75125",
    "79167",
    "74116",
    "75115",
    "75116",
    "75117",
  ];

  const uniqueGrpSubs = Array.from(new Set(data.map((item) => item.GrpSub)));

  useEffect(() => {
    const handleScroll = () => {
      uniqueGrpSubs.forEach((grpSub) => {
        const element = document.getElementById(grpSub);
        if (element) {
          const bounding = element.getBoundingClientRect();
            if (
              bounding.top >= 0 &&
              bounding.bottom <=
                (window.innerHeight || document.documentElement.clientHeight)
            ) {
              setActiveSection(grpSub);
            }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [uniqueGrpSubs]);

  const scrollToPosition = (grpSub: any) => {
    const element = document.getElementById(grpSub);
    setActiveSection(grpSub);

    if (element) {
      const pos = element.getBoundingClientRect();
      window.scrollTo({
        top: pos.top + window.pageYOffset - 40,
        behavior: "smooth",
      });
    }
  };

  const handleItemClick = (item: any) => {
    setSelectedItem(item);
    setOverlay(true);
    // console.log(item);
  };

  const addToCart = (item: any, countItem: any) => {
    setCart((prevCart: any[]) => {
      const existingItemIndex = prevCart.findIndex(
        (cartItem) => cartItem.ItemCode === item.ItemCode
      );

      if (existingItemIndex >= 0) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          Quantity: countItem,
        };
        return updatedCart;
      } else {
        let newItem = {
          OutletID: OutleID,
          TableID: TableID,
          ItemID: item.ItemID,
          ItemCode: item.ItemCode,
          ItemSupp: item.Name,
          UnitPrice: item.UnitPrice,
          Disc: item.Disc,
          Size: item.Size,
          SvcExcl: item.SvcExcl,
          TaxExcl: item.TaxExcl,
          GrpMaster: item.GrpMaster,
          GrpSub: item.GrpSub,
          Quantity: countItem,
          WaiterID: WaiterID,
        };
        return [...prevCart, newItem];
      }
    });
  };

  const isChanged = (e: any) => {
    // console.log(e.target.id);
    if (e.target.id == "menu") {
      return [setPage(1)];
    } else if (e.target.id == "cart") {
      return [setPage(2)];
    } else if (e.target.id == "order") {
      getOrder(TableID, OutleID)
        .then((orderData) => {
          setOrder(orderData.orders);
          // console.log(order);
        })
        .catch((error) => {
          // console.error("Error fetching order data:", error);
        });

      return setPage(3);
    }
  };

  const isPage = () => {
    {
      if (page == 1) {
        return <Menu />;
      } else if (page == 2) {
        return <Cart />;
      } else if (page == 3) {
        return <Order />;
      }
    }
  };

 

  const Menu = () => {
    return (
      <>
      <div className="tableid"><p>โต๊ะ : {TableID}</p></div>
       <div className="header-img">
            <img
              src={`https://posimg.s3.ap-southeast-1.amazonaws.com/header.jpg`}
              alt="Imgfood"
            />
          </div>
          <header>
            <nav>
              {uniqueGrpSubs.map((grpSub) => (
                <button
                  key={grpSub}
                  onClick={() => scrollToPosition(grpSub)}
                  className={activeSection === grpSub ? "active" : ""}
                >
                  <p>{grpSub}</p>
                </button>
              ))}
            </nav>
          </header>
        <div className="main-content">
          {filteredData.map((item, idx) => (
            <button
              onClick={() => handleItemClick(item)}
              className="item"
              id={item.GrpSub}
              key={idx}
            >
              <div className="item-left">
                {foodimg.includes(item.ItemCode) && (
                  <img
                    src={`https://posimg.s3.ap-southeast-1.amazonaws.com/${item.ItemCode}.jpg`}
                    alt="Imgfood"
                  />
                )}
                {!foodimg.includes(item.ItemCode) && (
                  <img
                    src={`https://scontent.fbkk22-8.fna.fbcdn.net/v/t1.18169-9/15171213_1701469426835212_8933784202474239947_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=7a1959&_nc_eui2=AeHp2FqDLoKshdhQeUw5ExIngVz7a8IZt3aBXPtrwhm3dsV2uCgo229usGamJT6xe6e8bLhc0P2Jv5P0MPeTLFo6&_nc_ohc=uRlLMHBCO3AAX8aSm7k&_nc_ht=scontent.fbkk22-8.fna&oh=00_AfDB3yRdRwkzzMGmj4nEY4mfGh4hQWInNJ07IEaVqEwpKQ&oe=65A7657A`}
                    alt="Imgfood"
                  />
                )}
                <div>
                  <p>{item.Name}</p>
                  {/* <p>0.00฿</p> */}
                </div>
              </div>
              <div
                className={`item-right ${
                  cart.some((cartItem:any) => cartItem.ItemCode === item.ItemCode)
                    ? "bg-yellow"
                    : ""
                }`}
              >
                {cart
                  .map((cartItem: any) => cartItem.ItemCode)
                  .includes(item.ItemCode) && (
                  <span>
                    {
                      cart.find(
                        (cartItem: any) => cartItem.ItemCode === item.ItemCode
                      )?.Quantity
                    }
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
        {/* {isBar()} */}
         {isFooter()}
        {overlay && selectedItem && (
          <div className="overlay">
            <div className="modal">
              <div className="modal-header">
                <div className="name">{selectedItem.Name}</div>
              </div>
              <div className="modal-body">
                <div className="modal-img">
                  {foodimg.includes(selectedItem.ItemCode) && (
                    <img
                      src={`https://posimg.s3.ap-southeast-1.amazonaws.com/${selectedItem.ItemCode}.jpg`}
                      alt="Imgfood"
                    />
                  )}
                  {!foodimg.includes(selectedItem.ItemCode) && (
                    <img
                      src={`https://scontent.fbkk22-8.fna.fbcdn.net/v/t1.18169-9/15171213_1701469426835212_8933784202474239947_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=7a1959&_nc_eui2=AeHp2FqDLoKshdhQeUw5ExIngVz7a8IZt3aBXPtrwhm3dsV2uCgo229usGamJT6xe6e8bLhc0P2Jv5P0MPeTLFo6&_nc_ohc=uRlLMHBCO3AAX8aSm7k&_nc_ht=scontent.fbkk22-8.fna&oh=00_AfDB3yRdRwkzzMGmj4nEY4mfGh4hQWInNJ07IEaVqEwpKQ&oe=65A7657A`}
                      alt="Imgfood"
                    />
                  )}
                </div>
                <div className="item-count">
                  <button
                    className="count-btn"
                    onClick={() =>
                      setCountItem((prevCount) =>
                        prevCount > 1 ? prevCount - 1 : 1
                      )
                    }
                  >
                    -
                  </button>
                  <span>{countItem}</span>
                  <button
                    className="count-btn"
                    onClick={() => setCountItem((prevCount) => prevCount + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="modal-action"
                  onClick={() => [
                    setOverlay(false),
                    setCountItem(originalCount),
                  ]}
                >
                  ยกเลิก
                </button>
                <button
                  className="modal-action"
                  onClick={() => [
                    setOverlay(false),
                    addToCart(selectedItem, countItem),
                    setCountItem(1),
                  ]}
                >
                  เพิ่มในตะกร้า
                </button>
              </div>
            </div>
          </div>
        )}
        {overlay5 && cart.length > 0 && (
          <div className="dialog-overlay">
            <div className="dialogv2">
              <p>
                คุณมีสินค้าอยู่ในตะกร้า <br /> อย่าลืมกดสั่งอาหารนะค่ะ :{")"}
              </p>
              <div className="dialog-actionsv2">
                <button onClick={() => [setOverlay5(false)]}>ตกลง</button>
              </div>
            </div>
          </div>
        )}
        {overlay6  && (
          <div className="dialog-overlay">
            <div className="dialogv2">
              <p>
                คุณได้สั่งอาหารเข้าครัวเรียบร้อย <br /> สามารถสั่งอาหารต่อได้นะค่ะ :{")"}
              </p>
              <div className="dialog-actionsv2">
                <button onClick={() => [setOverlay6(false)]}>ตกลง</button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  const Cart = () => {
    const incrementQuantity = (itemCode: any) => {
      setCart(
        cart.map((item: { ItemCode: any; Quantity: number }) =>
          item.ItemCode === itemCode
            ? { ...item, Quantity: item.Quantity + 1 }
            : item
        )
      );
    };

    const decrementQuantity = (itemCode: any) => {
      setCart(
        cart
          .map((item: any) =>
            item.ItemCode === itemCode
              ? { ...item, Quantity: item.Quantity - 1 }
              : item
          )
          .filter((item: any) => item.Quantity > 0)
      );
    };

    const confirmAndRemoveItem = (itemCode: any) => {
      const item = cart.find((item: any) => item.ItemCode === itemCode);
      if (item) {
        setItemToRemove(item);
        setOverlay3(true);
      }
    };

    const handleRemoveConfirmed = () => {
      if (itemToRemove) {
        setCart(
          cart.filter((item: any) => item.ItemCode !== itemToRemove.ItemCode)
        );
      }
      setOverlay3(false);
      setItemToRemove(null);
    };

    return (
      <>
         <div className="header2">
         <div className="header-page2">
          <button onClick={() => [setPage(1), setOverlay5(true)]}>x</button>
          <div>
            {" "}
            <h1>ตะกร้า</h1> <p>ข้อมูล ณ เวลา {ftime}</p>
          </div>
        </div>
         </div>
         <div className="main-content2">
        <div className="cart-container">
          {cart.map((item: any, index: any) => (
            <div className="itemv2" key={index}>
              <div className="v2">
                {foodimg.includes(item.ItemCode) && (
                  <img
                    src={`https://posimg.s3.ap-southeast-1.amazonaws.com/${item.ItemCode}.jpg`}
                    alt="Imgfood"
                  />
                )}
                {!foodimg.includes(item.ItemCode) && (
                  <img
                    src={`https://scontent.fbkk22-8.fna.fbcdn.net/v/t1.18169-9/15171213_1701469426835212_8933784202474239947_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=7a1959&_nc_eui2=AeHp2FqDLoKshdhQeUw5ExIngVz7a8IZt3aBXPtrwhm3dsV2uCgo229usGamJT6xe6e8bLhc0P2Jv5P0MPeTLFo6&_nc_ohc=uRlLMHBCO3AAX8aSm7k&_nc_ht=scontent.fbkk22-8.fna&oh=00_AfDB3yRdRwkzzMGmj4nEY4mfGh4hQWInNJ07IEaVqEwpKQ&oe=65A7657A`}
                    alt="Imgfood"
                  />
                )}
                <div className="title">
                  <p>{item.ItemSupp}</p>
                  {/* <p>0.00฿</p> */}
                </div>
              </div>
              <div className="cart-body">
                <div className="quantity-controls">
                  <button
                    onClick={() =>
                      item.Quantity === 1
                        ? confirmAndRemoveItem(item.ItemCode)
                        : decrementQuantity(item.ItemCode)
                    }
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span>{item.Quantity}</span>
                  <button
                    onClick={() => incrementQuantity(item.ItemCode)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
          {overlay3 && itemToRemove && (
            <div className="dialog-overlay">
              <div className="dialog">
                <p>คุณต้องการยกเลิกเมนูนี้ใช่หรือไม่?</p>
                <div className="rowd">
                  {foodimg.includes(itemToRemove.ItemCode) && (
                    <img
                      src={`https://posimg.s3.ap-southeast-1.amazonaws.com/${itemToRemove.ItemCode}.jpg`}
                      alt="Imgfood"
                    />
                  )}
                  {!foodimg.includes(itemToRemove.ItemCode) && (
                    <img
                      src={`https://scontent.fbkk22-8.fna.fbcdn.net/v/t1.18169-9/15171213_1701469426835212_8933784202474239947_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=7a1959&_nc_eui2=AeHp2FqDLoKshdhQeUw5ExIngVz7a8IZt3aBXPtrwhm3dsV2uCgo229usGamJT6xe6e8bLhc0P2Jv5P0MPeTLFo6&_nc_ohc=uRlLMHBCO3AAX8aSm7k&_nc_ht=scontent.fbkk22-8.fna&oh=00_AfDB3yRdRwkzzMGmj4nEY4mfGh4hQWInNJ07IEaVqEwpKQ&oe=65A7657A`}
                      alt="Imgfood"
                    />
                  )}
                  <p>
                    {itemToRemove.ItemSupp} <br /> ราคา:{" "}
                    {itemToRemove.UnitPrice != ""
                      ? itemToRemove.UnitPrice + ".00"
                      : "0.00"}
                    ฿
                  </p>
                </div>
                <div className="dialog-actions">
                  <button onClick={() => setOverlay3(false)}>ยกเลิก</button>
                  <button onClick={handleRemoveConfirmed}>ตกลง</button>
                </div>
              </div>
            </div>
          )}

          {overlay4 && cart.length && (
            <div className="dialog-overlay">
              <div className="dialog">
                <p>คุณต้องการสั่งอาหารทั้งหมดนี้ใช่หรือไม่?</p>
                <p className="text-red-500">***อาหารที่คุณสั่งจะไม่สามารถคืนได้***</p>
                <br />
                 <div className="dialog-actions">
                  <button onClick={() => setOverlay4(false)}>ยกเลิก</button>
                  <button
                    onClick={() => [
                      postItem(cart),
                      setCart([]),
                      setOverlay4(false),
                      setPage(1),
                      setOverlay6(true),
                     ]}>
                    ตกลง
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        </div>
 
        {/* {isBar()} */}
        {isFooter()}
      </>
    );
  };

  const Order = () => {
    return (
      <>
       <div className="header3">
       <div className="header-page3">
          <button onClick={() => setPage(1)}>x</button>
          <div>
            {" "}
            <h1>รายการที่สั่ง</h1>{" "}
            <p>ข้อมูล ณ เวลา {new Date().toLocaleTimeString()}</p>
          </div>
          <button><img  id="cart" onClick={isChanged} src="cart.svg" /></button>
          
        </div>
       </div>
        <div className="main-content2">
          {order.map((item: any, index: any) => (
            <div className="itemv2" key={index}>
              <div className="v2">
                {foodimg.includes(item.ItemCode) && (
                  <img
                    src={`https://posimg.s3.ap-southeast-1.amazonaws.com/${item.ItemCode}.jpg`}
                    alt="Imgfood"
                  />
                )}
                {!foodimg.includes(item.ItemCode) && (
                  <img
                    src={`https://scontent.fbkk22-8.fna.fbcdn.net/v/t1.18169-9/15171213_1701469426835212_8933784202474239947_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=7a1959&_nc_eui2=AeHp2FqDLoKshdhQeUw5ExIngVz7a8IZt3aBXPtrwhm3dsV2uCgo229usGamJT6xe6e8bLhc0P2Jv5P0MPeTLFo6&_nc_ohc=uRlLMHBCO3AAX8aSm7k&_nc_ht=scontent.fbkk22-8.fna&oh=00_AfDB3yRdRwkzzMGmj4nEY4mfGh4hQWInNJ07IEaVqEwpKQ&oe=65A7657A`}
                    alt="Imgfood"
                  />
                )}
                <div className="title">
                  <p>{item.ItemSupp}</p>
                  {/* <p>{item.UnitPrice}</p> */}
                </div>
              </div>
              <button className="but-tonv2">
                <p>{new Date(item.PostTime).toLocaleTimeString()}</p>
              </button>
            </div>
          ))}
        </div>
        {/* {isBar()} */}
        {isFooter()}
      </>
    );
  };

  const isFooter = () => {
    return (
      <>
        <div className="sticky">
        {isBar()}
        <footer>
          <button id="menu" onClick={isChanged}>
            เมนู
          </button>
          <button id="order" onClick={isChanged}>
            รายการที่สั่ง
          </button>
        </footer>
        </div>
      </>
    );
  };
  
   const isBar = () => {
    {
      if (page == 1 && cart.length > 0) {
        return (
          <>
          <br/><br/><br/>
           <div className="cart-order">
              <button id="cart" onClick={isChanged}>
                {" "}
                {<img src="cart.svg"/>}
                รายการในตะกร้า {cart.length} รายการ
              </button>
            </div>
          </>
        );
      }else if(page == 2 && cart.length > 0){
        return <>
        <br/><br/><br/>
        <div className="cart-order">
            <button
              onClick={() => [
                setOverlay4(true),
                localStorage.removeItem("cart"),
              ]}
            >
              สั่ง {cart.length} รายการ
            </button>
          </div>
        </>
      }
      else if(page == 3 && order.length > 0){
        return <>
        <br/><br/><br/>
        <div className="cart-orderv2">
            <button>
              ราคาทั้งหมด 0.00 ฿ ไม่รวม Vat
            </button>
          </div>
        </>
      }
    }
  };

  return <>{isPage()}</>;
}

export async function getOrder(TableID: any, OutletID: any) {
  let zlib = require("zlib");
  let cart_ord = {
    OutletID: OutletID,
    TableID: TableID,
  };
  let body = zlib.deflateSync(JSON.stringify(cart_ord));
  let res = await fetch("http://54.179.86.5:8765/v1/order", {
    method: "POST",
    headers: {
      "content-type": "application/octet-stream",
    },
    body: body.slice(2),
  });

  let resBuffer = await res.arrayBuffer();

  let data_ord = JSON.parse(
    zlib.unzipSync(Buffer.from([120, 156, ...new Uint8Array(resBuffer)]))
  );

  return data_ord;
}

export async function postItem(cart: any) {
  let zlib = require("zlib");
  let body = zlib.deflateSync(JSON.stringify(cart));
  let res = await fetch("http://54.179.86.5:8765/v1/order_qr", {
    method: "POST",
    headers: {
      "content-type": "application/octet-stream",
    },
    body: body.slice(2),
  });

  let resBuffer = await res.arrayBuffer();

  let data_cart = JSON.parse(
    zlib.unzipSync(Buffer.from([120, 156, ...new Uint8Array(resBuffer)]))
  );

  return {
    props: { data_cart },
  };
}

export async function getItem(params: any, OutleID: any, TableID: any) {
  let token = params.token;
  // let token = "00fcd737b2bb3f33c260c4b3f11db8bf8c3d1d707766d902e6f7955ad3cd8abb5c1f1f401defd601d704c97182145e920121fc98b8013222870a";
  let zlib = require("zlib");
  let jsn2 = {
    OutletID: OutleID,
    TableID: TableID,
    token: `${token}`,
  };
  let item_qr = "item_qr";
  let body = zlib.deflateSync(JSON.stringify(jsn2));
  let res = await fetch("http://54.179.86.5:8765/v1/" + item_qr, {
    method: "POST",
    headers: {
      "content-type": "application/octet-stream",
    },
    body: body.slice(2),
  });

  let resBuffer = await res.arrayBuffer();

  let data = JSON.parse(
    zlib.unzipSync(Buffer.from([120, 156, ...new Uint8Array(resBuffer)]))
  );

  // console.log(data);

  return data;
}
