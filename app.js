/**
 * For Tutorial Purposes Only
 * 
 * @description: We want to build a simple RideSharing App that allows users to
 *               share a ride with other users. We will do this using HTML and Javascript
 *               and Google Maps API.
 *            - We will also use LocalStorage to store the data of the users and trip information.
 *            - We will process Payments using M-PESA STK API to initiate payments and M-PESA STK Query API to check the status of payments.
 *
 *            - We will use the following APIs:
 *              - Google Maps API
 *              - M-PESA STK API
 *              - M-PESA STK Query API
 *              - LocalStorage
 *
 * @tutorial: https://developers.google.com/maps/documentation/javascript/tutorial
 * @tutorial: https://youtube.com/c/survtech
 * @author:  Benson Njunge (survtechke@gmail.com)
 */

/**
 * @description: define two things we will need about maps
 * 
 */
var map, marker;

/**
 * set default map view location
 * 
 */
var _default = { lat: -0.284925, lng: 36.0701259 };

/**
 * @description: map initialization function, called when the page loads
 * 
 */
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 14,
    center: _default,
    focus: false,
    gestureHandling: "greedy",
  });

  marker = new google.maps.Marker({
    position: _default,
    map: map,
    draggable: false,
    title: "Hello World!",
  });
}

/**
 * @description:
 * STEP 1: Create Our Frontend and Functionality
 *  on index page, we want to listen to events and load specific items that we will need
 *  so we restrict execution of part of this script only to run when the page is index.php or the root is loaded
 */
if (
  window.location.pathname == "/index.php" ||
  window.location.pathname == "/"
) {
  $(() => {
    /**
     * @description: next, lets get our input fields for pickup and dropoff
     *
     */
    let pickup = document.getElementById("pickup");
    let dropoff = document.getElementById("dropoff");

    /**
     * @description: we initialize google maps js api on the inputs
     * for pickup and dropoff
     */

    let pickup_autocomplete = new google.maps.places.Autocomplete(pickup);
    let dropoff_autocomplete = new google.maps.places.Autocomplete(dropoff);

    /**
     * @description: now we want to listen to the input fields for pickup and dropoff and load Googles' autocomplete
     */

    google.maps.event.addListener(pickup_autocomplete, "place_changed", () => {
      /**
       * @description: get place name from google autocomplete callback
       */
      let place = pickup_autocomplete.getPlace();

      /**
       * @description: extract lat and lng from place object
       */
      let lat = place.geometry.location.lat();
      let lon = place.geometry.location.lng();

      /**
       * @description: set the marker to the new location and center the map on it
       */
      map.setCenter({ lat: lat, lng: lon });

      /**
       * @description: save the new location to the database(LocalStorage)
       */
      localStorage.setItem(
        "pickup",
        JSON.stringify({ lat: lat, lng: lon, place_name: place.name })
      );

      /**
       * @description: if there were any markers on the map, remove them
       * @see: https://developers.google.com/maps/documentation/javascript/reference/marker#Marker.setMap
       * 
       */
      if (marker) {
        marker.setMap(null);
      }

      /**
       * @description: next, we want to create a marker for the new pickup location
       * @see: https://developers.google.com/maps/documentation/javascript/markers
       * 
       */
      marker = new google.maps.Marker({
        position: { lat: lat, lng: lon },
        map: map,
        title: "Pickup",
        draggable: false,
        animation: google.maps.Animation.DROP, // optional
      });
    });

    /**
     * @description: Listen for changes on the dropoff input field and load places using Googles' autocomplete
     * @see: https://developers.google.com/maps/documentation/javascript/places-autocomplete
     * 
     */

    google.maps.event.addListener(dropoff_autocomplete, "place_changed", () => {
      /**
       * @description: get place name from google autocomplete callback
       * 
       */
      let place = dropoff_autocomplete.getPlace();

      /**
       * @description: extract lat and lng from place object
       * 
       */
      let lat = place.geometry.location.lat();
      let lon = place.geometry.location.lng();

      /**
       * @description: get place name
       * 
       */
      let place_name = place.name;

      /**
       * @description now that we have our pickup and dropoff locations on the map, and database,
       * lets calculate the distance between them.
       *
       * We will use the google maps api to calculate the distance between the two locations, here, we will use the distance matrix api(geometry)
       * Although this is still not optimally the best way to calculate the distance, it is a good way to get a rough estimate of the distance
       *
       * We will then get the diretion between the two locations, and then we will use the direction api to get the duration of the journey
       *  finally, we will render the line joining the two locations on the map
       *
       * Then we will show a button to the user to book the ride
       *
       * calculate the distance between the two locations
       *
       * get the pickup location from the database
       *
       */
      let _destination = { lat: lat, lng: lon };
      let _pickup = JSON.parse(localStorage.getItem("pickup"));

      /**
       * @description: join the pickup and dropoff locations
       *
       */
      let d_pickup = new google.maps.LatLng(_pickup.lat, _pickup.lng);
      let d_dropoff = new google.maps.LatLng(
        place.geometry.location.lat(),
        place.geometry.location.lng()
      );

      /**
       * @description: for us to get distance, we need to create a google maps api service object(Directions request)
       * create a new directions request object
       * @see: https://developers.google.com/maps/documentation/javascript/directions
       * 
       */
      let directions_request = {
        origin: d_pickup,
        destination: d_dropoff,
        travelMode: google.maps.TravelMode.DRIVING,
        optimizeWaypoints: true,
        provideRouteAlternatives: true,
        unitSystem: google.maps.UnitSystem.METRIC,
      };

      /**
       * @description: Initialize the directions service
       * @see: https://developers.google.com/maps/documentation/javascript/directions#DirectionsRequests
       *
       */
      let directions_service = new google.maps.DirectionsService();

      /**
       * @description: get the distance between the two locations using the directions service
       *
       */
      directions_service.route(directions_request, (response, status) => {
        if (status == google.maps.DirectionsStatus.OK) {
          /**
           * @description: find the routes
           * 
           */
          let routes = response.routes;

          /**
           * @description: set the route
           * 
           */
          let route = response.routes[0];

          /**
           * @description: get time for the route
           * 
           */
          let duration = route.legs[0].duration.text;

          /**
           * @description: Draw the route on the map
           *
           */
          let directions_renderer = new google.maps.DirectionsRenderer({
            map: map,
            directions: response,
            draggable: false,
            panel: document.getElementById("directions"),
            routeIndex: 0,
          });

          /**
           * @description: show the next button
           *
           */
          $("#payment")
            .show("slow")
            .css("position", "absolute")
            .text(`Proceed`);

          /**
           * @description: show time for the trip
           *
           */
          $("#time").text(` Time Apprx: ${duration}`);
        } else {
          console.log(status);
        }
      });

      /**
       * @description: Add a marker for dropoff location on the map
       * 
       */
      _destination.place_name = place_name;
      localStorage.setItem("dropoff", JSON.stringify(_destination));

      marker = new google.maps.Marker({
        position: { lat: lat, lng: lon },
        map: map,
        title: "Dropoff",
        draggable: false,
        animation: google.maps.Animation.DROP,
      });
    });

    /**
     * @description: now we want to listen to the next button and proceed to the payment page
     *
     */
    $("#payment").on("click", (e) => {
      window.location.href = `/tripinfo.php`;
    });
  });
}

/**
 * STEP 2:
 * @description: Now that we have our pickup and dropoff locations on the map, and database,
 * lets now take the user to the next screen where they will see the trip details and finaly pay for the trip
 *
 */
if (window.location.pathname == "/tripinfo.php") {
  $(() => {
    /**
     * @description: We start by getting our pickup and dropoff locations from the database(LocalStorage)
     *
     */
    let pickup = JSON.parse(localStorage.getItem("pickup"));
    let dropoff = JSON.parse(localStorage.getItem("dropoff"));

    /**
     * @description: Then we will get the distance between the two locations
     * @see: https://developers.google.com/maps/documentation/javascript/distancematrix
     *
     */
    let distance = google.maps.geometry.spherical.computeDistanceBetween(
      pickup,
      dropoff
    );

    /**
     * @description: Now we will get the duration, price, and distance between the two locations
     *
     * Object below, looks familiar? Yes, it was a google maps api object that we use with direction service
     * to find the duration and points between the two locations
     * 
     */
    let directions_request = {
      origin: pickup,
      destination: dropoff,
      travelMode: google.maps.TravelMode.DRIVING,
      optimizeWaypoints: true,
      provideRouteAlternatives: true,
      unitSystem: google.maps.UnitSystem.METRIC,
    };

    /**
     * @description: Lets have our duration variable here so we can use it later
     *
     */
    var duration;

    /**
     * @description: send the directions request
     * 
     */
    let directions_service = new google.maps.DirectionsService();
    directions_service.route(directions_request, async (response, status) => {
      if (status == google.maps.DirectionsStatus.OK) {
        let route = response.routes[0];
        duration = route.legs[0].duration.text;

        /**
         * @description: Now we set the duration and display on our page
         * 
         */
        $("#time_taken").text(`Approx Time: ${duration}`);

        /**
         * @description: render the line joining the two locations
         * 
         */
        let directions_renderer = new google.maps.DirectionsRenderer({
          map: map,
          directions: response,
          draggable: false,
          panel: document.getElementById("directions"),
          routeIndex: 0,
        });
      }
    });

    /**
     * @description: calculate the cost for the trip using your price factor. You can have many price factors
     * such as time of day or night, type of vehicle, weather, minimum fee etc
     *
     */
    let cost = Math.ceil(distance / 1000) * 1;

    /**
     * @description: Then the normal jQuery stuff to update the page and prompt the user to pay
     *
     */
    $("#payment")
      .removeClass("btn-info")
      .addClass("btn-success")
      .text(`Pay Ksh. ${cost} via M-PESA`);

    /**
     * @description: show the cost in the UI
     *
     */
    let html = `
    <div class="card mb-2">
    <div class="card-body">
      <h5 class="card-title">Trip Details</h5>
      <p class="card-text">
        <!-- ~ -->
        <!-- Trip Summary details -->
        <p>Pickup: ${pickup.place_name}</p>
        <p>Dropoff: ${dropoff.place_name}</p>
        <p>Distance: ${Math.ceil(distance / 1000)} km</p>
        <p><span id="time_taken"></span></p>

        <!-- ~ -->
        <!-- Lets have an input field for user to enter their phone number -->

        <input type="number" class="form-control" placeholder="Enter Phone" />

        <!-- ~ -->
        <!-- The payment button take not of the id attribute because we will attachk an event listener to it -->
        <button id="payment" class="btn btn-warning block mt-3 mx-auto"
            style="height: 50px; width: 100%;">
            Pay Kes <span id="price">${cost}</span>
        </button>

    </div>
  </div>
    `;

    $("#trip-details").html(html);

    /**
     * @description: Now we want to listen to the payment button and proceed initiate the payment
     * 
     */
    $("#payment").on("click", async (e) => {
      e.preventDefault();

      /**
       * @description: Get the phone from the input field
       * 
       */
      let phone = $("#trip-details input").val();

      /**
       * @description: Validate phone number, ensure its 10 digits so we can format it from backend
       * 
       */
      if (phone.length != 10) {
        $("#trip-details input").addClass("is-invalid");
        $("#trip-details input").focus();
        toastr.error(
          "Ops! you need to provide a valid phone number",
          "Hey Nerd!"
        );

        return;
      }

      /**
       * @description: Remove any error classes
       * 
       */
      $("#trip-details input").removeClass("is-invalid");

      /**
       * @description: Prepare data for backend processing
       * 
       */
      let trip = {
        trip_data: {
          pickup: pickup,
          dropoff: dropoff,
          distance: distance,
          duration: duration,
          status: "pending",
          cost: cost,
        },
        cost: cost,
        phone: phone,
      };

      /**
       * @description: send the trip to the server
       * 
       */
      try {
        $("#payment").html(
          `<div class="spinner-border text-success" role="status"></div>`
        );

        const response = await fetch("/api/trips.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(trip),
        });

        if (response.status == 200) {
          const data = await response.json();
          if (data.stkreqres && data.stkreqres.ResponseCode == 0) {
            /**
             * @description: show bootstrap toast message
             * 
             */
            toastr.success(
              "Payment Request Successful! Please check your phone",
              "Heads up Nerd!"
            );

            /**
             * @description: Transaction Polling
             * 
             */
            var pollInterval;
            let pollEnd = new Date().getTime() + 25000;
            var i = 0;
            const poll = async () => {
              /**
               * @description: when tiem a approx halfway done
               * 
               */
              if (i == 4) {
                toastr.clear();

                toastr.info(
                  "Still waiting for your payment. Did you allow it on your phone? If yes, just chill abit...",
                  "mmh!"
                );
              }

              /**
               * @description: if time is up, fire timeout and cancel polling
               * 
               */
              if (new Date().getTime() > pollEnd) {
                $("#payment").text(`Pay Kes ${cost} via M-PESA`);
                toastr.clear();

                toastr.error("Payment Request timed out!", "Payment Failed!");
                clearInterval(pollInterval);
                return;
              }

              /**
               * @description: send the transaction status request
               * 
               */
              const _response = await fetch(
                `/api/polling.php?id=${data.stkreqres.CheckoutRequestID}`
              );

              /**
               * @description: If we successfully hit the server without any errors
               * 
               */
              if (_response.status == 200) {
                const _data = await _response.json();

                /**
                 * @description: Check if request is successful
                 * 
                 */
                if (_data.ResultCode == 0) {
                  toastr.clear();
                  toastr.success(
                    "Payment Successful! Expect a call from our rider in a moment.",
                    "Yaay! You are awesome!"
                  );
                  $("#payment").text(`Payment Successful!`);
                  $("#trip-details input").remove();

                  $("#payment")
                    .removeClass("btn-warning")
                    .addClass("btn-success");
                  clearInterval(pollInterval);
                } else if (_data.errorCode) {
                  /**
                   * @description: Ignore if we get errCode since we're waiting for payment
                   * 
                   */
                } else {
                  /**
                   * @description: If we get an response, other than processing, we know the payment failed
                   * 
                   */
                  toastr.clear();

                  $("#payment").text(`Pay Kes ${cost} via M-PESA`);
                  toastr.error(_data.ResultDesc, "Payment Failed!");
                  clearInterval(pollInterval);
                  return;
                }

                i++;
              }
            };

            /**
             * @description: Start polling
             * 
             */
            pollInterval = setInterval(poll, 3000);
          } else {
            /**
             * @description: If we get an error from the server, we know the payment failed
             * 
             */
            $("#payment").text(`Pay Kes ${cost} via M-PESA`);
            toastr.clear();
            toastr.error(data.stkreqres.errorMessage, "M-PESA ERROR!");
          }
        } else {
          /**
           * @description: show total to pay
           *
           */
          alert("An error occured, please try again");
          $("#payment").html(`Pay Kes ${cost} via M-PESA`);
        }
      } catch (e) {
        console.log(e);
      }
    });
  });
}
