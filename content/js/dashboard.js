/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 62.652727272727276, "KoPercent": 37.347272727272724};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5682678571428571, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0085, 500, 1500, "https://stage.vow.life/vow/api/v1/cart/add"], "isController": false}, {"data": [0.98875, 500, 1500, "https://stage.vow.life/user/category/home-25"], "isController": false}, {"data": [0.93825, 500, 1500, "https://identitytoolkit.googleapis.com/v1/recaptchaParams?key=AIzaSyB9WswhYhtowy2o2L6ROaIVmlFskOyg9n0"], "isController": false}, {"data": [0.62125, 500, 1500, "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPhoneNumber?key=AIzaSyB9WswhYhtowy2o2L6ROaIVmlFskOyg9n0"], "isController": false}, {"data": [0.01075, 500, 1500, "https://stage.vow.life/vow/api/v1/cart/viewbycustomerid"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [0.97525, 500, 1500, "https://maps.googleapis.com/maps/api/mapsjs/gen_204?csp_test=true"], "isController": false}, {"data": [0.014, 500, 1500, "https://stage.vow.life/vow/api/v1/order/view"], "isController": false}, {"data": [0.99325, 500, 1500, "https://stage.vow.life/user/category/home-14"], "isController": false}, {"data": [0.0095, 500, 1500, "https://stage.vow.life/vow/api/v1/order/lastorder"], "isController": false}, {"data": [0.977, 500, 1500, "https://stage.vow.life/user/category/home-15"], "isController": false}, {"data": [0.99125, 500, 1500, "https://stage.vow.life/user/category/home-16"], "isController": false}, {"data": [0.5015, 500, 1500, "https://stage.vow.life/user/category/home-17"], "isController": false}, {"data": [0.98025, 500, 1500, "https://stage.vow.life/user/category/home-18"], "isController": false}, {"data": [0.9955, 500, 1500, "https://stage.vow.life/user/category/home-19"], "isController": false}, {"data": [0.014, 500, 1500, "https://stage.vow.life/vow/api/v1/order/viewbycustomer"], "isController": false}, {"data": [0.995, 500, 1500, "https://stage.vow.life/user/category/home-20"], "isController": false}, {"data": [0.98725, 500, 1500, "https://stage.vow.life/user/category/home-21"], "isController": false}, {"data": [0.013, 500, 1500, "https://stage.vow.life/vow/api/v1/customer/address/view"], "isController": false}, {"data": [0.97325, 500, 1500, "https://stage.vow.life/user/category/home-22"], "isController": false}, {"data": [0.51925, 500, 1500, "https://stage.vow.life/user/category/home-23"], "isController": false}, {"data": [0.98325, 500, 1500, "https://stage.vow.life/user/category/home-24"], "isController": false}, {"data": [0.0135, 500, 1500, "https://stage.vow.life/vow/api/v1/customer/address/viewbycustomer"], "isController": false}, {"data": [0.007625, 500, 1500, "https://stage.vow.life/vow/api/v1/order/precheck"], "isController": false}, {"data": [0.006, 500, 1500, "https://stage.vow.life/vow/api/v2/order/create"], "isController": false}, {"data": [0.011, 500, 1500, "https://stage.vow.life/vow/api/v1/banner/viewAll"], "isController": false}, {"data": [0.012, 500, 1500, "https://stage.vow.life/vow/api/v1/category/viewAll"], "isController": false}, {"data": [0.0115, 500, 1500, "https://stage.vow.life/vow/api/v1/subcategory/viewcan"], "isController": false}, {"data": [0.97725, 500, 1500, "https://stage.vow.life/user/category/home-9"], "isController": false}, {"data": [0.0115, 500, 1500, "https://stage.vow.life/vow/api/v1/customer/slot/viewall"], "isController": false}, {"data": [0.0125, 500, 1500, "https://stage.vow.life/vow/api/v1/taxcharges/viewAll"], "isController": false}, {"data": [0.23225, 500, 1500, "https://stage.vow.life/user/category/home"], "isController": false}, {"data": [0.98475, 500, 1500, "https://stage.vow.life/user/category/home-5"], "isController": false}, {"data": [0.97525, 500, 1500, "https://stage.vow.life/user/category/home-10"], "isController": false}, {"data": [0.98725, 500, 1500, "https://stage.vow.life/user/category/home-6"], "isController": false}, {"data": [0.98575, 500, 1500, "https://stage.vow.life/user/category/home-11"], "isController": false}, {"data": [0.95975, 500, 1500, "https://stage.vow.life/user/category/home-7"], "isController": false}, {"data": [0.9905, 500, 1500, "https://stage.vow.life/user/category/home-12"], "isController": false}, {"data": [0.011, 500, 1500, "https://stage.vow.life/vow/api/v2/sub/products"], "isController": false}, {"data": [0.96675, 500, 1500, "https://stage.vow.life/user/category/home-8"], "isController": false}, {"data": [0.96175, 500, 1500, "https://stage.vow.life/user/category/home-13"], "isController": false}, {"data": [0.9895, 500, 1500, "https://stage.vow.life/user/category/home-1"], "isController": false}, {"data": [0.9985, 500, 1500, "https://stage.vow.life/user/category/home-2"], "isController": false}, {"data": [0.99825, 500, 1500, "https://stage.vow.life/user/category/home-3"], "isController": false}, {"data": [0.97875, 500, 1500, "https://stage.vow.life/user/category/home-4"], "isController": false}, {"data": [0.018, 500, 1500, "https://stage.vow.life/vow/api/v1/customer/userexist"], "isController": false}, {"data": [0.99325, 500, 1500, "https://stage.vow.life/user/category/home-0"], "isController": false}, {"data": [0.98825, 500, 1500, "https://www.instamojo.com/webapi/checkout-assets/"], "isController": false}, {"data": [0.24375, 500, 1500, "https://identitytoolkit.googleapis.com/v1/accounts:sendVerificationCode?key=AIzaSyB9WswhYhtowy2o2L6ROaIVmlFskOyg9n0"], "isController": false}, {"data": [0.9855, 500, 1500, "https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyB9WswhYhtowy2o2L6ROaIVmlFskOyg9n0"], "isController": false}, {"data": [0.0095, 500, 1500, "https://stage.vow.life/vow/api/v1/product/view"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 110000, 41082, 37.347272727272724, 199.84176363636382, 0, 16439, 156.0, 368.0, 904.0, 1586.9900000000016, 181.22956018880825, 22373.24164046475, 154.5170824306179], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://stage.vow.life/vow/api/v1/cart/add", 2000, 1983, 99.15, 88.62149999999997, 32, 992, 47.0, 165.0, 174.0, 379.9100000000001, 3.3314843595138033, 2.602743302987675, 2.836967149898473], "isController": false}, {"data": ["https://stage.vow.life/user/category/home-25", 2000, 1, 0.05, 70.62350000000004, 0, 15795, 30.0, 83.90000000000009, 146.84999999999945, 1058.0, 3.3411460465054117, 198.22866140533614, 1.7219170410142384], "isController": false}, {"data": ["https://identitytoolkit.googleapis.com/v1/recaptchaParams?key=AIzaSyB9WswhYhtowy2o2L6ROaIVmlFskOyg9n0", 2000, 0, 0.0, 363.53049999999996, 204, 2644, 302.0, 509.0, 549.9499999999998, 978.99, 3.330574507449662, 2.2800124313693493, 1.7791252495849272], "isController": false}, {"data": ["https://identitytoolkit.googleapis.com/v1/accounts:signInWithPhoneNumber?key=AIzaSyB9WswhYhtowy2o2L6ROaIVmlFskOyg9n0", 2000, 0, 0.0, 701.3710000000005, 440, 5773, 605.0, 1025.9, 1300.6499999999987, 2199.7200000000003, 3.3309960844141027, 5.451903747537144, 2.5372821736748046], "isController": false}, {"data": ["https://stage.vow.life/vow/api/v1/cart/viewbycustomerid", 6000, 5935, 98.91666666666667, 102.1015000000002, 32, 2309, 51.0, 169.0, 236.0, 460.8299999999963, 9.949324772492108, 7.797656980653538, 6.888741468454007], "isController": false}, {"data": ["Test", 2000, 1995, 99.75, 5372.9254999999985, 2740, 21187, 4975.0, 7140.500000000002, 7715.349999999998, 9870.870000000004, 3.294610675856434, 10979.365904815402, 105.8255637361997], "isController": true}, {"data": ["https://maps.googleapis.com/maps/api/mapsjs/gen_204?csp_test=true", 2000, 0, 0.0, 143.54949999999994, 37, 9546, 66.0, 122.0, 280.0, 2325.370000000001, 3.3607966432363128, 1.3981439160338567, 1.1880941258315871], "isController": false}, {"data": ["https://stage.vow.life/vow/api/v1/order/view", 2000, 1972, 98.6, 89.70100000000012, 33, 1019, 48.0, 165.0, 175.0, 389.9100000000001, 3.3600739216262756, 2.771219326200176, 2.2116111554454196], "isController": false}, {"data": ["https://stage.vow.life/user/category/home-14", 2000, 0, 0.0, 84.71849999999995, 33, 1335, 51.0, 136.0, 189.94999999999982, 637.98, 3.337115397450444, 88.32090594600963, 1.6522631899486082], "isController": false}, {"data": ["https://stage.vow.life/vow/api/v1/order/lastorder", 2000, 1981, 99.05, 87.3145, 33, 1147, 47.0, 164.0, 171.0, 348.98, 3.333255557370328, 2.70652050670901, 2.288358063311856], "isController": false}, {"data": ["https://stage.vow.life/user/category/home-15", 2000, 1, 0.05, 147.03049999999996, 23, 2315, 99.0, 182.80000000000018, 414.89999999999964, 1148.0, 3.337404967393553, 41.27690078771101, 1.622262363208114], "isController": false}, {"data": ["https://stage.vow.life/user/category/home-16", 2000, 0, 0.0, 120.29599999999988, 39, 1606, 85.5, 181.0, 251.94999999999982, 1117.6500000000012, 3.338106826094649, 248.514161057604, 1.65927380320525], "isController": false}, {"data": ["https://stage.vow.life/user/category/home-17", 2000, 1, 0.05, 1021.0995000000022, 73, 3477, 973.0, 1549.9, 1731.9499999999998, 2537.3900000000003, 3.3336278037893345, 280.0278526556304, 1.6334418134018505], "isController": false}, {"data": ["https://stage.vow.life/user/category/home-18", 2000, 0, 0.0, 139.61999999999992, 15, 2308, 87.0, 199.9000000000001, 381.89999999999964, 1177.97, 3.3388925894948422, 278.07418329383006, 1.7183558541638495], "isController": false}, {"data": ["https://stage.vow.life/user/category/home-19", 2000, 0, 0.0, 68.47699999999995, 30, 1583, 43.0, 124.0, 174.84999999999945, 453.9200000000001, 3.339834878563604, 12.325378494615352, 1.6601327667860102], "isController": false}, {"data": ["https://stage.vow.life/vow/api/v1/order/viewbycustomer", 2000, 1972, 98.6, 91.16750000000003, 33, 1778, 48.0, 166.0, 178.0, 373.95000000000005, 3.360525586201682, 4.961499337871444, 2.3234883935847566], "isController": false}, {"data": ["https://stage.vow.life/user/category/home-20", 2000, 0, 0.0, 76.1345000000001, 33, 1238, 51.0, 119.0, 166.94999999999982, 500.98, 3.339784684081417, 113.01763857705969, 1.6666308335601603], "isController": false}, {"data": ["https://stage.vow.life/user/category/home-21", 2000, 1, 0.05, 180.26850000000005, 11, 1546, 147.0, 277.0, 353.9499999999998, 739.9000000000001, 3.3398293013244094, 1132.3470471682006, 1.6592999295087278], "isController": false}, {"data": ["https://stage.vow.life/vow/api/v1/customer/address/view", 2000, 1974, 98.7, 86.86449999999998, 32, 563, 47.0, 164.0, 172.0, 332.97, 3.335412407067072, 2.623384917744561, 2.2800670751435064], "isController": false}, {"data": ["https://stage.vow.life/user/category/home-22", 2000, 2, 0.1, 286.2120000000001, 0, 3640, 245.5, 390.8000000000002, 493.0, 1200.99, 3.3389985007896734, 5434.759857727883, 1.6482848712482179], "isController": false}, {"data": ["https://stage.vow.life/user/category/home-23", 2000, 1, 0.05, 973.7889999999994, 0, 8616, 940.0, 1386.6000000000004, 1647.7999999999993, 2305.99, 3.3340501541164684, 232.70732211331688, 1.6499201625224424], "isController": false}, {"data": ["https://stage.vow.life/user/category/home-24", 2000, 1, 0.05, 88.65800000000009, 3, 15318, 34.0, 84.0, 243.34999999999764, 1062.0, 3.340760958531134, 71.8429388084299, 1.7184577486653658], "isController": false}, {"data": ["https://stage.vow.life/vow/api/v1/customer/address/viewbycustomer", 2000, 1973, 98.65, 89.38650000000004, 32, 854, 47.0, 165.0, 173.0, 383.8100000000002, 3.3360689098394016, 2.6728167097019555, 2.3424155724360642], "isController": false}, {"data": ["https://stage.vow.life/vow/api/v1/order/precheck", 4000, 3969, 99.225, 87.67425000000001, 32, 1116, 47.0, 164.0, 173.0, 347.9899999999998, 6.658731678083617, 5.1862318497540425, 4.890006076092656], "isController": false}, {"data": ["https://stage.vow.life/vow/api/v2/order/create", 2000, 1988, 99.4, 88.87500000000003, 32, 1094, 48.0, 164.0, 174.0, 357.99, 3.329953430601273, 2.60963149746757, 4.351052431781741], "isController": false}, {"data": ["https://stage.vow.life/vow/api/v1/banner/viewAll", 2000, 1978, 98.9, 90.17499999999991, 32, 1050, 48.0, 165.0, 176.0, 361.0, 3.3623730283885154, 2.6323456949226487, 1.9537226092687174], "isController": false}, {"data": ["https://stage.vow.life/vow/api/v1/category/viewAll", 2000, 1976, 98.8, 86.60000000000005, 32, 580, 46.0, 163.0, 171.0, 349.98, 3.3348729330040703, 2.608310289708749, 1.9442569736361621], "isController": false}, {"data": ["https://stage.vow.life/vow/api/v1/subcategory/viewcan", 2000, 1977, 98.85, 88.38500000000012, 33, 831, 47.0, 164.0, 173.0, 355.0, 3.3342780454462098, 2.6100787150109195, 2.204400621842855], "isController": false}, {"data": ["https://stage.vow.life/user/category/home-9", 2000, 0, 0.0, 174.11399999999998, 32, 2184, 121.0, 221.9000000000001, 445.9499999999998, 1183.9, 3.3358185181293396, 12.533722388804659, 1.645105812163395], "isController": false}, {"data": ["https://stage.vow.life/vow/api/v1/customer/slot/viewall", 2000, 1977, 98.85, 89.79449999999996, 33, 735, 47.0, 165.0, 179.0, 375.9100000000001, 3.3616778806637972, 2.637989720304198, 1.976298910312115], "isController": false}, {"data": ["https://stage.vow.life/vow/api/v1/taxcharges/viewAll", 2000, 1975, 98.75, 90.66799999999992, 32, 1778, 47.0, 164.9000000000001, 174.94999999999982, 406.95000000000005, 3.3609830203137814, 2.6207199456697094, 1.9660437784843312], "isController": false}, {"data": ["https://stage.vow.life/user/category/home", 2000, 5, 0.25, 1683.1664999999975, 555, 16439, 1521.0, 2234.0, 2579.8499999999995, 3407.0, 3.322717251714107, 11000.590757386919, 45.239439483039185], "isController": false}, {"data": ["https://stage.vow.life/user/category/home-5", 2000, 0, 0.0, 139.09199999999984, 35, 3240, 82.0, 209.0, 342.9499999999998, 1209.99, 3.330574507449662, 225.38466216577686, 1.6522771970551062], "isController": false}, {"data": ["https://stage.vow.life/user/category/home-10", 2000, 0, 0.0, 174.34849999999997, 33, 2275, 123.0, 226.9000000000001, 458.0, 1208.99, 3.3360021350413662, 87.20033969884241, 1.6289072925006673], "isController": false}, {"data": ["https://stage.vow.life/user/category/home-6", 2000, 0, 0.0, 112.65950000000011, 30, 2180, 59.0, 160.0, 319.59999999999854, 1136.0, 3.330713172304454, 24.926294635199476, 1.6621039365698984], "isController": false}, {"data": ["https://stage.vow.life/user/category/home-11", 2000, 0, 0.0, 133.15699999999984, 30, 2180, 108.0, 170.0, 349.9499999999998, 1138.98, 3.3365419745321754, 8.1047227526513, 1.6356875695460469], "isController": false}, {"data": ["https://stage.vow.life/user/category/home-7", 2000, 0, 0.0, 247.1814999999999, 46, 2428, 165.0, 419.9000000000001, 1155.9499999999998, 1360.88, 3.331173622434788, 195.24889540364663, 1.6785992081800298], "isController": false}, {"data": ["https://stage.vow.life/user/category/home-12", 2000, 0, 0.0, 113.90499999999996, 31, 1482, 96.0, 162.9000000000001, 310.7499999999991, 1121.98, 3.3369260904240234, 30.463256129203273, 1.6423933101305739], "isController": false}, {"data": ["https://stage.vow.life/vow/api/v2/sub/products", 2000, 1978, 98.9, 88.10600000000008, 33, 1067, 47.0, 164.0, 174.0, 368.98, 3.333666700003334, 2.93694734056739, 2.3960729406273957], "isController": false}, {"data": ["https://stage.vow.life/user/category/home-8", 2000, 0, 0.0, 200.6785000000001, 34, 2295, 126.0, 353.8000000000002, 1089.0999999999822, 1219.0, 3.335840773648192, 55.206260703357856, 1.6483744447910014], "isController": false}, {"data": ["https://stage.vow.life/user/category/home-13", 2000, 0, 0.0, 278.0265000000002, 96, 5919, 217.0, 430.9000000000001, 569.8499999999995, 1304.8600000000001, 3.3361523820962047, 489.2233839938498, 3.860684153109377], "isController": false}, {"data": ["https://stage.vow.life/user/category/home-1", 4000, 0, 0.0, 143.2132500000001, 36, 5120, 102.0, 246.0, 347.9499999999998, 831.9199999999983, 6.6591418363915444, 621.6436039254809, 3.823804101365457], "isController": false}, {"data": ["https://stage.vow.life/user/category/home-2", 2000, 0, 0.0, 35.150499999999965, 7, 1117, 20.0, 63.90000000000009, 87.0, 277.8800000000001, 3.33086294331704, 521.3451065459784, 1.7239817968340145], "isController": false}, {"data": ["https://stage.vow.life/user/category/home-3", 2000, 0, 0.0, 51.6644999999999, 12, 1128, 38.0, 83.0, 121.0, 352.96000000000004, 3.330857396002305, 80.3374179360009, 1.7369900873683894], "isController": false}, {"data": ["https://stage.vow.life/user/category/home-4", 2000, 0, 0.0, 172.51399999999964, 36, 3759, 101.0, 275.0, 443.29999999999745, 1277.8400000000001, 3.330602239496946, 527.3164075119861, 1.6587960372494555], "isController": false}, {"data": ["https://stage.vow.life/vow/api/v1/customer/userexist", 2000, 1963, 98.15, 90.38100000000001, 32, 1671, 47.0, 165.0, 177.0, 387.9000000000001, 3.3282411244129815, 2.6302823086927, 1.5276106723379894], "isController": false}, {"data": ["https://stage.vow.life/user/category/home-0", 4000, 0, 0.0, 121.26325000000007, 34, 2376, 97.0, 197.0, 252.0, 551.9699999999993, 6.657822858636112, 525.4657173096737, 3.2573918478288006], "isController": false}, {"data": ["https://www.instamojo.com/webapi/checkout-assets/", 2000, 13, 0.65, 69.74000000000012, 23, 1440, 43.0, 109.90000000000009, 267.0, 506.97, 3.363232469991558, 3.0721995493058287, 1.129018090617254], "isController": false}, {"data": ["https://identitytoolkit.googleapis.com/v1/accounts:sendVerificationCode?key=AIzaSyB9WswhYhtowy2o2L6ROaIVmlFskOyg9n0", 2000, 1504, 75.2, 290.6044999999989, 215, 1126, 275.0, 321.0, 354.89999999999964, 565.8700000000001, 3.331711900208565, 2.2132002529602257, 3.774204886955015], "isController": false}, {"data": ["https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyB9WswhYhtowy2o2L6ROaIVmlFskOyg9n0", 2000, 0, 0.0, 305.75949999999966, 214, 2393, 287.5, 339.0, 363.0, 584.95, 3.335173237235875, 3.13323240612738, 4.7715124927251535], "isController": false}, {"data": ["https://stage.vow.life/vow/api/v1/product/view", 2000, 1981, 99.05, 87.51100000000002, 33, 971, 46.0, 164.0, 174.0, 354.0, 3.332689013457398, 2.629228010709596, 2.183822585966713], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 1506, 3.665839053600117, 1.3690909090909091], "isController": false}, {"data": ["Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 3, 0.007302468234263181, 0.0027272727272727275], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 14, 0.03407818509322818, 0.012727272727272728], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: code.jquery.com:443 failed to respond", 1, 0.002434156078087727, 9.090909090909091E-4], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, 0.004868312156175454, 0.0018181818181818182], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: cdn.jsdelivr.net:443 failed to respond", 1, 0.002434156078087727, 9.090909090909091E-4], "isController": false}, {"data": ["429/Too Many Requests", 39550, 96.2708728883696, 35.95454545454545], "isController": false}, {"data": ["Assertion failed", 5, 0.012170780390438635, 0.004545454545454545], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 110000, 41082, "429/Too Many Requests", 39550, "400/Bad Request", 1506, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 14, "Assertion failed", 5, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 3], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["https://stage.vow.life/vow/api/v1/cart/add", 2000, 1983, "429/Too Many Requests", 1983, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://stage.vow.life/user/category/home-25", 2000, 1, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://stage.vow.life/vow/api/v1/cart/viewbycustomerid", 6000, 5935, "429/Too Many Requests", 5935, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://stage.vow.life/vow/api/v1/order/view", 2000, 1972, "429/Too Many Requests", 1972, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://stage.vow.life/vow/api/v1/order/lastorder", 2000, 1981, "429/Too Many Requests", 1981, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://stage.vow.life/user/category/home-15", 2000, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://stage.vow.life/user/category/home-17", 2000, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: code.jquery.com:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://stage.vow.life/vow/api/v1/order/viewbycustomer", 2000, 1972, "429/Too Many Requests", 1972, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://stage.vow.life/user/category/home-21", 2000, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://stage.vow.life/vow/api/v1/customer/address/view", 2000, 1974, "429/Too Many Requests", 1974, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://stage.vow.life/user/category/home-22", 2000, 2, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["https://stage.vow.life/user/category/home-23", 2000, 1, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://stage.vow.life/user/category/home-24", 2000, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: cdn.jsdelivr.net:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://stage.vow.life/vow/api/v1/customer/address/viewbycustomer", 2000, 1973, "429/Too Many Requests", 1973, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://stage.vow.life/vow/api/v1/order/precheck", 4000, 3969, "429/Too Many Requests", 3969, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://stage.vow.life/vow/api/v2/order/create", 2000, 1988, "429/Too Many Requests", 1986, "400/Bad Request", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["https://stage.vow.life/vow/api/v1/banner/viewAll", 2000, 1978, "429/Too Many Requests", 1978, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://stage.vow.life/vow/api/v1/category/viewAll", 2000, 1976, "429/Too Many Requests", 1976, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://stage.vow.life/vow/api/v1/subcategory/viewcan", 2000, 1977, "429/Too Many Requests", 1977, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://stage.vow.life/vow/api/v1/customer/slot/viewall", 2000, 1977, "429/Too Many Requests", 1977, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://stage.vow.life/vow/api/v1/taxcharges/viewAll", 2000, 1975, "429/Too Many Requests", 1975, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://stage.vow.life/user/category/home", 2000, 5, "Assertion failed", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://stage.vow.life/vow/api/v2/sub/products", 2000, 1978, "429/Too Many Requests", 1978, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://stage.vow.life/vow/api/v1/customer/userexist", 2000, 1963, "429/Too Many Requests", 1963, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.instamojo.com/webapi/checkout-assets/", 2000, 13, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://identitytoolkit.googleapis.com/v1/accounts:sendVerificationCode?key=AIzaSyB9WswhYhtowy2o2L6ROaIVmlFskOyg9n0", 2000, 1504, "400/Bad Request", 1504, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://stage.vow.life/vow/api/v1/product/view", 2000, 1981, "429/Too Many Requests", 1981, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
