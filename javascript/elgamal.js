function generateKey() {
    let p = getNumber("P");
    let g = getNumber("G");
    let x = getNumber("X");
    let y = fastExponentiation(g, x, p);
    document.getElementById("Y").value = y;
    let pubKey = `{${p}, ${g}, ${y}}`;
    document.getElementById("pubkey").value = pubKey;
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