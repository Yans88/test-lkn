<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Test LKN - Statistik Pengunjung</title>


    <style>
        body {
            text-align: center;
            padding: 100px;
            font: 20px Helvetica, 'Nunito', sans-serif;
            color: #333;
            background-color: #d5f0f3;
        }

        h1 {
            font-size: 50px;
        }

        span {
            font-size: 17px;
        }
        #myChart {
            --bg-opacity: 1;
            padding: 30px;
            background-color: rgba(247, 250, 252, var(--bg-opacity));
        }

    </style>
</head>
<body>
<canvas id="myChart" height="130px" style="display: inline-block;"></canvas>

</body>
</html>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script type="text/javascript">
    const ctx = document.getElementById('myChart');
    const labels =  @json($labels);
    const data =  @json($data);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Durasi',
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: data,
                borderWidth: 1.3,
                tension: 0.1,
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Statistik Pengunjung',
                }
            }
        }
    });
</script>
