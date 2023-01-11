<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class StatistikController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    //

    public function index(Request $request)
    {
        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_URL => 'http://localhost:7000/statistik',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => 'GET',
        ));

        $response = curl_exec($curl);

        curl_close($curl);
        $data = [];
        $labels = [];
        $data_res = json_decode($response);
        $data_response = $data_res->data;
        foreach ($data_response as $d) {
            $labels[] = $d->username;
            $data[] = $d->durations;
        }

        return view('statistik', compact('labels', 'data'));
    }


}
