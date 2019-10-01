function runRound() {
    let roundNumber = Number(document.getElementById("roundNumber").textContent);
    if (roundNumber === 11) {
        alert("Maximum round reached...Please reset the program.");
        return;
    }
    runTheta(roundNumber);
    runPi();
    runChi();
    runIota();
    updateRound();
}

function createID(base, x, y) {
    return base + x + y;
}

function copyMatrix(from, to) {
    for (let x = 0; x < 5; x++) {
        for (let y = 0; y < 5; y++) {
            let fromField = document.getElementById(createID(from, x, y));
            let toField = document.getElementById(createID(to, x, y));
            toField.value = fromField.value;
        }
    }
}

function updateRound() {
    let currentRound = Number(document.getElementById("roundNumber").textContent);
    let newRound = Math.min(11, currentRound + 1);
    document.getElementById("roundNumber").textContent = newRound.toString();
}

// Theta Step
function runTheta(rc) {
    if (rc === 0) {
        copyMatrix("Original", "ThetaIn");
    } else {
        copyMatrix("IotaOut", "ThetaIn");
    }
    generateC();
    generateD();
    for (let x = 0; x < 5; x++) {
        let dx = Number(document.getElementById(createID("D", x, "")).value);
        for (let y = 0; y < 5; y++) {
            let inValue = Number(document.getElementById(createID("ThetaIn", x, y)).value);
            document.getElementById(createID("ThetaOut", x, y)).value = inValue ^ dx;
        }
    }
}

function generateC() {
    for (let x = 0; x < 5; x++) {
        let id = createID("C", x, "");
        let cxField = document.getElementById(id);
        let cx = Number(document.getElementById(createID("ThetaIn", x, "0")).value);
        for (let y = 1; y < 5; y++) {
            let lxy = Number(document.getElementById(createID("ThetaIn", x, y)).value);
            cx = cx ^ lxy
        }
        cxField.value = cx;
    }
}

function generateD() {
    for (let x = 0; x < 5; x++) {
        let xMinus1 = (x - 1 + 5) % 5;
        let xPlus1 = (x + 1) % 5;
        let id = createID("D", x, "");
        let dxField = document.getElementById(id);
        let cxMinus1 = Number(document.getElementById(createID("C", xMinus1, "")).value);
        let cxPlus1 = Number(document.getElementById(createID("C", xPlus1, "")).value);
        dxField.value = cxMinus1 ^ cxPlus1;
    }
}

// Pi Step
function runPi() {
    copyMatrix("ThetaOut", "PiIn");
    for (let x = 0; x < 5; x++) {
        for (let y = 0; y < 5; y++) {
            let xPrime = y;
            let yPrime = (2 * x + 3 * y) % 5;
            let inID = createID("PiIn", x, y);
            let outID = createID("PiOut", xPrime, yPrime);
            document.getElementById(outID).value = document.getElementById(inID).value;
        }
    }
}

// Chi Step
function runChi() {
    copyMatrix("PiOut", "ChiIn");
    for (let x = 0; x < 5; x++) {
        for (let y = 0; y < 5; y++) {
            let notBPlusOne = calculateNotBPlusOne(x, y);
            let bPlusTwo = calculateBPlusTwo(x, y);
            calculateFinalOutput(x, y, notBPlusOne, bPlusTwo);
        }
    }
}

function calculateNotBPlusOne(x, y) {
    let bPlusOneX = (x + 1) % 5;
    let bPlusOne = Number(document.getElementById(createID("ChiIn", bPlusOneX, y)).value);
    let notBPlusOne = bPlusOne ^ 1;
    document.getElementById(createID("NotBPlusOne", x, y)).value = notBPlusOne;
    return notBPlusOne;
}

function calculateBPlusTwo(x, y) {
    let bPlusTwoX = (x + 2) % 5;
    let bPlusTwo = Number(document.getElementById(createID("ChiIn", bPlusTwoX, y)).value);
    document.getElementById(createID("BPlusTwo", x, y)).value = bPlusTwo;
    return bPlusTwo;
}

function calculateFinalOutput(x, y, notBPlusOne, BPlusTwo) {
    let chiInput = Number(document.getElementById(createID("ChiIn", x, y)).value);
    let chiOutput = chiInput ^ (notBPlusOne & BPlusTwo);
    document.getElementById(createID("ChiOut", x, y)).value = chiOutput;
}

// Iota Step

function runIota() {
    copyMatrix("ChiOut", "IotaIn");
    let roundNum = Number(document.getElementById("roundNumber").textContent);
    document.getElementById("roundConstant").value = ROUND_CONSTANTS[roundNum];
    copyMatrix("IotaIn", "IotaOut");
    let roundConstant = processRoundConstant(roundNum);
    let l00 = Number(document.getElementById(createID("IotaIn", "0", "0")).value);
    document.getElementById(createID("IotaOut", "0", "0")).value = l00 ^ roundConstant;
}

const ROUND_CONSTANTS = [
    "0x0000000000000001",
    "0x0000000000008082",
    "0x800000000000808A",
    "0x8000000080008000",
    "0x000000000000808B",
    "0x0000000080000001",
    "0x8000000080008081",
    "0x8000000000008009",
    "0x000000000000008A",
    "0x0000000000000088",
    "0x0000000080008009",
    "0x000000008000000A"
];

function processRoundConstant(round) {
    let roundConstant = ROUND_CONSTANTS[round];
    let firstHexDigit = roundConstant[2];
    let bin = parseInt(firstHexDigit, 16).toString(2);
    return parseInt(bin[0]);
}
