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