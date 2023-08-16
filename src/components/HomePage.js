import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import './ProductCard.css';

function HomePage() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchCategory, setSearchCategory] = useState('');
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  const [cart, setCart] = useState([]);
  const productsPerPage = 10;

  const [myCartPage, setMyCartPage] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  useEffect(() => {
    axios.get('https://fakestoreapi.com/products')
      .then(response => {
        const sortedProducts = response.data.sort((a, b) => b.rating.rate - a.rating.rate);
        setProducts(sortedProducts);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const savedMyCartPage = localStorage.getItem('myCartPage');
    if (savedMyCartPage) {
      setMyCartPage(savedMyCartPage === 'true');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('myCartPage', myCartPage);
  }, [myCartPage]);

  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;

  const filteredProductsByCategory = selectedCategory === 'all'
    ? products
    : products.filter(product => product.category === selectedCategory);

  const filteredProductsBySearchCategory = searchCategory === ''
    ? filteredProductsByCategory
    : filteredProductsByCategory.filter(product =>
        product.category.toLowerCase().includes(searchCategory.toLowerCase())
      );

  const displayedProducts = isSearchClicked
    ? filteredProductsBySearchCategory.slice(startIndex, endIndex)
    : filteredProductsByCategory.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (endIndex < (isSearchClicked ? filteredProductsBySearchCategory : filteredProductsByCategory).length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleSearch = () => {
    setIsSearchClicked(true);
    setCurrentPage(1);
  };

  const handleHome = () => {
    setCurrentPage(1);
    setSelectedCategory('all');
    setSearchCategory('');
    setIsSearchClicked(false);
    setMyCartPage(false);
  };

  const handleAddToCart = (product) => {
    const existingProduct = cart.find(item => item.product.id === product.id);
    if (existingProduct) {
      const updatedCart = cart.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCart(updatedCart);
    } else {
      setCart(prevCart => [...prevCart, { product, quantity: 1 }]);
    }
    setShowSuccessPopup(true);
    setTimeout(() => {
      setShowSuccessPopup(false);
    }, 2000);
  };

  const handleMyCart = () => {
    setMyCartPage(true);
  };

  const handleBackToProducts = () => {
    setMyCartPage(false);
  };

  const handleIncreaseQuantity = (productId) => {
    const updatedCart = cart.map(item =>
      item.product.id === productId
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    setCart(updatedCart);
  };

  const handleDecreaseQuantity = (productId) => {
    const updatedCart = cart.map(item =>
      item.product.id === productId
        ? { ...item, quantity: Math.max(item.quantity - 1, 0) }
        : item
    );
    setCart(updatedCart);
  };

  const handleRemoveFromCart = (productId) => {
    const updatedCart = cart.filter(item => item.product.id !== productId);
    setCart(updatedCart);
  };

  useEffect(() => {
    const updatedCart = cart.filter(item => item.quantity > 0);
    setCart(updatedCart);
  }, [cart]);

  const cartTotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

  return (
    <div>
      <header className="header">
        <div className="header-left">
          <button onClick={handleHome} className="home-button">Home</button>
        </div>
        <div className="header-center">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by category..."
              value={searchCategory}
              onChange={event => setSearchCategory(event.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
          </div>
        </div>
        <div className="header-right">
          <button className="cart-button" onClick={handleMyCart}>
            My Cart {cart.length > 0 && `(${cart.length} items)`}
          </button>
        </div>
        
      </header>

      {myCartPage ? (
        <div className="cart">
          <h2>My Cart</h2>
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <div>
              <ul>
                {cart.map(cartItem => (
                  <li key={cartItem.product.id}>
                    <div className="cart-item">
                      <img src={cartItem.product.image} alt={cartItem.product.title} className="cart-product-image" />
                      <div className="cart-product-details">
                        <p>{cartItem.product.title}</p>
                        <p>Price: ${cartItem.product.price}</p>
                      </div>
                      <div className="quantity-controls">
                        <button className="increase-button" onClick={() => handleIncreaseQuantity(cartItem.product.id)}>+</button>
                        <span>{cartItem.quantity}</span>
                        <button className="decrease-button" onClick={() => handleDecreaseQuantity(cartItem.product.id)}>-</button>
                      </div>
                      <button className="remove-button" onClick={() => handleRemoveFromCart(cartItem.product.id)}>Remove</button>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="cart-total">Total: ${cartTotal.toFixed(2)}</p>
              <button onClick={handleBackToProducts}>Back to Products</button>
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="product-list">
            {displayedProducts.map(product => (
              <ProductCard key={product.id} product={product} addToCart={handleAddToCart} />
            ))}
          </div>
          <div className="pagination">
            <button onClick={handlePreviousPage} disabled={currentPage === 1}>
              Previous
            </button>
            <span>Page {currentPage}</span>
            <button
              onClick={handleNextPage}
              disabled={endIndex >= (isSearchClicked ? filteredProductsBySearchCategory : filteredProductsByCategory).length}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
