import React, { useState } from "react";
import "./ProductCard.css";
function SuccessPopup({ show }) {
  return show ? (
    <div className="success-popup">Successfully added to cart</div>
  ) : null;
}

function ProductCard({ product, addToCart }) {
  const [showDescription, setShowDescription] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;

    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="star">
          &#9733;
        </span>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" className="star">
          &#9733;
        </span>
      );
    } else if (fullStars < 5) {
      stars.push(
        <span key="empty" className="star">
          &#9734;
        </span>
      );
    }

    while (stars.length < 5) {
      stars.push(
        <span key={stars.length} className="star">
          &#9734;
        </span>
      );
    }

    return stars;
  };

  const toggleDescription = () => {
    setShowDescription(!showDescription);
  };

  const handleAddToCart = () => {
    addToCart(product);
    setShowSuccessPopup(true);
    setTimeout(() => {
      setShowSuccessPopup(false);
    }, 2000);
  };

  return (
    <div className="product-card">
      <img src={product.image} alt={product.title} />
      <h2>{product.title}</h2>
      <p className="rating">{renderStars(product.rating.rate)}</p>
      <p className="price">Price: ${product.price}</p>
      <div className="button-group">
        <button className="view-description" onClick={toggleDescription}>
          View Description
        </button>
        <button className="add-to-cart-button" onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>
      {showSuccessPopup && <SuccessPopup show={showSuccessPopup} />}

      {showDescription && (
        <div className="description-popup">
          <div className="popup-content">
            <h3>{product.title} Description</h3>
            <p>{product.description}</p>
            <button className="close-button" onClick={toggleDescription}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductCard;
