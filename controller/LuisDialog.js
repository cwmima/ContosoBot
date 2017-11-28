var builder = require('botbuilder');
var qna = require('./QnAMaker');
var exchange = require('./ExchangeRateCard');
var history = require('./HistoryCard');
var lastIntent = "";
var today = new Date();
var date = today.getDate()+"/"+(today.getMonth()+1)+"/"+today.getFullYear();

exports.startDialog = function (bot) {

    var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/527fb0db-932a-41c7-a026-58f8454f89a0?subscription-key=84155cbdb30540dbbbf4a25ef0932802&verbose=true&timezoneOffset=0&q=');

    bot.recognizer(recognizer);

    bot.on('conversationUpdate', function (message) {
        if (message.membersAdded) {
            message.membersAdded.forEach(function (identity) {
                // Bot is joining conversation
                if (identity.id === message.address.bot.id) {
                    var greeting = new builder.Message()
                    .address(message.address)
                    .text("Welcome to use Contoso Bot! You can check the following hints on how to use this chat bot :)");
                    bot.send(greeting);

                    bot.beginDialog(message.address, 'Menu');
                }
            });
        }
    });

    bot.dialog('Menu', function (session) {
        // session.say('Please hold while I calculate a response.', 
        // 'Please hold while I calculate a response.', 
        // { inputHint: builder.InputHint.ignoringInput }
        // );
        session.send(new builder.Message(session).addAttachment({
            contentType: "application/vnd.microsoft.card.adaptive",
            content:
            {
                "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
                "type": "AdaptiveCard",
                "version": "1.0",
                "body": [
                    {
                        "type": "TextBlock",
                        "text": "**\"convert NZD\"**",
                        "wrap": true,
                        "size": "large"
                    },
                    {
                        "type": "TextBlock",
                        "text": "-- check the exchange rates list of NZD",
                        "wrap": true,
                        "size": "medium"
                    },
                    {
                        "type": "TextBlock",
                        "text": "**\"convert NZD to USD\"** or **\"convert 10.25 NZD to USD\"**" ,
                        "wrap": true,
                        "size": "large"
                    },
                    {
                        "type": "TextBlock",
                        "text": "-- convert NZD to USD",
                        "wrap": true,
                        "size": "medium"
                    },
                    {
                        "type": "TextBlock",
                        "text": "**\"turn on/off history\"**",
                        "wrap": true,
                        "size": "large"
                    },
                    {
                        "type": "TextBlock",
                        "text": "-- turn on/off history recording",
                        "wrap": true,
                        "size": "medium"
                    },
                    {
                        "type": "TextBlock",
                        "text": "**\"show/clear history\"**",
                        "wrap": true,
                        "size": "large"
                    },
                    {
                        "type": "TextBlock",
                        "text": "-- show/clear history recording",
                        "wrap": true,
                        "size": "medium"
                    },
                    {
                        "type": "TextBlock",
                        "text": "You can also ask me some general questions, I will try to answer it using my QnA database.",
                        "wrap": true,
                        "size": "medium"
                    },
                    {
                        "type": "TextBlock",
                        "text": "Type **\"menu\"** or **\"help\"** to show this menu again.",
                        "wrap": true,
                        "size": "medium"
                    }
                ]
            }
        }));
    }).triggerAction({
        matches: 'Menu'
    });

    bot.dialog('QnA', function (session, args, next) {
            //console.log(args["intent"]['score']);
            session.send("Looking up your question in QnA database...");
            qna.talkToQnA(session, session.message.text);
        }
    ).triggerAction({
        onFindAction: function(context, callback){
            var n = 0;
            console.log(context);
            console.log(context.intent);

            if((context.intent != null && lastIntent != "TurnOnHistory" && lastIntent != "ShowHistory" && lastIntent != "ClearHistory") || (context.intent != null && context.conversationData["username"])){
                if(context.intent.score < 0.5){
                    n = 1;
                }
            }
            if (context.intent){
                lastIntent = context.intent.intent;
            }
            console.log("This is lastIntent : ******* " + lastIntent);
            callback(null, n);
        }
    });

    bot.dialog('CurrencyExchange', function (session, args) {
        //if (!isAttachment(session)) {
            var fromCurrency = builder.EntityRecognizer.findEntity(args.intent.entities, 'from_currency');
            var toCurrency = builder.EntityRecognizer.findEntity(args.intent.entities, 'to_currency');
            var amount = builder.EntityRecognizer.findEntity(args.intent.entities, 'amount');

            if (fromCurrency) {
                fromCurrency = fromCurrency.entity.toUpperCase();
                if(toCurrency){
                    toCurrency = toCurrency.entity.toUpperCase();
                    if(amount){
                        amount = amount.entity.replace(/\s/g, '');
                        amount = parseFloat(amount);

                        if(isNaN(amount)){
                            session.send("The amount of currency is not a number. Please try again.");
                        }else{
                            session.send('Converting %s %s to %s...', amount, fromCurrency, toCurrency);
                            exchange.displayExchangeRateCard(session, amount, fromCurrency, toCurrency, date);
                        }
                    }else{
                        session.send('Converting %s to %s...', fromCurrency, toCurrency);
                        exchange.displayExchangeRateCard(session, 1, fromCurrency, toCurrency, date);
                    }
                }else{
                    session.send('Looking up exchange rates of %s...', fromCurrency);
                    exchange.displayExchangeRateCard(session, 1, fromCurrency, null, date);
                }
            } else {
                session.send("No currency code identified! Please try again.");
            }
        //}
    }).triggerAction({
        matches: 'CurrencyExchange'
    });

    bot.dialog('TurnOnHistory', [
        function (session, args, next) {
            session.dialogData.args = args || {};
            if (!session.conversationData["username"]) {
                builder.Prompts.text(session, "To turn on history recording, please enter your username: ");
            } else {
                next();
            }
        },
        function (session, results, next) {
            // if (!isAttachment(session)) {
                if (results.response) {
                    session.conversationData["username"] = results.response;
                }
                session.conversationData["isTurnedOn"] = true;
                session.send("Great! Your currency conversion history will be recorded now.");
            // }
        }
    ]).triggerAction({
        matches: 'TurnOnHistory'
    });

    bot.dialog('TurnOffHistory', function(session, args){
        session.conversationData["isTurnedOn"] = false;
        session.send("History recording has been turned off.");
    }).triggerAction({
        matches: 'TurnOffHistory'
    })

    bot.dialog('ShowHistory',  [
        function (session, args, next) {
            session.dialogData.args = args || {};
            if (!session.conversationData["username"]) {
                builder.Prompts.text(session, "To show your history, please enter your username: ");
            } else {
                next();
            }
        },
        function (session, results, next) {
                if (results.response) {
                    session.conversationData["username"] = results.response;
                }
                history.showHistory(session, session.conversationData['username']); 
        }
    ]).triggerAction({
        matches: 'ShowHistory'
    })

    bot.dialog('ClearHistory', [
        function (session, args, next) {
            session.dialogData.args = args || {};
            if (!session.conversationData["username"]) {
                builder.Prompts.text(session, "To clear your history, please enter your username: ");
            } else {
                next();
            }
        },
        function (session, results, next) {
                if (results.response) {
                    session.conversationData["username"] = results.response;
                }
                history.clearHistory(session, session.conversationData['username']); 
                session.send("Great! Your currency conversion history is all cleared.");
        }
    ]).triggerAction({
        matches: 'ClearHistory'
    });

    bot.dialog('Welcome', function (session, args){
        session.send("Welcome to use Consoto Bot! Type \'menu\' or \'help\' to show the menu.");
    }).triggerAction({
        matches: 'Welcome'
    })

    
}