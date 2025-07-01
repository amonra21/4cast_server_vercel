export const mapWeatherCodeToIcon = (code: number): string => {
    switch (true) {
        case code === 0:
            return "sunny";
        case code >= 1 && code <= 3:
            return "partly-cloudy";
        case code === 45 || code === 48:
            return "fog";
        case (code >= 51 && code <= 67):
            return "rain";
        case (code >= 71 && code <= 77):
            return "snow";
        case (code >= 80 && code <= 82):
            return "rain";
        case (code >= 95):
            return "storm";
        default:
            return "unknown";
    }
};