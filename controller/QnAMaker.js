var rest = require('../API/RestClient');

exports.talkToQnA = function (session, question){
    var url = 'https://westus.api.cognitive.microsoft.com/qnamaker/v2.0/knowledgebases/d2b8264a-3aae-40ab-8e1d-29f29657fc77/generateAnswer';
    rest.postQnAResults(url, session, question, handleQnA)
};

function handleQnA(body, session, question) {
    session.send(body.answers[0].answer);
};