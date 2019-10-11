// Validations

function updateErrorMessage(isValid, errorField, errorMessage) {
    if (!isValid) {
        errorField.innerText = errorMessage;
    } else {
        errorField.innerText = "";
    }
}

// Key Generation Validations
function validateKeys() {
    let isPValid = validateP();
    let isQValid = validateQ();
    let isGValid = validateG();
    let isXValid = validateX(isQValid);
    return isPValid && isQValid && isGValid && isXValid;
}

function validateP() {
    let p = getNumber("P");
    let isGreaterThan200 = p > 200;
    let isValid = isPrime(p) && isGreaterThan200;
    let errorField = document.getElementById("pError");
    updateErrorMessage(isValid, errorField, "Invalid P");
    return isValid;
}

function validateQ() {
    let q = getNumber("Q");
    let isValid = !isNaN(q) && isPrime(q);
    let errorField = document.getElementById("qError");
    updateErrorMessage(isValid, errorField, "Invalid Q");
    return isValid;
}

function validateG() {
    let errorField = document.getElementById("gError");
    let g = getNumber("G");
    let isValid = !isNaN(g);
    updateErrorMessage(isValid, errorField, "Invalid G");
    return isValid;
}

function validateX(isQValid) {
    generateRandomX();
    let errorField = document.getElementById("xError");
    if (!isQValid) {
        errorField.innerText = "Please enter a valid Q first";
        return false;
    }
    let x = getNumber("X");
    let q = getNumber("Q");
    let isValid = !isNaN(x) && x < q && x >= 1;
    updateErrorMessage(isValid, errorField, "Invalid X");
    return isValid;
}

function generateRandomX() {
    let x = getNumber("X");
    let q = getNumber("Q");
    if (isNaN(x) && !isNaN(q)) {
        document.getElementById("X").value = Math.floor(Math.random() * (q - 1)) + 1;
    }
}

function isPrime(number) {
    if (isNaN(number) || !isFinite(number) || number % 1 || number < 2) return false;
    if (number % 2 === 0) return (number === 2);
    if (number % 3 === 0) return (number === 3);
    let m = Math.sqrt(number);
    for (let i = 5; i <= m; i += 6) {
        if (number % i === 0) return false;
        if (number % (i + 2) === 0) return false;
    }
    return true;
}

// Encryption Validations
function validateEncParams() {
    let isMValid = validateM();
    let isKValid = validateK();
    return isMValid && isKValid;
}

function validateM() {
    let m = getNumber("M");
    let p = getNumber("P");
    let isValid = !isNaN(m) && m < p;
    let errorField = document.getElementById("mError");
    updateErrorMessage(isValid, errorField, "Invalid M");
    return isValid;
}

function validateK(kNum = "") {
    let k = getNumber("k" + kNum);
    let p = getNumber("P");
    let isValid = !isNaN(k) && k < p;
    let errorField = document.getElementById("k" + kNum + "Error");
    updateErrorMessage(isValid, errorField, "Invalid k");
    return isValid;
}

// Multiplication Validations
function validateNumbers() {
    let p = getNumber("P");
    let validFlags = [];
    for (let i = 0; i < 5; i++) {
        let id = "N" + i;
        let number = getNumber(id);
        let isValid = !isNaN(number) && number < p;
        let errorField = document.getElementById("n" + i + "Error");
        updateErrorMessage(isValid, errorField, "Invalid Number");
        validFlags.push(isValid);
    }
    let allValid = validFlags.every(flag => {
        return flag;
    });
    return allValid && validateKs();
}

function validateKs() {
    let p = getNumber("P");
    let validFlags = [];
    for (let i = 0; i < 5; i++) {
        validFlags.push(validateK(i));
    }
    return validFlags.every(flag => {
        return flag;
    });
}

// Main Functions

function generateKey() {
    if (!validateKeys()) {
        return;
    }
    let p = getNumber("P");
    let g = getNumber("G");
    let x = getNumber("X");
    let y = fastExponentiation(g, x, p);
    document.getElementById("Y").value = y;
    document.getElementById("pubkey").value = `{${p}, ${g}, ${y}}`;
    document.getElementById("encryptButton").disabled = false;
    document.getElementById("encryptAllButton").disabled = false;
}

function encryptButtonClicked() {
    if (!validateEncParams()) {
        return;
    }
    let m = getNumber("M");
    let k = getNumber("k");
    let cipher = encrypt(m, k);
    let c1 = cipher.c1;
    let c2 = cipher.c2;
    document.getElementById("C1").value = c1;
    document.getElementById("C2").value = c2;
    document.getElementById("cipher").value = `(${c1}, ${c2})`;
    document.getElementById("decryptButton").disabled = false;
}

function encrypt(message, k) {
    let p = getNumber("P");
    let g = getNumber("G");
    let y = getNumber("Y");
    let c1 = fastExponentiation(g, k, p);
    let K = fastExponentiation(y, k, p);
    let c2 = (K * message) % p;
    return {c1: c1, c2: c2};
}

function decryptButtonClicked() {
    let c1 = getNumber("C1");
    let c2 = getNumber("C2");
    document.getElementById("decrypted").value = decrypt(c1, c2);
}

function decrypt(c1, c2) {
    let x = getNumber("X");
    let p = getNumber("P");
    let K = fastExponentiation(c1, x, p);
    let inverseOfK = findInverse(K, p);
    return (c2 * inverseOfK) % p;
}

function encryptAll() {
    if (!validateNumbers()) {
        return;
    }
    let numbers = getFiveNumbers();
    for (let i = 0; i < 5; i++) {
        let k = getNumber("k" + i);
        let cipher = encrypt(numbers[i], k);
        let id = "EncN" + i;
        document.getElementById(id).value = `(${cipher.c1}, ${cipher.c2})`;
    }
    document.getElementById("multiplyAndCompareButton").disabled = false;
}

function multiplyAndCompare() {
    multiplyEncryptedNumbers();
    multiplyPlainNumbers();
    decryptProdOfEncNums();
}

function multiplyEncryptedNumbers() {
    let encryptedNumbers = getFiveEncryptedNumbers();
    let p = getNumber("P");
    let c1Product = 1;
    let c2Product = 1;
    for (let i = 0; i < 5; i++) {
        c1Product = (c1Product * encryptedNumbers[i].c1) % p;
        c2Product = (c2Product * encryptedNumbers[i].c2) % p;
    }
    document.getElementById("productC").value = `(${c1Product}, ${c2Product})`;
}

function multiplyPlainNumbers() {
    let numbers = getFiveNumbers();
    let product = 1;
    let p = getNumber("P");
    for (let number of numbers) {
        product = (product * number) % p;
    }
    document.getElementById("productP").value = product;
}

function decryptProdOfEncNums() {
    let encryptedProdStr = document.getElementById("productC").value;
    let cipher = processCipherString(encryptedProdStr);
    document.getElementById("decryptedPC").value = decrypt(cipher.c1, cipher.c2);
}

function getFiveNumbers() {
    let numbers = [];
    for (let i = 0; i < 5; i++) {
        let id = "N" + i;
        let num = Number(document.getElementById(id).value);
        numbers.push(num);
    }
    return numbers;
}

function getFiveEncryptedNumbers() {
    let ciphers = [];
    for (let i = 0; i < 5; i++) {
        let id = "EncN" + i;
        let cipherString = document.getElementById(id).value;
        ciphers.push(processCipherString(cipherString));
    }
    return ciphers;
}

function processCipherString(cipherString) {
    let stringArr = cipherString.replace(/[()]/g, "").split(", ");
    return {c1: Number(stringArr[0]), c2: Number(stringArr[1])};
}

function getNumber(id) {
    let value = document.getElementById(id).value;
    if (value === "") {
        return NaN;
    }
    return Number(value);
}

function fastExponentiation(base, exp, mod) {
    if (mod === 1) {
        return 0;
    }
    let result = 1;
    for (let i = 0; i < exp; i++) {
        result = result * base % mod;
    }
    return result;
}

function findInverse(num, mod) {
    if (mod === 1) {
        return 0; // No inverse
    }
    let originalMod = mod;
    let x = 1;
    let y = 0;
    while (num > 1) {
        let quotient = Math.trunc(num / mod);
        let temp = mod;
        mod = num % mod;
        num = temp;
        temp = y;
        y = x - quotient * y;
        x = temp;
    }
    if (x < 0) {
        x += originalMod;
    }
    return x;
}