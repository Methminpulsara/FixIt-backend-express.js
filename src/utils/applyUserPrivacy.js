const privacyEngine = require("./privacyEngine");

module.exports = (user, viewer) => {
    return privacyEngine(user, viewer);
};
