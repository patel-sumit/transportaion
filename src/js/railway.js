/// <reference path="idbp.js" />
//var apikey='fvtvd6561';
//var apikey = 'zedeb3529';


var railwayMaster = function () {


}
//station list
railwayMaster.prototype.bindSource = function () {
    $("#txtSource").autocomplete({
        source: function (request, response) {
            fetch("http://api.railwayapi.com/suggest_station/name/" + $("#txtSource").val().trim() + "/apikey/" + apikey + "/").then(function (_response) {
                if (_response.status != 200) return;

                _response.json().then(function (data) {
                    var stationArr = [];
                    var stations = data.station;
                    for (var i = 0; i < stations.length; i++) {
                        stationArr.push({
                            label: stations[i].fullname,
                            value: stations[i].fullname,
                            code: stations[i].code
                        });
                    }

                    response(stationArr);
                });
            }).catch(function (error) {
                return;
            });
        },
        select: function (event, ui) {
            $("#txtSource").attr("data-stnCode", $(ui)[0].item.code);
        },
        minLength: 3
    });
}

railwayMaster.prototype.bindDest = function () {
    $("#txtDest").autocomplete({
        source: function (request, response) {
            fetch("http://api.railwayapi.com/suggest_station/name/" + $("#txtDest").val().trim() + "/apikey/" + apikey + "/").then(function (_response) {
                if (_response.status != 200) return;

                _response.json().then(function (data) {
                    var stationArr = [];
                    var stations = data.station;
                    for (var i = 0; i < stations.length; i++) {
                        stationArr.push({
                            label: stations[i].fullname,
                            value: stations[i].fullname,
                            code: stations[i].code
                        });
                    }

                    response(stationArr);
                });
            }).catch(function (error) {
                return;
            });
        },
        select: function (event, ui) {
            $("#txtDest").attr("data-stnCode", $(ui)[0].item.code);
        },
        minLength: 3
    });
}

railwayMaster.prototype.searchButtonClick = function () {

    $("#btnSearch").click(function () {
        $("#loader")[0].style.display = "";
        if ($("#txtDest").val() != "" && $("#txtSource").val() != "") {
            var d = new Date();
            var resDate = d.getDate() + "-" + (d.getMonth() + 1);

            var dbPromise = idb.open('TrainBetwStation', 1, function (upgradeDb) {
                var trainStore = upgradeDb.createObjectStore('trainBetwStation', {keyPath: 'id'});
                trainStore.createIndex('sourceDestIndex', ['source', 'dest'], {unique: true});
            });

            var arr=[{name:'SURAT',code:'ST'},{name:'NAVSARI',code:'NVS'},{name:'VALSAD',code:'BL'},{name:'VAPI',code:'VAPI'},{name:'DADAR',code:'DR'},{name:'MUMBAI CST',code:'CSTM'}]
            var objfrom = arr.filter(function ( obj ) {
                return obj.name === $("#txtSource").val();
            })[0];

            var objTo = arr.filter(function ( obj ) {
                return obj.name === $("#txtDest").val();
            })[0];

            fetch("http://api.railwayapi.com/between/source/" + (objfrom!=undefined?objfrom.code:$("#txtSource").attr("data-stnCode")) + "/dest/" + (objTo!=undefined?objTo.code:$("#txtDest").attr("data-stnCode"))  + "/date/" + resDate + "/apikey/" + apikey + "/").then(function (_response) {

                if (_response.status != 200) {
                    return dbPromise.then(function (db) {
                        var tx = db.transaction('trainBetwStation', 'readwrite');
                        var trainStore = tx.objectStore('trainBetwStation');
                        var index = trainStore.index('sourceDestIndex');
                        var resp = index.get(IDBKeyRange.only([$("#txtSource").val(), $("#txtDest").val()]));
                        resp.then(function (data) {
                            if (!data) return;
                            var htmlResp = objRailway.getHtmString(data.json);
                            $('#listTrain').html(htmlResp);
                        });

                    }).then(function () {
                        console.log('Added');
                    });
                }

                _response.json().then(function (data) {
                    dbPromise.then(function (db) {
                        var tx = db.transaction('trainBetwStation', 'readwrite');
                        var trainStore = tx.objectStore('trainBetwStation');
                        var index = trainStore.index('sourceDestIndex');
                        var id = $("#txtSource").val() + "-" + $("#txtDest").val();
                        trainStore.put({
                            source: $("#txtSource").val(),
                            dest: $("#txtDest").val(),
                            sourceCode: $("#txtSource").attr("data-stnCode"),
                            DestCode: $("#txtDest").attr("data-stnCode"),
                            json: data,
                            /* id: Math.random().toString(36).slice(2)*/
                            id: id
                        });
                        return tx.complete;
                    }).then(function () {
                        console.log('Added');
                    }).catch(function (err) {
                        /* console.log(err);*/
                    });

                    var htmlResp = objRailway.getHtmString(data);
                    $('#listTrain').html(htmlResp);
                    $("#loader")[0].style.display = "none";
                });
            }).catch(function (error) {
                dbPromise.then(function (db) {
                    var tx = db.transaction('trainBetwStation', 'readwrite');
                    var trainStore = tx.objectStore('trainBetwStation');
                    var index = trainStore.index('sourceDestIndex');
                    var resp = index.get(IDBKeyRange.only([$("#txtSource").val(), $("#txtDest").val()]));
                    resp.then(function (data) {
                        if (!data) return;
                        var htmlResp = objRailway.getHtmString(data.json);
                        $('#listTrain').html(htmlResp);
                        $("#loader")[0].style.display = "none";
                    });
                }).then(function () {
                    console.log('Added');
                });
                $("#loader")[0].style.display = "none";
                return;
            });
        }

    });
}

railwayMaster.prototype.getHtmString = function (data) {
    var stationArr = [];
    var trains = data.train;
    var htmlResp = "";
    for (var i = 0; i < trains.length; i++) {
        if (i == 0) {
            htmlResp = '<table class="table table-striped table-bordered"><thead>' +
                '<tr>' +
                '<th>Train Number</th>' +
                '<th>Train Name</th>' +
                '<th>Source</th>' +
                '<th>Depature</th>' +
                '<th>Destination</th>' +
                '<th>Arrival</th>' +
                '<th>' +
                '<table class="table table-bordered">' +
                '<thead>' +
                '<tr>' +
                '<th colspan="7">Day Run</th>' +

                '</tr>' +
                '</thead>' +
                '<tbody>' +
                '<tr>' +
                '<td>M</td>' +
                '<td>T</td>' +
                '<td>W</td>' +
                '<td>T</td>' +
                '<td>F</td>' +
                '<td>S</td>' +
                '<td>S</td>' +
                '</tr>' +

                '</tbody>' +
                '</table>' +
                '</th>' +
                '<th>' +
                '<table class="table table-bordered">' +
                '<thead>' +
                '<tr>' +
                '<th colspan="7">Classes' +
                '</th>' +

                '</tr>' +
                '</thead>' +
                '<tbody>' +
                '<tr>' +
                '<td>1A</td>' +
                '<td>2A</td>' +
                '<td>3A</td>' +
                '<td>CC</td>' +
                '<td>SS</td>' +
                '<td>2S</td>' +
                '<td>3E</td>' +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '</th>' +
                '</tr>' +
                '</thead><tbody>';
        }
        htmlResp += '<tr>' +
            '<td>' + data.train[i].number + '</td>' +
            '<td>' + data.train[i].name + '</td>' +
            '<td>' + data.train[i].from.name + '</td>' +
            '<td>' + data.train[i].src_departure_time + '</td>' +
            '<td>' + data.train[i].to.name + '</td>' +
            '<td>' + data.train[i].dest_arrival_time + '</td>' +
            '<td>' +
            '<table class="table table-bordered">' +

            '<tbody>' +
            '<tr>' +
            '<td>' + data.train[i].days[0].runs + '</td>' +
            '<td>' + data.train[i].days[1].runs + '</td>' +
            '<td>' + data.train[i].days[2].runs + '</td>' +
            '<td>' + data.train[i].days[3].runs + '</td>' +
            '<td>' + data.train[i].days[4].runs + '</td>' +
            '<td>' + data.train[i].days[5].runs + '</td>' +
            '<td>' + data.train[i].days[6].runs + '</td>' +
            '</tr>' +

            '</tbody>' +
            '</table>' +
            ' </td>' +
            '<td>' +
            '<table class="table table-bordered">' +

            '<tbody>' +
            '<tr>' +
            '<td>' + data.train[i].classes[1].available + '</td>' +
            '<td>' + data.train[i].classes[7].available + '</td>' +
            '<td>' + data.train[i].classes[6].available + '</td>' +
            '<td>' + data.train[i].classes[0].available + '</td>' +
            '<td>' + data.train[i].classes[3].available + '</td>' +
            '<td>' + data.train[i].classes[4].available + '</td>' +
            '<td>' + data.train[i].classes[5].available + '</td>' +
            '</tr>' +

            '</tbody>' +
            '</table>' +
            '</td>' +
            '</tr>'

        if (i == (trains.length - 1)) {
            htmlResp += '</tbody></table>';
        }

    }
    if (htmlResp == "") {
        htmlResp = "<div class='panel-heading'>Records not found</div>";
    }
    return htmlResp;
}

railwayMaster.prototype.displayDefaultTrainList = function () {
    $("#txtSource").val('SURAT');
    $("#txtDest").val('NAVSARI ');
    $("#txtSource").attr("data-stnCode", 'ST');
    $("#txtDest").attr("data-stnCode", 'NVS');

    var dbPromise = idb.open('TrainBetwStation', 1, function (upgradeDb) {
        var trainStore = upgradeDb.createObjectStore('trainBetwStation', {keyPath: 'id'});
        trainStore.createIndex('sourceDestIndex', ['source', 'dest'], {unique: true});

    });
    dbPromise.then(function (db) {
        var tx = db.transaction('trainBetwStation', 'readwrite');
        var trainStore = tx.objectStore('trainBetwStation');
        var index = trainStore.index('sourceDestIndex');
        var id = $("#txtSource").val() + "-" + $("#txtDest").val()
        trainStore.put({
            source: $("#txtSource").val(),
            dest: $("#txtDest").val(),
            sourceCode: $("#txtSource").attr("data-stnCode"),
            DestCode: $("#txtDest").attr("data-stnCode"),
            json: defaultTrainData,
            id: id
        });
        return tx.complete;
    }).then(function () {
        console.log('Added');
    }).catch(function (err) {
        /*console.log(err);*/
    });

    var htmlResp = this.getHtmString(defaultTrainData);
    $('#listTrain').html(htmlResp);

}