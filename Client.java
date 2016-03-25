import java.net.*;
import java.io.*;
import java.lang.*;

public class Client {
	public static void main(String[] args) throws UnsupportedEncodingException {
		String targetUrl = "http://localhost:8080";
		String urlParameters =
				"fName=" + URLEncoder.encode("Blake", "UTF-8") +
				"&lName=" + URLEncoder.encode("Mealey", "UTF-8");
		String returned = executeGet(targetUrl, urlParameters);
		System.out.println(returned);

		// do stuff with org.json in Android!
	}

	public static String executePost(String targetUrl, String urlParameters) {
		HttpURLConnection connection = null;
		try {
			URL url = new URL(targetUrl);
			connection = (HttpURLConnection)url.openConnection();
			connection.setRequestMethod("POST");
			connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");

			connection.setRequestProperty("Content-Length", Integer.toString(urlParameters.getBytes().length));
			connection.setRequestProperty("Content-Language", "en-US");

			connection.setUseCaches(false);
			connection.setDoOutput(true);

			DataOutputStream wr = new DataOutputStream(connection.getOutputStream());
			wr.writeBytes(urlParameters);
			wr.close();

			InputStream is = connection.getInputStream();
			BufferedReader rd = new BufferedReader(new InputStreamReader(is));
			StringBuilder response = new StringBuilder();
			String line;
			while((line = rd.readLine()) != null) {
				response.append(line);
				response.append('\r');
			}
			rd.close();
			return response.toString();
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		} finally {
			if(connection != null) {
				connection.disconnect();
			}
		}
	}
}
