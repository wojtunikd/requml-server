exports.sanitizeText = input => {
    return input.replace(/\//g, "").replace(/\\/g, "").replace(/\"/g, "").replace(/\'/g, "").replace(/\</g, "").replace(/\>/g, "").replace(/\&/g, "").replace(/\;/g, "").replace(/\./g, "");
} 