
const fs = require('fs/promises');
const axios = require('axios');

let participants = [
    "Mario",
    "Luigi",
    "Daisy",
    "Toad",
    "Bowser"
];

let matches = {}; // KEY gives to VALUE

let firstone = participants[Math.floor(Math.random() * participants.length)];

choseGiftedFrom(firstone);

function choseGiftedFrom(current_participant) {

    let allowed_participants = participants.filter(p =>
        p !== current_participant &&
        !Object.values(matches).includes(p) &&
        matches[p] !== current_participant &&
        !Object.keys(matches).includes(p)
    );

    let chosenone = allowed_participants[Math.floor(Math.random() * allowed_participants.length)];

    matches[current_participant] = chosenone;

    if(!chosenone) {
        matches[current_participant] = firstone;
        return;
    }

    choseGiftedFrom(chosenone);
}

//console.log(matches);

const ids = {
    "Mario": "UMUSHROOM124",  // slack user IDs (from profile)
    "Luigi": "UGREEN81F",
    "Daisy": "U124",
    "Toad": "U987TTTABC",
    "Bowser": "UXXXXX666",
};

let items = [];
for(let [from, to] of Object.entries(matches)) {
    items.push(
        {
            from,
            to,
            from_id: ids[from]
        }
    );

    fs.writeFile(__dirname + "/santa/"+from+".txt", to);
}

// ----


items.forEach(async item => await sendSantasMessage(item));

/*
{
    from: SECRETSANTAUSER,
    to: GIFTRECEIVER,
    from_id: SLACKIDOFSECRETSANTA
}
 */
async function sendSantasMessage(item) {

    const slackToken = 'xxxx-SLACK-BOT-TOKEN-xxxx';

    let msg = `Ho! Ho! Ho!

It is me, the magic santa! I have a secret mission for you, ${item.from}! 
You are my secret undercover santa for *${item.to}*!

I also commanded someone else to be your secret santa. But you will never know who it is!

I have to go... Ho! Ho! Ho! 
`;

    const url = 'https://slack.com/api/chat.postMessage';

    const response = await axios.post(url, {
        channel: item.from_id,
        text: msg,
        icon_emoji: ':santa:'
    }, {headers: {authorization: `Bearer ${slackToken}`}});

    if(response.data.error) {
        console.log("couldn't send to " + item.from);
    }

}
