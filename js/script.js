/* =====================================================
        THE LEOPOLD CAFÉ & BISTRO
        MAIN JAVASCRIPT
===================================================== */


/* =====================================================
                     VARIABLES
===================================================== */

let cart = [];

const ORDER_KEY = "theLeopoldOrders";

const RESERVATION_KEY =
    "theLeopoldReservations";

const THEME_KEY =
    "theLeopoldTheme";

const reservationFee = 200;


/* =====================================================
                     CART
===================================================== */

function addToCart(name, price){

    let existingItem =
        cart.find(item => item.name === name);


    if(existingItem){

        existingItem.quantity++;

    }else{

        cart.push({

            name:name,

            price:price,

            quantity:1

        });

    }


    updateCart();

    showToast(
        name + " added to cart!"
    );

}


/* =====================================================
                  UPDATE CART
===================================================== */

function updateCart(){

    let cartCount = 0;

    let total = 0;


    cart.forEach(item => {

        cartCount += item.quantity;

        total +=
            item.price *
            item.quantity;

    });


    const countElement =
        document.getElementById("cartCount");

    const totalElement =
        document.getElementById("cartTotal");

    const itemsElement =
        document.getElementById("cartItems");


    if(countElement){

        countElement.textContent =
            cartCount;

    }


    if(totalElement){

        totalElement.textContent =
            "₹" + total;

    }


    if(!itemsElement){

        return;

    }


    if(cart.length === 0){

        itemsElement.innerHTML =
            "<p>Your cart is empty.</p>";

        return;

    }


    itemsElement.innerHTML = "";


    cart.forEach((item,index)=>{

        let itemTotal =
            item.price *
            item.quantity;


        itemsElement.innerHTML += `

            <div class="cart-item">

                <div>

                    <strong>
                        ${escapeHtml(item.name)}
                    </strong>

                    <br>

                    <small>
                        ₹${item.price}
                        ×
                        ${item.quantity}
                    </small>

                </div>


                <div>

                    <strong>
                        ₹${itemTotal}
                    </strong>

                    <button
                        onclick="removeFromCart(${index})">

                        ✕

                    </button>

                </div>

            </div>

        `;

    });

}


/* =====================================================
                  REMOVE CART ITEM
===================================================== */

function removeFromCart(index){

    cart.splice(index,1);

    updateCart();

    showToast(
        "Item removed from cart."
    );

}


/* =====================================================
                     OPEN CART
===================================================== */

function openCart(){

    document.getElementById(
        "cartModal"
    ).style.display = "flex";

    updateCart();

}


/* =====================================================
                    CLOSE CART
===================================================== */

function closeCart(){

    document.getElementById(
        "cartModal"
    ).style.display = "none";

}


/* =====================================================
                    CALCULATE TOTAL
===================================================== */

function calculateCartTotal(){

    return cart.reduce(
        (total,item)=>{

            return total +
                (
                    item.price *
                    item.quantity
                );

        },
        0
    );

}


/* =====================================================
                     CHECKOUT
===================================================== */

function checkout(){

    if(cart.length === 0){

        showToast(
            "Your cart is empty!"
        );

        return;

    }


    let total =
        calculateCartTotal();


    document.getElementById(
        "checkoutTotal"
    ).textContent =
        "₹" + total;


    closeCart();


    document.getElementById(
        "checkoutModal"
    ).style.display = "flex";

}


/* =====================================================
                 CLOSE CHECKOUT
===================================================== */

function closeCheckout(){

    document.getElementById(
        "checkoutModal"
    ).style.display = "none";

}


/* =====================================================
                  PLACE ORDER
===================================================== */

function placeOrder(event){

    event.preventDefault();


    if(cart.length === 0){

        showToast(
            "Your cart is empty!"
        );

        closeCheckout();

        return;

    }


    const customerName =
        document.getElementById(
            "customerName"
        ).value.trim();


    const customerPhone =
        document.getElementById(
            "customerPhone"
        ).value.trim();


    const customerEmail =
        document.getElementById(
            "customerEmail"
        ).value.trim();


    const customerAddress =
        document.getElementById(
            "customerAddress"
        ).value.trim();


    const selectedPayment =
        document.querySelector(
            'input[name="paymentMethod"]:checked'
        );


    if(!selectedPayment){

        showToast(
            "Please select a payment method."
        );

        return;

    }


    const payment =
        selectedPayment.value;


    const total =
        calculateCartTotal();


    const orderId =
        "LEO" +
        Date.now()
            .toString()
            .slice(-7);


    const order = {

        orderId:orderId,

        customerName:customerName,

        customerPhone:customerPhone,

        customerEmail:customerEmail,

        address:customerAddress,

        payment:payment,

        items:
            JSON.parse(
                JSON.stringify(cart)
            ),

        total:total,

        status:"Order Placed",

        date:
            new Date()
                .toLocaleString("en-IN")

    };


    saveOrder(order);


    cart = [];


    updateCart();


    document.getElementById(
        "checkoutForm"
    ).reset();


    closeCheckout();


    showOrderConfirmation(
        order
    );


    renderOrderHistory();


    document.getElementById(
        "orderConfirmation"
    ).scrollIntoView({

        behavior:"smooth",

        block:"start"

    });

}


/* =====================================================
                 GET ORDERS
===================================================== */

function getOrders(){

    try{

        return JSON.parse(
            localStorage.getItem(
                ORDER_KEY
            )
        ) || [];

    }catch(error){

        return [];

    }

}


/* =====================================================
                   SAVE ORDER
===================================================== */

function saveOrder(order){

    const orders =
        getOrders();


    orders.unshift(order);


    localStorage.setItem(
        ORDER_KEY,
        JSON.stringify(orders)
    );

}


/* =====================================================
             ORDER CONFIRMATION
===================================================== */

function showOrderConfirmation(order){

    const section =
        document.getElementById(
            "orderConfirmation"
        );


    const content =
        document.getElementById(
            "orderConfirmationContent"
        );


    if(!section || !content){

        return;

    }


    let itemsHtml = "";


    order.items.forEach(item=>{

        itemsHtml += `

            <p>

                <span>

                    ${escapeHtml(item.name)}
                    ×
                    ${item.quantity}

                </span>

                <strong>

                    ₹${item.price *
                    item.quantity}

                </strong>

            </p>

        `;

    });


    content.innerHTML = `

        <div class="confirmation-card">


            <div class="confirmation-icon">

                ✓

            </div>


            <p class="section-label">

                ORDER CONFIRMATION

            </p>


            <h2>

                Order
                <span>
                    Placed Successfully!
                </span>

            </h2>


            <p>

                Thank you,
                ${escapeHtml(order.customerName)}.
                Your order has been
                saved successfully.

            </p>


            <div class="confirmation-details">


                <div class="confirmation-detail">

                    <small>
                        Order ID
                    </small>

                    <strong>
                        ${order.orderId}
                    </strong>

                </div>


                <div class="confirmation-detail">

                    <small>
                        Status
                    </small>

                    <strong>
                        ${order.status}
                    </strong>

                </div>


                <div class="confirmation-detail">

                    <small>
                        Payment
                    </small>

                    <strong>
                        ${escapeHtml(order.payment)}
                    </strong>

                </div>


                <div class="confirmation-detail">

                    <small>
                        Order Time
                    </small>

                    <strong>
                        ${escapeHtml(order.date)}
                    </strong>

                </div>

            </div>


            <div class="confirmation-items">

                <h3>
                    Order Summary
                </h3>

                ${itemsHtml}

            </div>


            <div class="confirmation-total">

                <span>
                    Total Amount
                </span>

                <strong>
                    ₹${order.total}
                </strong>

            </div>


            <br>


            <a
                href="#orders"
                class="primary-btn">

                View My Orders

            </a>


        </div>

    `;


    section.classList.remove(
        "hidden-section"
    );

}


/* =====================================================
                 TABLE RESERVATION
===================================================== */

function bookTable(event){

    event.preventDefault();


    const form =
        event.target;


    const name =
        document.getElementById(
            "name"
        ).value.trim();


    const email =
        document.getElementById(
            "email"
        ).value.trim();


    const phone =
        document.getElementById(
            "phone"
        ).value.trim();


    const date =
        document.getElementById(
            "date"
        ).value;


    const time =
        document.getElementById(
            "time"
        ).value;


    const guests =
        document.getElementById(
            "guests"
        ).value;


    const message =
        document.getElementById(
            "message"
        ).value.trim();


    const payment =
        document.getElementById(
            "reservationPayment"
        ).value;


    if(
        !name ||
        !email ||
        !phone ||
        !date ||
        !time ||
        !guests ||
        !payment
    ){

        showToast(
            "Please fill in all required reservation details."
        );

        return;

    }


    const selectedDate =
        new Date(
            date + "T00:00:00"
        );


    const today =
        new Date();


    today.setHours(
        0,
        0,
        0,
        0
    );


    if(selectedDate < today){

        showToast(
            "Please select today or a future date."
        );

        return;

    }


    const reservationId =
        "RES" +
        Date.now()
            .toString()
            .slice(-7);


    const reservation = {

        reservationId:

            reservationId,

        name:name,

        email:email,

        phone:phone,

        date:date,

        time:time,

        guests:guests,

        message:message,

        payment:payment,

        deposit:
            reservationFee,

        status:
            "Table Reserved",

        createdAt:

            new Date()
                .toLocaleString(
                    "en-IN"
                )

    };


    saveReservation(
        reservation
    );


    form.reset();


    showReservationConfirmation(
        reservation
    );


    renderReservationHistory();


    document.getElementById(
        "reservationConfirmation"
    ).scrollIntoView({

        behavior:"smooth",

        block:"start"

    });

}


/* =====================================================
            GET RESERVATIONS
===================================================== */

function getReservations(){

    try{

        return JSON.parse(
            localStorage.getItem(
                RESERVATION_KEY
            )
        ) || [];

    }catch(error){

        return [];

    }

}


/* =====================================================
             SAVE RESERVATION
===================================================== */

function saveReservation(
    reservation
){

    const reservations =
        getReservations();


    reservations.unshift(
        reservation
    );


    localStorage.setItem(

        RESERVATION_KEY,

        JSON.stringify(
            reservations
        )

    );

}


/* =====================================================
        RESERVATION CONFIRMATION
===================================================== */

function showReservationConfirmation(
    reservation
){

    const section =
        document.getElementById(
            "reservationConfirmation"
        );


    const content =
        document.getElementById(
            "reservationConfirmationContent"
        );


    if(!section || !content){

        return;

    }


    content.innerHTML = `

        <div class="confirmation-card">


            <div class="confirmation-icon">

                ✓

            </div>


            <p class="section-label">

                TABLE RESERVATION

            </p>


            <h2>

                Table
                <span>
                    Reserved Successfully!
                </span>

            </h2>


            <p>

                Thank you,
                ${escapeHtml(reservation.name)}.
                Your table reservation
                has been saved.

            </p>


            <div class="confirmation-details">


                <div class="confirmation-detail">

                    <small>
                        Reservation ID
                    </small>

                    <strong>
                        ${reservation.reservationId}
                    </strong>

                </div>


                <div class="confirmation-detail">

                    <small>
                        Status
                    </small>

                    <strong>
                        ${reservation.status}
                    </strong>

                </div>


                <div class="confirmation-detail">

                    <small>
                        Date
                    </small>

                    <strong>
                        ${escapeHtml(reservation.date)}
                    </strong>

                </div>


                <div class="confirmation-detail">

                    <small>
                        Time
                    </small>

                    <strong>
                        ${escapeHtml(reservation.time)}
                    </strong>

                </div>


                <div class="confirmation-detail">

                    <small>
                        Guests
                    </small>

                    <strong>
                        ${escapeHtml(reservation.guests)}
                    </strong>

                </div>


                <div class="confirmation-detail">

                    <small>
                        Payment
                    </small>

                    <strong>
                        ${escapeHtml(reservation.payment)}
                    </strong>

                </div>

            </div>


            <div class="confirmation-total">

                <span>
                    Reservation Deposit
                </span>

                <strong>
                    ₹${reservation.deposit}
                </strong>

            </div>


            <br>


            <a
                href="#orders"
                class="primary-btn">

                View My Reservations

            </a>


        </div>

    `;


    section.classList.remove(
        "hidden-section"
    );

}


/* =====================================================
                 ORDER HISTORY
===================================================== */

function renderOrderHistory(){

    const container =
        document.getElementById(
            "orderHistory"
        );


    if(!container){

        return;

    }


    const orders =
        getOrders();


    if(orders.length === 0){

        container.innerHTML = `

            <div class="empty-history">

                <h3>
                    No Food Orders Yet
                </h3>

                <p>
                    Your completed food orders
                    will appear here.
                </p>

                <br>

                <a
                    href="#menu"
                    class="primary-btn">

                    Explore Menu

                </a>

            </div>

        `;

        return;

    }


    let html = "";


    orders.forEach(order=>{

        let items =
            order.items.map(
                item=>{

                    return `
                        ${escapeHtml(item.name)}
                        ×
                        ${item.quantity}
                    `;

                }
            ).join(", ");


        html += `

            <div class="history-card">


                <div class="history-top">

                    <h3>
                        ${order.orderId}
                    </h3>

                    <span class="history-status">

                        ${order.status}

                    </span>

                </div>


                <div class="history-line">

                    <span>
                        Date
                    </span>

                    <strong>
                        ${escapeHtml(order.date)}
                    </strong>

                </div>


                <div class="history-line">

                    <span>
                        Items
                    </span>

                    <strong>
                        ${items}
                    </strong>

                </div>


                <div class="history-line">

                    <span>
                        Payment
                    </span>

                    <strong>
                        ${escapeHtml(order.payment)}
                    </strong>

                </div>


                <div class="history-line">

                    <span>
                        Total
                    </span>

                    <strong>
                        ₹${order.total}
                    </strong>

                </div>


            </div>

        `;

    });


    html += `

        <button
            class="clear-history"
            onclick="clearOrders()">

            Clear Food Order History

        </button>

    `;


    container.innerHTML =
        html;

}


/* =====================================================
             RESERVATION HISTORY
===================================================== */

function renderReservationHistory(){

    const container =
        document.getElementById(
            "reservationHistory"
        );


    if(!container){

        return;

    }


    const reservations =
        getReservations();


    if(reservations.length === 0){

        container.innerHTML = `

            <div class="empty-history">

                <h3>
                    No Reservations Yet
                </h3>

                <p>
                    Your table reservations
                    will appear here.
                </p>

                <br>

                <a
                    href="#contact"
                    class="primary-btn">

                    Book a Table

                </a>

            </div>

        `;

        return;

    }


    let html = "";


    reservations.forEach(
        reservation=>{

            html += `

                <div class="history-card">


                    <div class="history-top">

                        <h3>
                            ${reservation.reservationId}
                        </h3>

                        <span class="history-status">

                            ${reservation.status}

                        </span>

                    </div>


                    <div class="history-line">

                        <span>
                            Name
                        </span>

                        <strong>
                            ${escapeHtml(
                                reservation.name
                            )}
                        </strong>

                    </div>


                    <div class="history-line">

                        <span>
                            Date & Time
                        </span>

                        <strong>

                            ${escapeHtml(
                                reservation.date
                            )}

                            •

                            ${escapeHtml(
                                reservation.time
                            )}

                        </strong>

                    </div>


                    <div class="history-line">

                        <span>
                            Guests
                        </span>

                        <strong>
                            ${escapeHtml(
                                reservation.guests
                            )}
                        </strong>

                    </div>


                    <div class="history-line">

                        <span>
                            Payment
                        </span>

                        <strong>
                            ${escapeHtml(
                                reservation.payment
                            )}
                        </strong>

                    </div>


                    <div class="history-line">

                        <span>
                            Deposit
                        </span>

                        <strong>
                            ₹${reservation.deposit}
                        </strong>

                    </div>


                </div>

            `;

        }
    );


    html += `

        <button
            class="clear-history"
            onclick="clearReservations()">

            Clear Reservation History

        </button>

    `;


    container.innerHTML =
        html;

}


/* =====================================================
                  HISTORY TABS
===================================================== */

function showHistory(
    type,
    button
){

    document
        .querySelectorAll(
            ".history-tab"
        )
        .forEach(tab=>{

            tab.classList.remove(
                "active"
            );

        });


    button.classList.add(
        "active"
    );


    const orders =
        document.getElementById(
            "orderHistory"
        );


    const reservations =
        document.getElementById(
            "reservationHistory"
        );


    if(type === "orders"){

        orders.classList.remove(
            "history-hidden"
        );

        reservations.classList.add(
            "history-hidden"
        );

    }else{

        orders.classList.add(
            "history-hidden"
        );

        reservations.classList.remove(
            "history-hidden"
        );

    }

}


/* =====================================================
                CLEAR HISTORY
===================================================== */

function clearOrders(){

    localStorage.removeItem(
        ORDER_KEY
    );

    renderOrderHistory();

    showToast(
        "Food order history cleared."
    );

}


function clearReservations(){

    localStorage.removeItem(
        RESERVATION_KEY
    );

    renderReservationHistory();

    showToast(
        "Reservation history cleared."
    );

}


/* =====================================================
                     SEARCH
===================================================== */

function openSearch(){

    document.getElementById(
        "searchBox"
    ).style.display = "block";


    document.getElementById(
        "searchInput"
    ).focus();

}


function closeSearch(){

    document.getElementById(
        "searchBox"
    ).style.display = "none";

}


function searchMenu(){

    let searchText =
        document.getElementById(
            "searchInput"
        ).value
        .toLowerCase()
        .trim();


    let items =
        document.querySelectorAll(
            ".menu-item"
        );


    let results =
        document.getElementById(
            "searchResults"
        );


    results.innerHTML = "";


    if(searchText === ""){

        return;

    }


    let found = false;


    items.forEach(item=>{

        let name =
            item
                .querySelector("h3")
                .textContent
                .toLowerCase();


        if(name.includes(searchText)){

            found = true;


            let result =
                document.createElement(
                    "div"
                );


            result.className =
                "search-result";


            result.textContent =
                item
                    .querySelector("h3")
                    .textContent;


            result.onclick =
                function(){

                    closeSearch();


                    item.scrollIntoView({

                        behavior:"smooth",

                        block:"center"

                    });

                };


            results.appendChild(
                result
            );

        }

    });


    if(!found){

        results.innerHTML =
            "<div class='search-result'>No item found.</div>";

    }

}


/* =====================================================
                  MENU FILTER
===================================================== */

function filterMenu(
    category,
    button
){

    let items =
        document.querySelectorAll(
            ".menu-item"
        );


    let buttons =
        document.querySelectorAll(
            ".menu-tabs button"
        );


    buttons.forEach(btn=>{

        btn.classList.remove(
            "active"
        );

    });


    button.classList.add(
        "active"
    );


    items.forEach(item=>{

        if(
            category === "all" ||
            item.classList.contains(
                category
            )
        ){

            item.style.display =
                "flex";

        }else{

            item.style.display =
                "none";

        }

    });

}


/* =====================================================
                     TOAST
===================================================== */

function showToast(message){

    let toast =
        document.getElementById(
            "toast"
        );


    if(!toast){

        return;

    }


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    setTimeout(
        function(){

            toast.classList.remove(
                "show"
            );

        },
        2500
    );

}


/* =====================================================
                  DARK / LIGHT MODE
===================================================== */

function applySavedTheme(){

    let savedTheme =
        localStorage.getItem(
            THEME_KEY
        );


    let toggle =
        document.getElementById(
            "themeToggle"
        );


    if(savedTheme === "dark"){

        document.body.classList.add(
            "dark-mode"
        );


        if(toggle){

            toggle.textContent =
                "☀️";

            toggle.title =
                "Switch to Light Mode";

        }

    }else{

        document.body.classList.remove(
            "dark-mode"
        );


        if(toggle){

            toggle.textContent =
                "🌙";

            toggle.title =
                "Switch to Dark Mode";

        }

    }

}


/* =====================================================
                    TOGGLE THEME
===================================================== */

function toggleTheme(){

    document.body.classList.toggle(
        "dark-mode"
    );


    let isDark =
        document.body.classList.contains(
            "dark-mode"
        );


    localStorage.setItem(

        THEME_KEY,

        isDark
            ? "dark"
            : "light"

    );


    let toggle =
        document.getElementById(
            "themeToggle"
        );


    if(toggle){

        toggle.textContent =
            isDark
                ? "☀️"
                : "🌙";


        toggle.title =
            isDark
                ? "Switch to Light Mode"
                : "Switch to Dark Mode";

    }


    showToast(

        isDark
            ? "Dark Mode enabled 🌙"
            : "Light Mode enabled ☀️"

    );

}


/* =====================================================
                   ESCAPE HTML
===================================================== */

function escapeHtml(value){

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        value == null
            ? ""
            : value;


    return div.innerHTML;

}


/* =====================================================
                  CLOSE MODALS
===================================================== */

window.onclick =
    function(event){

        let cartModal =
            document.getElementById(
                "cartModal"
            );


        let checkoutModal =
            document.getElementById(
                "checkoutModal"
            );


        if(
            event.target ===
            cartModal
        ){

            closeCart();

        }


        if(
            event.target ===
            checkoutModal
        ){

            closeCheckout();

        }

    };


/* =====================================================
                 INITIAL LOAD
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function(){

        applySavedTheme();

        updateCart();

        renderOrderHistory();

        renderReservationHistory();


        const reservationDate =
            document.getElementById(
                "date"
            );


        if(reservationDate){

            const today =
                new Date();


            const year =
                today.getFullYear();


            const month =
                String(
                    today.getMonth() + 1
                ).padStart(2,"0");


            const day =
                String(
                    today.getDate()
                ).padStart(2,"0");


            reservationDate.min =
                `${year}-${month}-${day}`;

        }

    }
);
