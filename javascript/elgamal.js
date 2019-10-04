function generateKey() {
    let p = getNumber("P");
    let g = getNumber("G");
    let x = getNumber("X");
    let y = fastExponentiation(g, x, p);
    document.getElementById("Y").value = y;
    document.getElementById("pubkey").value = `{${p}, ${g}, ${y}}`;
}

function encryptButtonClicked() {
    let m = getNumber("M");
    let cipher = encrypt(m);
    let c1 = cipher.c1;
    let c2 = cipher.c2;
    document.getElementById("C1").value = c1;
    document.getElementById("C2").value = c2;
    document.getElementById("cipher").value = `(${c1}, ${c2})`;
}

function encrypt(message) {
    let p = getNumber("P");
    let g = getNumber("G");
    let y = getNumber("Y");
    let k = getNumber("k");
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

function getNumber(id) {
    return Number(document.getElementById(id).value)
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