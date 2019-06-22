///////////////////////////////
// Send Data
///////////////////////////////

const iotaLibrary = require('@iota/core');
const Converter = require('@iota/converter');
const rp = require('request-promise');

//The node to connect with
const iota = iotaLibrary.composeAPI({
  provider: 'https://nodes.thetangle.org:443'
})

// Use a random seed as there is no tokens being sent.
const seed =
  'PUEOTSEITFEVEWCWBTSIZM9NKAAJEIMXTULBACGFRFF9IMGICLBKW9TTEVCCQMGWKBXPVCBMMCXWMNPDX'

// Create a variable for the address we will send too
const address =
  'LOREMOORLDHELLOWORLDVXLLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLHWORLDHELLOWORLWD'

//Request options for CoinMarketCap
const requestOptions = {
  method: 'GET',
  uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest',
  qs: {
    'symbol' : 'MIOTA'
  },
  headers: {
    'X-CMC_PRO_API_KEY': 'ffd96479-5c84-46c8-8d21-1f71166109d9'
  },
  json: true,
  gzip: true
};

/* Example in Node.js ES6 using request-promise */
function SendPriceToIOTA() {
  rp(requestOptions).then(response => {
    console.log('API Response received');
    //Prepare the transaction
    const transfers = [
      {
        value: 0,
        address: address, // Where the data is being sent
        message: Converter.asciiToTrytes(JSON.stringify(response.data.MIOTA.quote)) // The message converted into trytes
      }
    ]
    
    //Send the transactions
    iota
      .prepareTransfers(seed, transfers)
      .then(trytes => iota.sendTrytes(trytes, 3, 14)) //MWM = 14 for mainnet
      .then(bundle => {
        console.log('Transfer successfully sent')
        bundle.map(tx => console.log(tx))
      })
      .catch(err => {
        console.log(err)
      })
  }).catch((err) => {
    console.log('API call error:', err.message);
  });
}

//Repeat the function call every 30 seconds
setInterval(SendPriceToIOTA, 30000);






