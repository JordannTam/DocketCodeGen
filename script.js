// Using unique non-sequential lowercase alphanumeric characters to Hash the Code for preventing sequential guessing
// Then use checksum with secret salt to prevent random guessing
// Use 2 characters represent storeId
// Use 3 characters represent date (YMD)
// Use 3 characters represent transactionId
// Use 1 character represent the checksum unit
const alphaArr = ['e', '6', 't', '3', 'h', 'd', 'j', 'p', 'k', '2', '8', '7', 'u', '4', '5', 's', 'z', '0', 'c', 'l', 'o', 'n', '9', 'w', 'y', 'g', 'b', 'i', 'f', 'r', 'v', 'x', 'q', '1', 'm', 'a']
function genDate() {
    const nowDate = new Date();
    const y = alphaArr[nowDate.getFullYear() - 2023];
    const m = alphaArr[nowDate.getMonth()];
    const d = alphaArr[nowDate.getDate()];
    return y + m + d;
}
function genStoreCode(storeId) {
    const code = storeId.toString(36).padStart(2,'0')
    let result = ''
    for(let i = 0; i < 2;i++){
        result += alphaArr[parseInt(code[i],36)]
    }
    return result
}
function genTransactionCode(transactionId) {
    const code = transactionId.toString(36).padStart(3,'0')
    let result = ''
    for(let i = 0; i < 3;i++){
        result += alphaArr[parseInt(code[i],36)]
    }
    return result
}


function generateShortCode(storeId, transactionId) {
// Checksum with Secret Salt to prevent random guessing

    let result = genStoreCode(storeId);
    result += genDate();
    result += genTransactionCode(transactionId);

    let total = 0;
    for (let i = 0; i < 8; i++){
        curr = result[i].charCodeAt(0)
        total += curr
    }
    const checkSum = (((total * 17) % 36)).toString(36)
    result += checkSum

    
    return result;
}

function decodeDate(date) {
    const y = alphaArr.indexOf(date[0]) + 2023;
    const m = alphaArr.indexOf(date[1]) + 1
    const d = alphaArr.indexOf(date[2])
    console.log(y + '-' + m + '-' + d);
    
    return new Date(y + '-' + m + '-' + d)
}
function decodeStoreId(storeCode) {
    let result = ''
    for(let i = 0; i < 2;i++){
        result += alphaArr.indexOf(storeCode[i]).toString(36)
    }
    return parseInt(result,36)
}
function decodeTransactionId(transactionCode) {
    let result = ''
    for(let i = 0; i < 3;i++){
        result += alphaArr.indexOf(transactionCode[i]).toString(36)
    }
    return parseInt(result,36)
}



function decodeShortCode(shortCode) {
// return storeId and transactionId -1 if the Check Sum failed
    const storeId = decodeStoreId(shortCode.slice(0,2));
    const date = decodeDate(shortCode.slice(2,5));
    const transactionId = decodeTransactionId(shortCode.slice(5,8), 36);
    let total = 0
    for (let i = 0; i < 8; i++){
        curr = shortCode[i].charCodeAt(0)
        total += curr
    }
    const checkSum = ((total * 17) % 36).toString(36)

    if (checkSum !== shortCode[8]) {
        return {
            storeId: -1,
            shopDate: new Date(),
            transactionId: -1
        }
    }
    return {
        storeId: storeId, // store id goes here,
        shopDate: date, // the date the customer shopped,
        transactionId: transactionId, // transaction id goes here
    };
}

// ------------------------------------------------------------------------------//
// --------------- Don't touch this area, all tests have to pass --------------- //
// ------------------------------------------------------------------------------//
function RunTests() {

    var storeIds = [175, 42, 0, 9]
    var transactionIds = [9675, 23, 123, 7]

    storeIds.forEach(function (storeId) {
        transactionIds.forEach(function (transactionId) {
            var shortCode = generateShortCode(storeId, transactionId);
            var decodeResult = decodeShortCode(shortCode);
            $("#test-results").append("<div>" + storeId + " - " + transactionId + ": " + shortCode + "</div>");
            AddTestResult("Length <= 9", shortCode.length <= 9);
            AddTestResult("Is String", (typeof shortCode === 'string'));
            AddTestResult("Is Today", IsToday(decodeResult.shopDate));
            AddTestResult("StoreId", storeId === decodeResult.storeId);
            AddTestResult("TransId", transactionId === decodeResult.transactionId);
        })
    })
}

function IsToday(inputDate) {
    // Get today's date
    var todaysDate = new Date();
    // call setHours to take the time out of the comparison
    return (inputDate.setHours(0, 0, 0, 0) == todaysDate.setHours(0, 0, 0, 0));
}

function AddTestResult(testName, testResult) {
    var div = $("#test-results").append("<div class='" + (testResult ? "pass" : "fail") + "'><span class='tname'>- " + testName + "</span><span class='tresult'>" + testResult + "</span></div>");
}
