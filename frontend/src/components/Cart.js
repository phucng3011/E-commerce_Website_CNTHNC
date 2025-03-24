import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { cartItems, removeFromCart } = useContext(CartContext);

  return (
    <div>
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        <>
          <ul>
            {cartItems.map((item) => (
              <li key={item._id}>
                {item.name} - ${item.price}
                <button onClick={() => removeFromCart(item._id)}>Remove</button>
              </li>
            ))}
          </ul>
          <Link to="/checkout">Proceed to Checkout</Link>
        </>
      )}
    </div>
  );
};

export default Cart;