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

  exports.getExchangeRate = function getData(url, session, amount, fromCurrency, toCurrency, callback){
        // GET method
        request.get(url, function(err, res, body){
            if(err){
                console.log(err);
            }else {
                callback(body, session, amount, fromCurrency, toCurrency);
            }
        });
    };
  