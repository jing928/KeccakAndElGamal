function run() {
    runTheta();
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
