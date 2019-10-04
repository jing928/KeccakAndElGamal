function generateKey() {
    let p = getNumber("P");
    let g = getNumber("G");
    let x = getNumber("X");
    let y = fastExponentiation(g, x, p);
    document.getElementById("Y").value = y;
    let pubKey = `{${p}, ${g}, ${y}}`;
    document.getElementById("pubkey").value = pubKey;
}

function encrypt() {
    let p = getNumber("P");
    let g = getNumber("G");
    let y = getNumber("Y");
    let m = getNumber("M");
    let k = getNumber("k");
    let c1 = fastExponentiation(g, k, p);
    let K = fastExponentiation(y, k, p);
    let c2 = (K * m) % p;
    document.getElementById("C1").value = c1;
    document.getElementById("C2").value = c2;
    let cipher = `(${c1}, ${c2})`;
    document.getElementById("cipher").value = cipher;
}

function decrypt() {
    let c1 = getNumber("C1");
    let c2 = getNumber("C2");
    let x = getNumber("X");
    let p = getNumber("P");
    let K = fastExponentiation(c1, x, p);
    let inverseOfK = findInverse(K, p);
    let decrypted = (c2 * inverseOfK) % p;
    document.getElementById("decrypted").value = decrypted;
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