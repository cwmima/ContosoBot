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

    for (var index in historyResponse) {
        var usernameReceived = historyResponse[index].username;

        if (username.toLowerCase() === usernameReceived.toLowerCase()) {
            
            var amount = historyResponse[index].amount;
            var fromCurrency = historyResponse[index].fromCurrency;
            var result = historyResponse[index].result;
            var toCurrency = historyResponse[index].toCurrency;

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
    
};