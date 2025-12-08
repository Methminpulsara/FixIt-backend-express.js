module.exports = (user, viewer) => {
    if (!user) return {};

    const visibility = user.visibilitySettings || {
        showProfile: true,
        showPhone: false,
        showLocation: false
    };

    const isOwner = viewer && viewer._id?.toString() === user._id?.toString();
    const isMechanic = viewer?.type === "mechanic";
    const isGarage = viewer?.type === "garage";
    const isCustomer = viewer?.type === "customer";

    const filtered = {
        id: user._id,
        displayName: user.displayName,
        type: user.type
    };

    // Profile
    if (visibility.showProfile || isOwner) {
        filtered.firstName = user.firstName;
        filtered.lastName = user.lastName;
    }

    // Phone
    if ((visibility.showPhone && isMechanic) || isOwner) {
        filtered.phone = user.phone;
    }

    // Location
    if ((visibility.showLocation && (isMechanic || isGarage)) || isOwner) {
        filtered.location = user.location;
    }

    return filtered;
};
