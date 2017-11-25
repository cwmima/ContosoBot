var builder = require('botbuilder');
var qna = require('./QnAMaker');

exports.startDialog = function (bot) {

    var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/527fb0db-932a-41c7-a026-58f8454f89a0?subscription-key=84155cbdb30540dbbbf4a25ef0932802&verbose=true&timezoneOffset=0&q=');

    bot.recognizer(recognizer);

    bot.dialog('greetings', [
        // Step 1
        function (session) {
            builder.Prompts.text(session, 'Hi! What is your name?');
        },
        // Step 2
        function (session, results) {
            session.endDialog(`Hello ${results.response}!`);
        }
    ]);

    bot.dialog('QnA', function (session, args, next) {
            //console.log(args["intent"]['score']);
            session.send("Looking up your question in QnA database...");
            qna.talkToQnA(session, session.message.text);
        }
    ).triggerAction({
        onFindAction: function(context, callback){
            var n = 0;
            if(context.intent.score < 0.9){
                n = 1;
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
                if(toCurrency){
                    if(amount){
                        session.send('Converting %s %s to %s...', amount.entity.replace(/\s/g, ''), fromCurrency.entity, toCurrency.entity);
                    }else{
                        session.send('Converting %s to %s...', fromCurrency.entity, toCurrency.entity);
                    }
                }else{
                    session.send('Looking up exchange rates of %s...', fromCurrency.entity);
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