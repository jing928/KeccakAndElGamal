function run() {
    runTheta();
    runPi();
    runChi();
}

// Theta Step
function runTheta() {
    copyMatrix("Original", "ThetaIn");
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
