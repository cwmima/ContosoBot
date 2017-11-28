var request = require('request');

exports.postQnAResults = function getData(url, session, question, callback){
    var options = {
        url: url,
        method: 'POST',
        headers: {
            'Ocp-Apim-Subscription-Key': 'c86583e976244b60a061c3bf3fcf6058',
            'Content-Type':'application/json'
        },
        json: {
            "question" : question
        }
    };
    request(options, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            callback(body, session, question);
        }
        else{
            console.log(error);
            console.log(question);
            console.log(response.statusCode);
        }
    });
};

exports.getExchangeRate = function getData(url, session, amount, fromCurrency, toCurrency, date, callback){
    // GET method
    request.get(url, function(err, res, body){
        if(err){
            console.log(err);
        }else {
            callback(body, session, amount, fromCurrency, toCurrency, date);
        }
    });
};

exports.postHistory = function sendData(url, username, amount, fromCurrency, result, toCurrency, date){
    var options = {
        url: url,
        method: 'POST',
        headers: {
            'ZUMO-API-VERSION': '2.0.0',
            'Content-Type':'application/json'
        },
        json: {
            "username" : username,
            "amount" : amount,
            "fromCurrency" : fromCurrency,
            "result" : result,
            "toCurrency" : toCurrency,
            "date": date
        }
    };

    request(options, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log(body);
        }
        else{
            console.log(error);
        }
    });
};

exports.getHistory = function getData(url, session, username, callback){
    request.get(url, {'headers' : {'ZUMO-API-VERSION': '2.0.0'}}, 
        function(err, res, body){
            if(err){
                console.log(err);
            }else {
                callback(body, session, username);
            }
        }
    );
};

exports.clearHistory = function deleteData(url, session, username, id, callback){
    var options = {
        url: url + "\\" + id,
        method: 'DELETE',
        headers: {
            'ZUMO-API-VERSION': '2.0.0',
            'Content-Type':'application/json'
        }
    };
    request(options, function (err, res, body){
        if(!err && res.statusCode === 200){
            console.log(body);
            // callback(session, username);
        }else {
            console.log(err);
            console.log(res);
        }
    })
};
