import './App.css';
import axios from 'axios';
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import tshirtImage from './components/tshirt.jpg';
import Bag from './components/Bag.jpg';
import shoes from './components/shoes.jpg';
import SearchComponent from './components/SearchComponent';
import ShowCourseComponent from './components/ShowCourseComponent';
import UserCartComponent from './components/UserCartComponent';
import LoginComponent from './components/LoginComponent';

function App() {
    const [responseId, setResponseId] = useState("");
    const [courses] = useState([
        { id: 1, name: 'T-shirt', price: 499, image: tshirtImage },
        { id: 2, name: 'Bag', price: 699, image: Bag },
        { id: 3, name: 'Shoes', price: 799, image: shoes }
    ]);
    const [cartCourses, setCartCourses] = useState([]);
    const [searchCourse, setSearchCourse] = useState('');
    const discount = 20; // Fixed discount percentage

    const loadScript = (src) => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => resolve(true);
            script.onerror = () => {
                console.error("Error loading Razorpay script");
                resolve(false);
            };
            document.body.appendChild(script);
        });
    };

    const createRazorpayOrder = async (amount) => {
        const data = JSON.stringify({ amount: amount * 100, currency: "INR" });

        try {
            const response = await axios.post("http://localhost:5000/orders", data, {
                headers: { 'Content-Type': 'application/json' }
            });
            handleRazorpayScreen(response.data.amount);
        } catch (error) {
            console.error("Error creating Razorpay order:", error);
        }
    };

    const handleRazorpayScreen = async (amount) => {
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
        if (!res) {
            alert("Failed to load Razorpay script");
            return;
        }

        const options = {
            key: 'rzp_test_GcZZFDPP0jHtC4', // Your Razorpay key
            amount: amount,
            currency: 'INR',
            name: "Group Payment",
            description: "Payment for group contribution",
            handler: function (response) {
                setResponseId(response.razorpay_payment_id);
                alert("Payment successful: " + response.razorpay_payment_id);
            },
            prefill: {
                name: "User",
                email: "user@example.com",
            },
            theme: {
                color: "#F4C430",
            },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    };

    const totalAmountCalculationFunction = () => {
        return cartCourses.reduce((total, item) => total + item.product.price * item.quantity, 0);
    };

    const calculateDiscountedAmount = () => {
        const total = totalAmountCalculationFunction();
        const discountAmount = (total * discount) / 100; // 20% discount
        return total - discountAmount;
    };

    const handlePayment = () => {
        const totalAmount = calculateDiscountedAmount();
        if (totalAmount > 0) {
            createRazorpayOrder(totalAmount);
        } else {
            alert("Cart is empty!");
        }
    };

    const addCourseToCartFunction = (GFGcourse) => {
        const alreadyCourses = cartCourses.find(item => item.product.id === GFGcourse.id);
        if (alreadyCourses) {
            const latestCartUpdate = cartCourses.map(item =>
                item.product.id === GFGcourse.id ? { ...item, quantity: item.quantity + 1 } : item
            );
            setCartCourses(latestCartUpdate);
        } else {
            setCartCourses([...cartCourses, { product: GFGcourse, quantity: 1 }]);
        }
    };

    const deleteCourseFromCartFunction = (GFGCourse) => {
        const updatedCart = cartCourses.filter(item => item.product.id !== GFGCourse.id);
        setCartCourses(updatedCart);
    };

    const courseSearchUserFunction = (event) => {
        setSearchCourse(event.target.value);
    };

    const filterCourseFunction = courses.filter((course) =>
        course.name.toLowerCase().includes(searchCourse.toLowerCase())
    );

    return (
        <Router>
            <div className="App">
                <nav>
                    <Link to="/">Home</Link>
                    <Link to="/login">Login</Link>
                </nav>
                <Routes>
                    <Route path="/login" element={<LoginComponent />} />
                    <Route path="/" element={
                        <>
                            <SearchComponent
                                searchCourse={searchCourse}
                                courseSearchUserFunction={courseSearchUserFunction}
                            />
                            <main className="App-main">
                                <ShowCourseComponent
                                    courses={courses}
                                    filterCourseFunction={filterCourseFunction}
                                    addCourseToCartFunction={addCourseToCartFunction}
                                />
                                <UserCartComponent
                                    cartCourses={cartCourses}
                                    deleteCourseFromCartFunction={deleteCourseFromCartFunction}
                                    totalAmountCalculationFunction={totalAmountCalculationFunction}
                                    setCartCourses={setCartCourses}
                                    handlePayment={handlePayment} // Pass handlePayment to UserCartComponent
                                />
                            </main>
                            {responseId && <p>Payment ID: {responseId}</p>}
                        </>
                    } />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
