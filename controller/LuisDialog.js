var builder = require('botbuilder');
var qna = require('./QnAMaker');
var exchange = require('./ExchangeRateCard');

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

                    bot.beginDialog(message.address, 'menu');
                }
            });
        }
    });

    bot.dialog('menu', function (session) {
            // builder.Prompts.text(session, 'Hi! What is your name?');
            session.send("This is the menu.");
        }
    );

    bot.dialog('QnA', function (session, args, next) {
            //console.log(args["intent"]['score']);
            session.send("Looking up your question in QnA database...");
            qna.talkToQnA(session, session.message.text);
        }
    ).triggerAction({
        onFindAction: function(context, callback){
            var n = 0;
            // console.log(context);
            // console.log(context.intent);
            if(context.intent != null){
                if(context.intent.score < 0.9){
                    n = 1;
                }
            }
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
                            exchange.displayExchangeRateCard(session, amount, fromCurrency, toCurrency);
                        }
                    }else{
                        session.send('Converting %s to %s...', fromCurrency, toCurrency);
                        exchange.displayExchangeRateCard(session, 1, fromCurrency, toCurrency);
                    }
                }else{
                    session.send('Looking up exchange rates of %s...', fromCurrency);
                    exchange.displayExchangeRateCard(session, 1, fromCurrency, null);
                }
            } else {
                session.send("No currency code identified! Please try again.");
            }
        //}
    }).triggerAction({
        matches: 'CurrencyExchange'
    });

    bot.dialog('Welcome', function (session, args){
        session.send('Welcome to use Consoto Bot!');
    }).triggerAction({
        matches: 'Welcome'
    })

    
}