var express = require('express');
var app = express();
var request = require('request');
var events = require('events');
var sequence = require('sequence').Sequence.create(),err

var validairports = ["ABR","ABI","CAK","ALS","ABY","ALB","ABQ","AEX","ABE", "AIA",
"APN","AOO","AMA","ANC","ATW","AVL","ASE","AHN", "ATL","ACY","AGS","AUG","AUS","BFL","BWI",
"BGR","BHB", "BRW","BTR","BPT","BKW","BED","BLI","BJI","BET","BTT", "BIL","BGM","BHM","BIS",
"BMI","BMG","BLF","BOI","BOS", "BZN","BKX","BRO","BQK","BUF","BUR","BRL","BBF","BTV", "BTM",
"CGI","CLD","CNM","CPR","CID","CMI","CHS","CRW", "CLT","CHO","CHA","CYS","CHI","MDW","CHI",
"ORD","CIC", "CVG","CKB","CLE","CVN","COD","CLL","COS","COU","CAE", "CSG","CLU","GTR","OLU",
"CMH","CDV","CRP","DAL","DFW", "DAY","DAB","DEC","DEN","DSM","DTW","DTT","DVL","DIK", "DLG",
"DDC","DHN","DUJ","DBQ","DLH","DRO","DUT","EAU", "EEK","IPL","ELD","ELP","EKO","ELM","WDG",
"ERI","ESC", "EUG","ACV","EVV","FAI","FAR","FMN","XNA","FAY","FLG", "FNT","FLO","FOD","FLL",
"TBN","RSW","FSM","VPS","FWA", "FYU","FAT","GNV","GCK","GCC","GDV","GFK","GRI","GJT", "GRR",
"GBD","GTF","GRB","LWB","GSO","GLH","PGV","GSP", "GPT","GUC","HGR","HNM","CMX","HRL","MDT",
"HRO","BDL", "HVR","HYS","HLN","HIB","Big","HHH","HOB","HOM","HNL", "MKK","EFD","HOU","IAH",
"EFD","HTS","HSV","HON","HYA", "IDA","IND","INL","IYK","IMT","IWD","ISP","ITH","JAC", "JAN",
"MKL","JAX","OAJ","JMS","JHW","JST","JPR","JLN", "JNU","OGG","AZO","LUP","FCA","MCI","JHM",
"EAR","ENA", "KTM","EYW","GRK","AKN","IGM","IRK","LMT","TYS","ADQ", "LSE","LFT","LCH","Hll",
"LNY","LNS","LAN","LAR","LRD", "LRU","LAS","LBE","PIB","LAW","LAB","LWS","LEW","LWT", "LEX",
"LBL","LIH","LNK","LIT","LGB","GGG","QLA","SDF", "LBB","LYH","MCN","MSN","MHT","MHK","MBL",
"MWA","MQT", "MVY","MCW","MSS","MFE","MCK","MFR","MLB","MEM","MEI", "MIA","MAF","MLS","MKE",
"MSP","MOT","MSO","MOB","MOD", "MLI","MLU","MRY","MGM","MTJ","MGW","MWH","MSL","MKG", "MRY",
"ACK","ABF","BNA","EWN","HVN","MSY","LGA","JFK", "NYC","EWR","SWF","PHF","OME","ORF","OTH",
"LBF","OAK", "OGS","OKC","OMA","ONT","SNA","MCO","OSH","OWB","OXR", "PAH","PGA","PSP","PFN",
"PKB","PSC","PLN","PDT","PNS", "PIA","PHL","PHX","PIR","SOP","PIT","PIH","PNC","PWM", "PDX",
"PSM","PRC","PQI","PVD","PVC","PUB","PUW","UIN", "RDU","RAP","RDD","RDM","RNO","RHI","RIC",
"RIW","ROA", "RST","ROC","RKS","RFD","RKD","ROW","RUT","SMF","MBS", "SLN","SPY","SLC","SJT",
"SAT","SAN","QSF","SFO","SJC", "SBP","SDP","SBA","SAF","SMX","STS","SLK","SRQ","CIU", "SAV",
"BFF","SEA","SHD","SHR","SHV","SDY","SVC","SUX", "FSD","SIT","SGY","SBN","GEG","SPI","CEF",
"SGF","VSF", "STC","SGU","STL","PIE","SCE","SBS","SUN","SRY","TLH", "TPA","TAX","TXK","TVF",
"OOK","TOL","TOP","TVC","TTN", "TUS","TUL","TUP","TWF","TYR","UNK","EGE","VDZ","VLD", "VCT",
"VIS","ACT","ALW","DCA","WAS","IAD","ALO","ART", "ATY","CWA","EAT","PBI","WYS","HPN","SPS",
"ICT","AVP", "IPT","ISN","ILG","ILM","OLF","WRL","WRG","YKM","YAK", "YUM","YXX","YAA","YEK",
"YBG","YYC","YBL","YGR","YCG", "YYG","YMT","YYQ","YXC","YDF","YHD","YEG","YEO","YMM", "YYE",
"YXJ","YSM","YFC","YQX","YGP","YQU","YHZ","YHM", "YFB","YKA","YLW","YQK","YGK","YQL","YXU",
"YXH","YQM", "YYY","YMQ","YUL","YCD","YYB","YOW","YYF","YZT","YPW", "YPR","YQB","YQZ","YRT",
"YRL","YQR","YRJ","YUY","YSJ", "YZP","YZR","YXE","YAM","YZV","YXL","YYD","YYT","YSB", "YQY",
"YXT","YTH","YQT","YTS","YYZ","YTO","YTZ","YVO", "YVR","YYJ","YWK","YXY","YWL","YQG","YWG","YZF","LAX"];

app.use(express.static('public'));

app.get('/hello', function (req, res) {
    res.send('Hello World!');
});

app.get('/flightsearch', function (req, mainresponse) {
    var hold = true;
    var origin = req.query.origin
    var destination = req.query.destination
    var departdate = req.query.departdate
//    var destination = req.query.destination
    var originLatLong = req.query.olatlong.split(",")
    var destinationLatLong = req.query.dlatlong.split(",")

    var originLat = originLatLong[0];
    var originLong = originLatLong[1];

    var destinationLat = destinationLatLong[0];
    var destinationLong = destinationLatLong[1];

    var resbody = []

//    var originairportcodes = airportRadiusSearch(originLat, originLong)
//    var destinationairportcodes = airportRadiusSearch(destinationLat, destinationLong)

//    console.log(originairportcodes)
//    console.log(destinationairportcodes)

    var origairportCodes = []
    var destairportCodes = []
    var origintraveltimes = {};
    var destinationtraveltimes = {};

    var originCall = function (next) {
       airportRadiusSearch(next, originLat, originLong, origairportCodes)
    }

    var destinationCall = function (next) {
        airportRadiusSearch(next, destinationLat, destinationLong, destairportCodes)
    }

    var stripBadAirportsOriginCall = function (next) {
      console.log("before")
      console.log(origairportCodes);
      console.log(destairportCodes);
      origairportCodes = stripBadAirports(origairportCodes)
      next()
    }

    var stripBadAirportsDestinationCall = function (next) {
      destairportCodes = stripBadAirports(destairportCodes)
      next()
    }
    var origintraveltimecall = function(next) {
      console.log("after")
      console.log(origairportCodes);
      console.log(destairportCodes);
      var ctr=0;
      for (i=0; i<origairportCodes.length; i++) {
          traveltimegen(origin, origairportCodes[i], function(duration, destination) {
            ctr++;
            origintraveltimes[destination] = duration;
            if(ctr==origairportCodes.length) {
              next()
            }
          },'origin');
      }
    }

    var destinationtraveltimecall = function(next) {
      console.log("after")
      console.log(origairportCodes);
      console.log(destairportCodes);
      var ctr=0;
      for (i=0; i<destairportCodes.length; i++) {
          traveltimegen(destairportCodes[i], destination, function(duration, internaldestination) {
            ctr++;
            destinationtraveltimes[internaldestination] = duration;
            if(ctr==destairportCodes.length) {
              next()
            }
          },'destination');
      }
    }

    var flightsearchcall = function(next) {
      var ctr=0;
      for (i=0; i<origairportCodes.length; i++) {
        for (j = 0 ; j<destairportCodes.length; j++) {
          flightsearch(next, origairportCodes[i], destairportCodes[j], departdate, function(minlegairline, minlegprice, traveltime, originiata, destiata) {
            ctr ++;
            //console.log(ctr);
            var obj = {}
            obj['price'] = minlegprice;
            obj['flighttime'] = Math.round( (traveltime/3600) * 10 ) / 10 + 'hrs'
            var tt = (traveltime/60) + parseInt(origintraveltimes[originiata]) + parseInt(destinationtraveltimes[destiata])
            obj['traveltime'] = Math.round((tt/60) * 10) / 10 + 'hrs'
            obj['originiata'] = originiata
            obj['destiata'] = destiata
            obj['origtt'] = origintraveltimes[originiata]
            obj['desttt'] = destinationtraveltimes[destiata]
            obj['airline'] = minlegairline

            resbody.push(obj)
            if(ctr == origairportCodes.length*destairportCodes.length) {
              next()
            }
          })
        }
      }
    }

    sequence
        .then(originCall)
        .then(destinationCall)
        .then(stripBadAirportsOriginCall)
        .then(stripBadAirportsDestinationCall)
        .then(origintraveltimecall)
        .then(destinationtraveltimecall)
        .then(flightsearchcall)
        .then(function (next) {
            setTimeout(function () {
                console.log(origintraveltimes);
                console.log(destinationtraveltimes);
                resbody.sort(compare);
                mainresponse.send(resbody);
                next();
            }, 50);
        });

    // origairportCodes = stripBadAirports(origairportCodes)
    // destairportCodes = stripBadAirports(destairportCodes)
    //

    // var origintraveltimearr = [];
    // for(i=0;i<origairportCodes.length;i++) {
    //   traveltimegen(origin, origairportCodes[i],origintraveltimearr);
    // }
//    res.send(origintraveltimearr);



});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});


function traveltimegen(origin, destination, callback, type) {
  var requrl = 'https://maps.googleapis.com/maps/api/directions/json?'+'key=AIzaSyCCvw_1ASiIIZ0jZDjvG9rnh1FecDojlwI'+
      '&origin=\"' + origin+ '\"'+
      '&destination=\"' + destination + ' ' + 'airport' + '\"' +
      '&mode=driving';
      if(type=='destination') {
        requrl = 'https://maps.googleapis.com/maps/api/directions/json?'+'key=AIzaSyCCvw_1ASiIIZ0jZDjvG9rnh1FecDojlwI'+
            '&origin=\"' + origin+ ' ' + 'airport' + '\"'+
            '&destination=\"' + destination + '\"' +
            '&mode=driving';
      }
  request({
      url: requrl,
      method: 'GET'


  },function(error, response, body){

      if(error) {
          res.send({price: 150})
      } else {
          try {
              var directions = JSON.parse(body)
              var distance = directions.routes[0].legs[0].distance.text
              var duration = directions.routes[0].legs[0].duration.text

              console.log(duration)
              console.log(distance)
              if(type=='destination') {
                callback(duration,origin);
              } else {
                callback(duration,destination)
              }

              //res.send(body.aggregations['top-origin']['buckets'][0]['min_price_hits']['hits']['hits'][0]['_source'])
          }
          catch(err) {
              console.log(err)
          }
      }

  });
}

function airportRadiusSearch(next, latitude, longitude, airportCodes) {
//    var airportCodes = []
    console.log('http://terminal2.expedia.com/x/geo/features?tag.ns=iata&tag.name=airportCode&tag.op=defined&type=airport&within=50km&lng='+ longitude+'&lat='+ latitude + '&apikey=egVouBielIiUN7qQlgAxaZDEuYGfOrZ9')
    request({
        url: 'http://terminal2.expedia.com/x/geo/features?tag.ns=iata&tag.name=airportCode&tag.op=defined&type=airport&within=50km&lng='+ longitude+'&lat='+ latitude + '&apikey=egVouBielIiUN7qQlgAxaZDEuYGfOrZ9',

        method: 'GET'


    },function(error, response, body){
        if(error) {
            res.send(error)
        } else {
            try {
                var airports = JSON.parse(body)
                for (var j = 0; j < airports.length; j++) {
                    var airport= airports[j];

                    var airportCode = airport.name.split("(")[1].split("-")[0].split(")")[0]
              //      console.log(airportCode);
                    airportCodes.push(airportCode);

                }
            }
            catch(err) {
                console.log(err)
            }
        }
        console.log('return')
        next()

    });

}

function flightsearch(next, originiata, destiata, departdate, callback) {
  console.log(originiata + ' ' + destiata);
  console.log('http://terminal2.expedia.com/x/mflights/search?maxOfferCount=20'+
  '&departureAirport='+originiata+'&arrivalAirport='+destiata+'&departureDate='+departdate+'&apikey=egVouBielIiUN7qQlgAxaZDEuYGfOrZ9');
  request({
      url: 'http://terminal2.expedia.com/x/mflights/search?maxOfferCount=20'+
      '&departureAirport='+originiata+'&arrivalAirport='+destiata+'&departureDate='+departdate+'&apikey=egVouBielIiUN7qQlgAxaZDEuYGfOrZ9',

      method: 'GET'
  },function(error, response, body){
      if(error) {
          res.send({price: 150})
      } else {
          try {
              var resp = JSON.parse(body)
              var legs = resp.legs
              var minlegindex = 0;
              var minlegairline = legs[0]['segments'][0]['airlineName']
              segsize = legs[0]['segments'].length;
              var min =  (legs[0]['segments'][segsize-1]['arrivalTimeEpochSeconds'] + legs[0]['segments'][segsize-1]['arrivalTimeZoneOffsetSeconds'])
                          - (legs[0]['segments'][0]['departureTimeEpochSeconds'] +legs[0]['segments'][0]['departureTimeZoneOffsetSeconds']);

              var traveltime = null;
              for (var j = 0; j < legs.length; j++) {
                segsize = legs[j]['segments'].length;
                traveltime = (legs[j]['segments'][segsize-1]['arrivalTimeEpochSeconds'] + legs[j]['segments'][segsize-1]['arrivalTimeZoneOffsetSeconds'])
                            - (legs[j]['segments'][0]['departureTimeEpochSeconds'] +legs[j]['segments'][0]['departureTimeZoneOffsetSeconds']);
                if(traveltime< min){
                  console.log("traveltimemin = " +  traveltime/3600);
                  minlegindex = j;
                  minlegairline = legs[j]['segments'][0]['airlineName']
                }
              }
              minlegprice = resp.offers[minlegindex]['totalFare']
              callback(minlegairline, minlegprice, traveltime, originiata, destiata);
          }
          catch(err) {
              console.log(err)
          }
      }
      console.log('return')

  });
}

function compare(a,b) {
  x = parseFloat(a.traveltime);
  y = parseFloat(b.traveltime);
  if (x < y)
    return -1;
  if (x > y)
    return 1;
  return 0;
}

function stripBadAirports(airportCodes) {
    var validatedairports = []
    for (var k=0; k< airportCodes.length; k++) {
        var airportCode = airportCodes[k];
        if (validairports.indexOf(airportCode) > -1) {
            validatedairports.push(airportCode)
        }
    }
    return validatedairports

}
