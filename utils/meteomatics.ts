import axios from 'axios';

export const getToken = async () => {
    try {
        const username = 'freelancer_lucuss_hendry';
        const password = 'vKR8HkW5y1'; 
      
        const authString = btoa(username + ":" + password);
        
        const response: any = await axios({
            method: 'get',
            url: 'https://login.meteomatics.com/api/v1/token',
            headers: {
                'Authorization': 'Basic ' + authString
            }
        })

        if (response?.status === 200) {
            return {token: response?.data?.access_token, status: response?.status};
        }

    } catch (error) {
        console.error('Error fetching token:', error);
        return null;
    }
}