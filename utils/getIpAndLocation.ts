import axios from "axios";

export const getLocationData = async () => {
    try {
      // Fetch IP address from an IP geolocation service
      const ipResponse = await axios.get('https://api.ipify.org?format=json');
      const ipAddress = ipResponse?.data?.ip;
      // console.log(ipAddress, "ipAddress");
      // const url = `https://ipapi.co/${ipAddress}/json/`;
      const url = `https://ipinfo.io/${ipAddress}?token=7f09e20b25a348`;
      // console.log(url, "url");
      // get location data (latitude, longitude)
      const locationResponse = await axios.get(url);
      // console.log(locationResponse.data, "locationResponse.data");
      const { loc } = locationResponse?.data;

      const coordinates = loc?.split(',');

      // Assign the values to variables
      const latitude =coordinates?.[0];
      const longitude = coordinates?.[1];

      // console.log(latitude, longitude, "locationResponse.data");
      return { latitude: latitude ?? "12.96559", longitude: longitude ?? "77.60364" };
    } catch (error: any) {
      // console.error("Error getting location data:", error?.message);
      return { latitude: "12.96559", longitude: "77.60364" };
    }
  };