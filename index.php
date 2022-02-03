<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="theme-color" content="#ffffff">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,500;1,900&display=swap"
        rel="stylesheet">
    <title>Nerdify - Ride with the Nerds</title>

    <style>
        body {
            font-family: 'Montserrat', sans-serif;
        }

        .nerdify {
            font-weight: 900;
            font-style: italic;
        }

        #distance. #payment {
            display: none;
        }
        .card-body {
            position: absolute; 
            top: 0; 
            z-index: 6; 
            width: 100%; 
            background-color: #fcb900;
        }
        .btn-warning {
            top: 85%; 
            z-index: 6; 
            width: 90%; 
            margin: 3px auto; 
            border-radius: 0; 
            height: 50px; 
            left: 5%
        }
    </style>
</head>

<body class="container" style="padding: 0;">
    <div style="position: relative">
        <div class="col-sm-10 card-body">
            <h1 class="nerdify">Nerdify</h1>
            <h3 class="small">Nerds Sharing Rides</h3>
            <div class="mb-3">
                <input type="text" class="form-control" id="pickup" placeholder="Pickup">
            </div>
            <div class="mb-3">
                <input type="text" class="form-control" id="dropoff" placeholder="Dropoff">
            </div>


            <div id="distance"></div>
        </div>


        <button id="payment" class="btn btn-warning"></button>

        <div id="map" style="height: 100vh;"></div>

    </div>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p"
        crossorigin="anonymous"></script>
    <script src="app.js"></script>
    <script src="https://maps.googleapis.com/maps/api/js?key={YOUR_API_KEY}&libraries=places,geometry&callback=initMap"></script>
</body>
</html>