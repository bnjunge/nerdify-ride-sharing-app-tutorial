<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,500;1,900&display=swap"
        rel="stylesheet">
    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css">
    <title>Nerdify - Ride with the Nerds</title>

    <style>
           body {
            font-family: 'Montserrat', sans-serif;
        }

        .nerdify {
            font-weight: 900;
            font-style: italic;
        }
        .card-body {
            position: absolute; 
            bottom: 0; 
            z-index: 6; 
            width: 100%; 
            background-color: #fcb900
        }
    </style>
</head>

<body class="container" style="padding: 0;">
    <div id="map" style="height: 60vh;"></div>

    <div style="">
        <div class="col-sm-10 card-body" >
            <h1 class="">Hey <span class="nerdify">Nerd!</span></h1>
            <div id="trip-details"></div>
        </div>
    </div>

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p"
        crossorigin="anonymous"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"></script>
    <script src="app.js"></script>
    <script
    src="https://maps.googleapis.com/maps/api/js?key={YOUR_API_KEY}&libraries=places,geometry&callback=initMap"></script>

</body>
</html>