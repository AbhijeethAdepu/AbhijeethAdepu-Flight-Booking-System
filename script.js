console.log("JS loaded");

let selectedFlights = [];

// 🔍 SEARCH FLIGHTS
function searchFlights() {
  const from = document.getElementById("from").value;
  const to = document.getElementById("to").value;
  const mode = document.getElementById("mode").value;

  document.getElementById("result").innerHTML =
    `<div class="text-center">🔄 Searching best routes...</div>`;

  fetch(`http://localhost:5000/search?from=${from}&to=${to}&mode=${mode}`)
    .then(res => res.json())
    .then(data => {

      if (data.message) {
        document.getElementById("result").innerHTML =
          `<div class="alert alert-danger">${data.message}</div>`;
        return;
      }

      let html = `
        <div class="mb-3">
          <h4>✈️ Route: ${data.route.join(" → ")}</h4>
        </div>
      `;

      data.segments.forEach(segment => {
        html += `
          <div class="mb-3">
            <h5>${segment.from} → ${segment.to}</h5>
        `;

        segment.flights.forEach(f => {
          html += `
            <div class="flight-card">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  ✈️ <strong>${f.airline}</strong><br>
                  <small>Seats: ${f.available_seats}</small>
                </div>

                <div class="text-right">
                  <div class="price">₹${f.price}</div>
                  <button class="btn btn-success btn-sm mt-1"
                    onclick='selectFlight(${JSON.stringify(f)}, this)'>
                    Select
                  </button>
                </div>
              </div>
            </div>
          `;
        });

        html += `</div>`;
      });

      document.getElementById("result").innerHTML = html;
    });
}

// 🎯 SELECT FLIGHT
function selectFlight(flight, btn) {
  selectedFlights = [flight];

  // reset all buttons
  document.querySelectorAll(".btn-success").forEach(b => {
    b.innerText = "Select";
    b.disabled = false;
  });

  // mark selected
  btn.innerText = "Selected";
  btn.disabled = true;

  document.getElementById("selectedFlight").innerHTML = `
    <div class="alert alert-info">
      ✅ Selected: <strong>${flight.airline}</strong> | ₹${flight.price}
    </div>
  `;

  document.getElementById("bookingSection").style.display = "block";
}

// 💳 BOOK TICKET
function bookTicket() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;

  if (!name || !email) {
    alert("Please enter name and email");
    return;
  }

  fetch("http://localhost:5000/booking", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name,
      email,
      route: selectedFlights,
      total_cost: selectedFlights[0]?.price || 0
    })
  })
  .then(res => res.json())
  .then(data => {

    // save booking
    localStorage.setItem("lastBooking", JSON.stringify(data));

    showBookingResult(data);

    // clear inputs
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
  });
}

// 🧠 SHOW BOOKING RESULT
function showBookingResult(data) {
  document.getElementById("bookingResult").innerHTML = `
    <div class="alert ${data.status === "SUCCESSFUL" ? "alert-success" : "alert-danger"}">
      🎟️ Booking ${data.status}<br>
      <strong>Booking ID:</strong> ${data.booking_id}
    </div>
  `;

  document.getElementById("bookingResult").scrollIntoView({
    behavior: "smooth"
  });
}

// 📜 LOAD BOOKINGS
function loadBookings() {
  fetch("http://localhost:5000/booking")
    .then(res => res.json())
    .then(data => {

      if (data.length === 0) {
        document.getElementById("bookingList").innerHTML =
          "<p>No bookings yet</p>";
        return;
      }

      let html = "";

      data.forEach(b => {
        const route = JSON.parse(b.route);
        const routeText = route.map(f => f.airline).join(" → ");

        html += `
          <div class="flight-card">
            <h5>${routeText}</h5>
            <p><strong>Name:</strong> ${b.name}</p>
            <p><strong>Email:</strong> ${b.email}</p>
            <p><strong>Status:</strong> ${b.status}</p>
            <p><strong>Total:</strong> ₹${b.total_cost}</p>
          </div>
        `;
      });

      document.getElementById("bookingList").innerHTML = html;
    });
}

// 🔁 LOAD LAST BOOKING ON REFRESH
window.onload = function () {
  const lastBooking = localStorage.getItem("lastBooking");

  if (lastBooking) {
    showBookingResult(JSON.parse(lastBooking));

    // ❗ clear after showing once
    localStorage.removeItem("lastBooking");
  }
};