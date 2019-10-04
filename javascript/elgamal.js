function generateKey() {
    let p = Number(document.getElementById("P").value);
    let g = Number(document.getElementById("G").value);
    let x = Number(document.getElementById("X").value);
    let y = fastExponentiation(g, x, p);
    document.getElementById("Y").value = y;
    let pubKey = `{${p}, ${g}, ${y}}`;
    document.getElementById("pubkey").value = pubKey;
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