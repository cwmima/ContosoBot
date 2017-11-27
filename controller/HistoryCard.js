var rest = require('../API/RestClient');
var builder = require('botbuilder');
var databaseUrl = "http://contosobotgavin.azurewebsites.net/tables/ContosoBot";

exports.showHistory = function(session, username){
    rest.getHistory(databaseUrl, session, username, handleHistoryResponse);
};

function handleHistoryResponse(message, session, username){
    var historyResponse = JSON.parse(message);

    var amountColumn = [];
    var fromCurrencyColumn = [];
    var resultColumn = [];
    var toCurrencyColumn = [];

    for (var i in historyResponse) {
        var usernameReceived = historyResponse[i].username;

        if (username.toLowerCase() === usernameReceived.toLowerCase()) {
            
            var amount = historyResponse[i].amount;
            var fromCurrency = historyResponse[i].fromCurrency;
            var result = historyResponse[i].result;
            var toCurrency = historyResponse[i].toCurrency;

            var amountItem = {};
            amountItem.type = "TextBlock";
            amountItem.text = "" + amount;
            amountColumn.push(amountItem);
    
            var fromCurrencyItem = {};
            fromCurrencyItem.type = "TextBlock";
            fromCurrencyItem.text = fromCurrency;
            fromCurrencyItem.weight = "bolder";
            fromCurrencyColumn.push(fromCurrencyItem);

            var resultItem = {};
            resultItem.type = "TextBlock";
            resultItem.text = "" + (result || "-");
            resultColumn.push(resultItem);

            var toCurrencyItem = {};
            toCurrencyItem.type = "TextBlock";
            toCurrencyItem.text = toCurrency || "-";
            toCurrencyItem.weight = "bolder";
            toCurrencyColumn.push(toCurrencyItem);
        }
    }

    session.send(new builder.Message(session).addAttachment({
        contentType: "application/vnd.microsoft.card.adaptive",
        content: {
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "type": "AdaptiveCard",
            "version": "1.0",
            "body": [
                {
                    "type": "TextBlock",
                    "text": username + ", your history records are: ",
                    "wrap": true,
                    "weight": "bolder",
                    "size": "large"
                },
                {
                    "type": "ColumnSet",
                    "columns": [
                        {
                            "type": "Column",
                            "width": "auto",
                            "items": amountColumn
                        },
                        {
                            "type": "Column",
                            "width": "auto",
                            "items": fromCurrencyColumn
                        },
                        {
                            "type": "Column",
                            "width": "auto",
                            "items": resultColumn
                        },
                        {
                            "type": "Column",
                            "width": "auto",
                            "items": toCurrencyColumn
                        },
                    ]
                }
            ]      
    }}));
}

exports.clearHistory = function (session, username){

    rest.getHistory(databaseUrl, session, username, function (message, session, username){
        // read the whole easy table
        var historyResponse = JSON.parse(message);

        for(var i in historyResponse) {
            var usernameReceived = historyResponse[i].username;
            var id = historyResponse[i].id;

            if (usernameReceived === username) {
                rest.clearHistory(databaseUrl, session, username, id);
            }
        }
    });

};
