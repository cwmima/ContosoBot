var builder = require('botbuilder');

exports.startDialog = function (bot) {

    var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/527fb0db-932a-41c7-a026-58f8454f89a0?subscription-key=84155cbdb30540dbbbf4a25ef0932802&verbose=true&timezoneOffset=0&q=');

    bot.recognizer(recognizer);

    bot.dialog('CurrencyExchange', function (session, args) {
        //if (!isAttachment(session)) {
            var fromCurrency = builder.EntityRecognizer.findEntity(args.intent.entities, 'from_currency');
            var toCurrency = builder.EntityRecognizer.findEntity(args.intent.entities, 'to_currency');

            if (fromCurrency) {
                if(toCurrency){
                    session.send('Converting %s to %s...', fromCurrency.entity, toCurrency.entity);
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