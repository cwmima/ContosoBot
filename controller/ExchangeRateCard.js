var rest = require('../API/RestClient');
var builder = require('botbuilder');

exports.displayExchangeRateCard = function (session, amount, fromCurrency, toCurrency){
    var url = "https://api.fixer.io/latest?base=" + fromCurrency;

    rest.getExchangeRate(url, session, amount, fromCurrency, toCurrency, displayExchangeRateCard);
}

function displayExchangeRateCard(message, session, amount, fromCurrency, toCurrency){

    var exchangeRateList = JSON.parse(message).rates;    
    var exchangeRate = exchangeRateList[toCurrency];
    var result = Math.round(exchangeRate * amount * 100) / 100;
        
    session.send(new builder.Message(session).addAttachment({
        contentType: "application/vnd.microsoft.card.adaptive",
        content: {
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "type": "AdaptiveCard",
            "version": "1.0",
            "body": [
                {
                    "type": "Container",
                    "items": [
                        {
                            "type": "TextBlock",
                            "text": amount + " " + fromCurrency + " = ",
                        },
                        {
                            "type": "TextBlock",
                            "text": "**" + result + "** "+ toCurrency,
                            "size": "large"
                        }
                    ]
                }
            ]
        }
    }));
}