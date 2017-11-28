var rest = require('../API/RestClient');
var builder = require('botbuilder');
var databaseUrl = "http://contosobotgavin.azurewebsites.net/tables/ContosoBot";

exports.displayExchangeRateCard = function (session, amount, fromCurrency, toCurrency, date){
    var url = "https://api.fixer.io/latest?base=" + fromCurrency;

    rest.getExchangeRate(url, session, amount, fromCurrency, toCurrency, date, displayExchangeRateCard);
}

function displayExchangeRateCard(message, session, amount, fromCurrency, toCurrency, date){

    var exchangeRateList = JSON.parse(message).rates;    

    if (toCurrency){
        var exchangeRate = exchangeRateList[toCurrency];
        var result = Math.round(exchangeRate * amount * 100) / 100;

        // check if history recording is turned on
        if (session.conversationData["isTurnedOn"]){
            rest.postHistory(databaseUrl, session.conversationData["username"], amount, fromCurrency, result, toCurrency, date);
        }
        
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
                                "text": amount + " " + fromCurrency + " = "
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
    } else {  // if no toCurrency specified

        // check if history recording is turned on
        if (session.conversationData["isTurnedOn"]){
            rest.postHistory(databaseUrl, session.conversationData["username"], amount, fromCurrency, null, null, date);
        }

        var currencies = [];
        for (var key in exchangeRateList){
            var currencyItem = {};
            currencyItem.title = key;
            currencyItem.value = "" + exchangeRateList[key];
            // console.log(currencyItem.title);
            // console.log(currencyItem.value);
            currencies.push(currencyItem);
        }
        console.log(currencies);
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
                                "size": "large"
                            }
                        ]
                    },
                    {
                        "type": "Container",
                        "spacing": "none",
                        "items": [
                            {
                                "type": "ColumnSet",
                                "columns": [
                                    {
                                        "type": "Column",
                                        "width": "auto",
                                        "items": [
                                            {
                                                "type": "FactSet",
                                                "facts": currencies,
                                                "separator": true,
                                                "spacing": "medium"
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        }));
    }
    
}