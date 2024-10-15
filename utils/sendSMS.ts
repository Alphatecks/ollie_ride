import axios from 'axios';

interface SmsOptions {
  from: string;
  to: string | string[]; // Single or multiple numbers
  body: string;
  dnd?: 1 | 2; // Optional: 1 for refund, 2 for corporate route
}



const sendSms = async ({ from, to, body, dnd = 2 }: SmsOptions): Promise<void> => {
  const url = 'https://www.bulksmsnigeria.com/api/v1/sms/create';

  try {
    const response = await axios.post(url, null, {
      params: {
        api_token: "wvDSG8DdIiIIt61ejvd0SsNFIwU3XZrvZTcO3jpcK7by0Z4FJjMV0xZlXI5J",
        from,
        to: Array.isArray(to) ? to.join(',') : to, // Convert array to comma-separated string
        body,
        dnd
      }
    });

    console.log('SMS sent successfully:', response.data);
  } catch (error) {
    console.error('Error sending SMS:', error);
  }
};

export default sendSms;
