// import React, { useState, useEffect } from "react";
// import "./styles.css";

// function ProductCard({ title, image }) {
//   return (
//     <div className="product-card">
//       <img src={image} alt={title} className="product-img" />
//       <span>{title}</span>
//     </div>
//   );
// }

// const PAGE_SIZE = 10;

// function App() {
//   const [data, setData] = useState([]);
//   const [current, setCurrent] = useState(0);

//   useEffect(() => {
//     getProducts();
//   }, []);

//   const getProducts = async () => {
//     let res = await fetch("https://dummyjson.com/products?limit=500");
//     let result = await res.json();
//     setData(result.products);
//   };

//   const handlePageClick = (n) => {
//     setCurrent(n);
//   };

//   const goToNextPage = () => {
//     setCurrent((prev) => prev + 1);
//   };

//   const goToPrevPage = () => {
//     setCurrent((prev) => prev - 1);
//   };

//   const totalNoProducts = data.length;
//   const noOfPages = Math.ceil(totalNoProducts / PAGE_SIZE);
//   const start = current * PAGE_SIZE;
//   const end = start + PAGE_SIZE;

//   return !data.length ? (
//     <h1>No products found</h1>
//   ) : (
//     <div className="App">
//       <h1>Pagination</h1>
//       <div className="pagination-container">
//         <button
//           disabled={current === 0}
//           className="page-number"
//           onClick={() => goToPrevPage()}
//         >
//           ◀️
//         </button>
//         {[...Array(noOfPages).keys()].map((n, index) => (
//           <button
//             className={"page-number " + (n === current ? "active" : "")}
//             key={n}
//             onClick={() => handlePageClick(n)}
//           >
//             {n}
//           </button>
//         ))}
//         <button
//           disabled={current === noOfPages - 1}
//           className="page-number"
//           onClick={() => goToNextPage()}
//         >
//           ▶️
//         </button>
//       </div>
//       <div className="products-container">
//         {data?.slice(start, end).map((item, index) => (
//           <ProductCard
//             key={item.id}
//             title={item.title}
//             image={item.thumbnail}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }

// export default App;

import React, { useState, useEffect } from "react";
import "./styles.css";

function ProductCard({ title, image }) {
  return (
    <div className="product-card">
      <img src={image} alt={title} className="product-img" />
      <span>{title}</span>
    </div>
  );
}

const PAGE_SIZE = 10;
const PAGE_WINDOW = 3;

function App() {
  const [data, setData] = useState([]);
  const [current, setCurrent] = useState(0);
  const [startPage, setStartPage] = useState(1);

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    const res = await fetch("https://dummyjson.com/products?limit=500");
    const result = await res.json();
    setData(result.products);
  };

  const totalNoProducts = data.length;
  const noOfPages = Math.ceil(totalNoProducts / PAGE_SIZE);
  const start = current * PAGE_SIZE;
  const end = start + PAGE_SIZE;

  const handlePageClick = (n) => {
    setCurrent(n);
  };

  const goToNextPage = () => {
    if (current < noOfPages - 1) {
      const next = current + 1;
      setCurrent(next);
      if (next >= startPage + PAGE_WINDOW) {
        setStartPage(startPage + PAGE_WINDOW);
      }
    }
  };

  const goToPrevPage = () => {
    if (current > 0) {
      const prev = current - 1;
      setCurrent(prev);
      if (prev < startPage) {
        setStartPage(Math.max(1, startPage - PAGE_WINDOW));
      }
    }
  };

  const renderPagination = () => {
    const pageNumbers = [];

    // Always show first page (0)
    pageNumbers.push(
      <button
        key={0}
        className={`page-number ${current === 0 ? "active" : ""}`}
        onClick={() => handlePageClick(0)}
      >
        0
      </button>
    );

    // Show ... if gap between first and startPage
    if (startPage > 1) {
      pageNumbers.push(<span key="start-ellipsis">...</span>);
    }

    // Sliding window
    for (
      let i = startPage;
      i < startPage + PAGE_WINDOW && i < noOfPages - 1;
      i++
    ) {
      pageNumbers.push(
        <button
          key={i}
          className={`page-number ${current === i ? "active" : ""}`}
          onClick={() => handlePageClick(i)}
        >
          {i}
        </button>
      );
    }

    // Show ... if there's a gap before the last page
    if (startPage + PAGE_WINDOW < noOfPages - 1) {
      pageNumbers.push(<span key="end-ellipsis">...</span>);
    }

    // Always show last page
    if (noOfPages > 1) {
      pageNumbers.push(
        <button
          key={noOfPages - 1}
          className={`page-number ${current === noOfPages - 1 ? "active" : ""}`}
          onClick={() => handlePageClick(noOfPages - 1)}
        >
          {noOfPages - 1}
        </button>
      );
    }

    return pageNumbers;
  };

  return !data.length ? (
    <h1>No products found</h1>
  ) : (
    <div className="App">
      <h1>Pagination</h1>
      <div className="pagination-container">
        <button
          disabled={current === 0}
          className="page-number"
          onClick={goToPrevPage}
        >
          ◀️
        </button>
        {renderPagination()}
        <button
          disabled={current === noOfPages - 1}
          className="page-number"
          onClick={goToNextPage}
        >
          ▶️
        </button>
      </div>
      <div className="products-container">
        {data.slice(start, end).map((item) => (
          <ProductCard
            key={item.id}
            title={item.title}
            image={item.thumbnail}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
