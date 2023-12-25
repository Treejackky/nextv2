"use client";
import React, { useEffect, useState, useRef } from "react";

type Props = {
  params: any;
};

export default function Index({ params }: Props) {
  const [data, setData] = useState<any[]>([]);
  const [OutleID, setOutletID] = useState<any>(0);
  const [OutletName, setOutletName] = useState<any>("");
  const [TableID, setTableID] = useState<any>(0);
  const [pkg, setPkg] = useState<any>("");
  const [WaiterID, setWaiterID] = useState<any>(0);
  const [filter, setFilter] = useState<string>("");
  const [MenuName, setMenuName] = useState<any>({});
  const [language, setLanguage] = useState<any>(0);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [cart, setCart] = useState<any>([]);
  const [page, setPage] = useState<any>(0);
  const [overlay, setOverlay] = useState<any>(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [countItem, setCountItem] = useState(1);
  const [overlay3, setOverlay3] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<any>(null);
  const [overlay4, setOverlay4] = useState(false);
  const [overlay5, setOverlay5] = useState(false);
  const [overlay6, setOverlay6] = useState(false);
  const [overlay7, setOverlay7] = useState(false);
  const [overlay8, setOverlay8] = useState(false);
  const [order, setOrder] = useState<any>([]);
  const [ftime, setFTime] = useState<any>(0);
  const [activeSection, setActiveSection] = useState(null);
  const [originalCount, setOriginalCount] = useState(0);
  const [error, setError] = useState<any>({});  

  useEffect(() => {
    getItem(params, OutleID, TableID).then((data) => {
      setPkg(data.Package);
      // console.log(data.Package);
      if(data.Package == "prm" || data.Package == "std"){
      setData(data.items);
      setOutletID(data.OutletID);
      setTableID(data.TableID);
      setWaiterID(data.WaiterID);
      setOutletName(data.OutletName);
      setMenuName(data.MenuName);
      setLanguage("Thai");
      setPage(1);
      console.log(data.items);
      }else{
        setPage(4);
      }
    });
  }, []);

  useEffect(() => {
    if (data && data.length > 0) {
      let filterData = filter
        ? data.filter((item) => item.MenuCode === filter)
        : data;
      filterData = filterData.sort((a, b) => a.MenuCode - b.MenuCode);
      setFilteredData(filterData);
    } else {
      setFilteredData([]);
    }
  }, [data, filter]);

  useEffect(() => {
    setOverlay7(true);
  }, []);

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

  const uniqueGrpSubs = Array.from(new Set(data.map((item) => item.MenuCode)));

  useEffect(() => {
    const handleScroll = () => {
      uniqueGrpSubs.forEach((MenuCode) => {
        const element = document.getElementById(MenuCode);
        if (element) {
          const bounding = element.getBoundingClientRect();
          if (
            bounding.top >= 0 &&
            bounding.bottom <=
              (window.innerHeight || document.documentElement.clientHeight)
          ) {
            setActiveSection(MenuCode);
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
  };

  const handleError = (error: any) => {
    setError(error);
    setOverlay8(true);
  }
  function calculateTotal(order :any) {
    let total = 0;
    for (const item of order) {
      total += item.GrossPrice;
    }
    return total;
  }
  
  

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

        // If countItem is 0, remove the item from the cart
        if (countItem === 0) {
          updatedCart.splice(existingItemIndex, 1);
        }

        return updatedCart;
      } else {
        // If countItem is 0, don't add the item to the cart
        if (countItem === 0) {
          return prevCart;
        }

        let newItem = {
          OutletID: OutleID,
          TableID: TableID,
          ItemID: item.ItemID,
          ItemCode: item.ItemCode,
          NameThai : item.NameThai,
          NameEng : item.NameEng,
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
      }else if(page == 4){
        return <End />;
      }
    }
  };

  const Menu = () => {
    return (
      <>
        <div className="tbid">
          <div className="tbid1">
          <div className="tableid2">
            <p>
              {language == "Thai"
                ? "สาขา : " + OutletName.Thai
                : "Branch : " + OutletName.Eng}
            </p>
          </div>
          <div className="tableid">
            <p>
              {language == "Thai" ? "โต๊ะ : " + TableID : "Table : " + TableID}
            </p>
          </div>
          <div className="prmstd">
            <p>
              {language == "Thai"
                ? pkg == "prm" 
                  ? "พรีเมี่ยม"
                  : "สแตนดาด"
                : pkg == "prm"
                  ? "Premium"
                  : "Standard"
                }
            </p>
          </div>
          </div>
         <div className="tbid2">
         <div className="language">
            <p>
              <button
                onClick={() => {
                  if (language != "Thai") {
                    setLanguage("Thai");
                  } else {
                    setLanguage("Eng");
                  }
                }}
              >
                {language}
              </button>
            </p>
          </div>
          
         </div>
        </div>
        
        <div className="header-img">
          <img
            src={`https://posimg.s3.ap-southeast-1.amazonaws.com/header.jpg`}
            alt="Imgfood"
          />
        </div>
        <header>
          <nav>
            {uniqueGrpSubs.map((MenuCode) => (
              <button
                key={MenuCode}
                onClick={() => scrollToPosition(MenuCode)}
                className={activeSection === MenuCode ? "active" : ""}
              >
                <p>
                  {language == "Thai"
                    ? MenuName.Thai[MenuCode]
                    : MenuName.Eng[MenuCode]}
                </p>
              </button>
            ))}
          </nav>
        </header>
        <div className="main-content">
          {filteredData.map((item, idx) => (
            <button
              onClick={() => handleItemClick(item)}
              className="item"
              id={item.MenuCode}
              key={idx}
            >
              <div className="item-left">
                <img
                  src={`https://posimg.s3.ap-southeast-1.amazonaws.com/${item.ItemCode}.jpg`}
                  alt="Imgfood"
                />
                <div className="text_price2">
                  <p>{language == "Thai" ? item.NameThai : item.NameEng}</p>
                  {/* <p>{item.MenuCode}</p> */}
                  {item.UnitPrice != 0 && item.UnitPrice != "" ? (
                    <p className="text_price">{item.UnitPrice}฿</p>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div
                className={`item-right ${
                  cart.some(
                    (cartItem: any) => cartItem.ItemCode === item.ItemCode
                  )
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
                <div className="name">
                  {language == "Thai"
                    ? selectedItem.NameThai
                    : selectedItem.NameEng}
                </div>
              </div>
              <div className="modal-body">
                <div className="modal-img">
                  <img
                    src={`https://posimg.s3.ap-southeast-1.amazonaws.com/${selectedItem.ItemCode}.jpg`}
                    alt="Imgfood"
                  />
                </div>
                <div className="item-count">
                  <button
                    className="count-btn"
                    onClick={() => {
                      setCountItem((prevCount) => {
                        if (prevCount >= 1) {
                          return prevCount - 1;
                        } else {
                          const isItemInCart = cart.some(
                            (cartItem: any) =>
                              cartItem.ItemCode === selectedItem.ItemCode &&
                              cartItem.Quantity > 0
                          );
                          if (isItemInCart) {
                            addToCart(selectedItem, 0);
                          } else {
                            return 0;
                          }
                        }
                        return prevCount;
                      });
                    }}
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
                  {language == "Thai" ? "ยกเลิก" : "Cancel"}
                </button>
                <button
                  className="modal-action"
                  onClick={() => [
                    setOverlay(false),
                    addToCart(selectedItem, countItem),
                    setCountItem(1),
                  ]}
                >
                  {language == "Thai" ? "เพิ่มลงตะกร้า" : "Add to cart"}
                </button>
              </div>
            </div>
          </div>
        )}
        {overlay5 && cart.length > 0 && (
          <div className="dialog-overlay">
            <div className="dialogv2">
              {language == "Thai" ? (
                <p>
                  คุณมีสินค้าอยู่ในตะกร้า <br /> อย่าลืมกดสั่งอาหารนะค่ะ :{")"}
                </p>
              ) : (
                <p>
                  {" "}
                  You have items in your cart. <br /> Don't forget to order :
                  {")"}
                </p>
              )}
              <div className="dialog-actionsv2">
                <button onClick={() => [setOverlay5(false)]}>ตกลง</button>
              </div>
            </div>
          </div>
        )}
        {overlay6 && (
          <div className="dialog-overlay">
            <div className="dialogv2">
              {language == "Thai" ? (
                <p>
                  คุณได้สั่งอาหารเข้าครัวเรียบร้อย <br />{" "}
                  สามารถสั่งอาหารต่อได้นะค่ะ :{")"}
                </p>
              ) : (
                <p>
                  {" "}
                  You have ordered food successfully. <br /> You can order more
                  food :{")"}
                </p>
              )}
              <div className="dialog-actionsv2">
                <button onClick={() => [setOverlay6(false)]}>ตกลง</button>
              </div>
            </div>
          </div>
        )}
        {overlay7 && (
          <div className="dialog-overlay">
            <div className="dialogv2">
              <p>
                กติกาการทาน <br /> คิดค่าบริการเพิ่ม ขีดละ 40 บาท ต่อ 100 กรัม{" "}
                <br />
                แป้งพิซซ่าชิ้นละ 20 บาท ซูชิชิ้นละ 20 บาท <br />
                <br />
                Rules for eating leftovers <br />
                leftover food will be charged 40 Baht/100 g<br />
                and 20 Baht/piece for pizza or sushi.
              </p>
              <div className="dialog-actionsv2">
                <button onClick={() => [setOverlay7(false)]}>ตกลง</button>
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
              {language == "Thai" ? (
                <>
                  {" "}
                  <h1>ตะกร้า</h1> <p>ข้อมูล ณ เวลา {ftime}</p>
                </>
              ) : (
                <>
                  <h1>Cart</h1> <p>Time {ftime}</p>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="main-content2">
          <div className="cart-container">
            {cart.map((item: any, index: any) => (
              <div className="itemv2" key={index}>
                <div className="v2">
                  <img
                    src={`https://posimg.s3.ap-southeast-1.amazonaws.com/${item.ItemCode}.jpg`}
                    alt="Imgfood"
                  />
                  <div className="title">
                    
                    {language == "Thai" 
                    ? <p>{item.NameThai}</p>
                    : <p>{item.NameEng}</p>
                    }
                    {item.UnitPrice != 0 ? <p>{item.UnitPrice} ฿</p> : ""}
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
                  {language == "Thai"  
                  ?  <p>คุณต้องการยกเลิกเมนูนี้ใช่หรือไม่?</p>
                  : <p>Do you want to cancel this menu?</p>
                  }
                  <div className="rowd">
                    <img
                      src={`https://posimg.s3.ap-southeast-1.amazonaws.com/${itemToRemove.ItemCode}.jpg`}
                      alt="Imgfood"
                    />
                    <p>
                      {language == "Thai" 
                      ?  itemToRemove.NameThai 
                      :  itemToRemove.NameEng
                      } 
                      <br />
                      {language == "Thai" 
                      ?  itemToRemove.UnitPrice != 0
                        ? "ราคา : " + itemToRemove.UnitPrice + "฿"
                        : ""
                      :  itemToRemove.UnitPrice != 0
                        ? "Price : " + itemToRemove.UnitPrice + "฿"
                        : ""
                      }
                      
                    </p>
                    
                  </div>
                  <div className="dialog-actions">
                    <button onClick={() => setOverlay3(false)}>{language == "Thai" 
                    ? "ยกเลิก"
                    : "Cancel"}</button>
                    <button onClick={handleRemoveConfirmed}>{language == "Thai" 
                    ? "ตกลง"
                    : "Agree"}</button>
                  </div>
                </div>
              </div>
            )}

            {overlay4 && cart.length && (
              <div className="dialog-overlay">
                <div className="dialog">
                 
                  {language == "Thai" 
                    ?  <p>คุณต้องการสั่งอาหารทั้งหมดนี้ ใช่หรือไม่ ?</p>
                    : <p> Do you want to order all of this food?</p>
                    }
                  <p className="text-red-500">
                    {language == "Thai"
                    ? "**รายการอาหารที่สั่งไม่สามารถยกเลิกได้นะขอรับ**"
                    : "**The ordered food cannot be canceled.**"}
                  </p>
                  <br />
                  <div className="dialog-actions">
                    <button onClick={() => setOverlay4(false)}>{language == "Thai" 
                    ? "ยกเลิก"
                    : "Cancel"}</button>  
                    <button
                      onClick={() => [
                        postItem(cart).then((data: any) => {
                          console.log(data.props.data_cart.err);
                          if (data.props.data_cart.err) {
                            console.log(data.props.data_cart.err);
                      
                            handleError(data.props.data_cart.err)
                            setOverlay4(false);
                            
                          } else {
                            postItem(cart);
                            setCart([]);
                            setOverlay4(false);
                            setPage(1);
                            setOverlay6(true);
                          }
                        }),
                        // setCart([]),
                        // setOverlay4(false),
                        // setPage(1),
                        // setOverlay6(true),
                      ]}
                    >
                      {language == "Thai" 
                    ? "ตกลง"
                    : "Agree"}
                    </button>
                  </div>
                </div>
              </div>
            )}
            {overlay8 && cart.length && (
              <div className="dialog-overlay">
                <div className="dialog">
                  {language == "Thai" 
                    ?  error.Thai 
                    : error.Eng
                    }
                  <p className="text-red-500">
                    {language == "Thai"
                     ?  error.Thai 
                     : error.Eng
                    }
                  </p>
                  <br />
                  <div className="dialog-actions">
                    <button onClick={() => setOverlay8(false)}>{language == "Thai" 
                    ? "ยกเลิก"
                    : "Cancel"}</button>
                    <button
                      onClick={() => [
                        setOverlay8(false),
                      ]}
                    >
                      {language == "Thai" 
                    ? "ตกลง"
                    : "Agree"}
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
              {language == "Thai" ? (
                <>
                  {" "}
                  <h1>รายการที่สั่ง</h1> <p>ข้อมูล ณ เวลา {new Date().toLocaleTimeString()}</p>
                </>
              ) : (
                <>
                  <h1>Cart</h1> <p>Time {new Date().toLocaleTimeString()}</p>
                </>
              )}
              
            </div>
            <button>
              <img id="cart" onClick={isChanged} src="cart.svg" />
            </button>
          </div>
        </div>
        <div className="main-content2">
          {order.map((item: any, index: any) => (
            <div className="itemv2" key={index}>
              <div className="v2">
                <img
                  src={`https://posimg.s3.ap-southeast-1.amazonaws.com/${item.ItemCode}.jpg`}
                  onError={(e) => {
                    e.currentTarget.src =
                      "icon.jpg";
                  }}
                />
                <div className="title">
                  {language == "Thai" 
                    ? item.NameThai
                    : item.NameEng}
                  <div className="but-tonv2">
                    <p>{new Date(item.PostTime).toLocaleTimeString()}</p>
                  </div>
                </div>
              </div>
              <div className="title_order">
                <div className="titlep3">
                  <p>X {item.Quantity}</p>
                </div>
                <div className="titlep2">
                  {item.GrossPrice !== 0 ? (
                    <p className="hasPrice">{item.GrossPrice} ฿</p>
                  ) : (
                    <p className="noPrice"></p>
                  )}
                </div>
              </div>
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
              {language == "Thai" 
                    ? "เมนู"
                    : "Menu"}
            </button>
            <button id="order" onClick={isChanged}>
              {language == "Thai" 
                    ? "รายการที่สั่ง"
                    : "Ordered"}
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
            <br />
            <br />
            <br />
            <div className="cart-order">
              <button id="cart" onClick={isChanged}>
                {" "}
                {<img src="cart.svg" />}
                {language == "Thai" 
                    ? "รายการในตะกร้า" +" "+ cart.length +" "+  "รายการ"
                    : "Cart" +" "+  cart.length +" "+  "items"}
              </button>
            </div>
          </>
        );
      } else if (page == 2 && cart.length > 0) {
        return (
          <>
            <br />
            <br />
            <br />
            <div className="cart-order">
              <button
                onClick={() => [
                  setOverlay4(true),
                  localStorage.removeItem("cart"),
                ]}
              >
                {/* สั่ง {cart.length} รายการ */}
                {language == "Thai" 
                    ? "สั่ง" +" "+  cart.length +" "+  "รายการ"
                    : "Order" +" "+  cart.length +" "+  "items"}
              </button>
            </div>
          </>
        );
      } else if (page == 3 && order.length > 0) {
        return (
          <>
            <div className="cart-orderv2">
            <button>
              <p></p>
              {language == "Thai" 
                ? "ราคาทั้งหมด: " + calculateTotal(order) +" ฿ ไม่รวม Vat"
                : "Total: " + calculateTotal(order) +" Baht (Vat not included)"
                }
            </button>
          </div>
          </>
        );
      }
    }
  };
  const End = () => {
    return (
    <>
     <div className="header2">
          <div className="header-page2">
           
            <div>
            {" "}
            <h1>Narai Pizzeria X ข้าน้อยขอชาบู</h1>
            </div>
             
          </div>
        </div>
      <div className="EndKanoi">
      <img src="kanoi2.png" />
      <h1>Good Food <br/> is <br/> Good Mood </h1>
      </div>
    </>
    )
  }
  return <>{isPage()}</>;
}


// {language == "Thai" 
// ? "ราคาทั้งหมด 0.00 ฿ ไม่รวม Vat"
// : "Total price 0.00 Baht (Vat not included)"}
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
  console.log(data_ord);
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

  return data;
}
