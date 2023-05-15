import TcpSocket from 'react-native-tcp-socket';
import { Buffer } from 'buffer';

const post = (APIKey, msgs, handleData) => {
  let headerLoaded = false;
  msgs = msgs.map(msg => ({
    role: msg.role,
    content: msg.content,
  }));
  const jsonData = JSON.stringify({
    model: 'gpt-3.5-turbo',
    messages: msgs,
    stream: true,
  });
  return new Promise((resolve, reject) => {
    const options = {
      port: 443,
      host: 'api.openai.com',
    };

    const data = `POST /v1/chat/completions HTTP/1.1
Host: api.openai.com
Content-Type: application/json
Content-Length: ${new Buffer.from(jsonData).length}
Authorization: Bearer ${APIKey}

${jsonData}
`;

    // Create socket
    const client = TcpSocket.connectTLS(options, () => {
      client.write(data);
    });

    client.on('data', function (res) {
      res = res.toString();
      if (!headerLoaded) {
        const [header, body] = res.split('\r\n\r\n');
        const statusCode = header.split('\n')[0].split(' ')[1];
        if (statusCode !== '200') {
          reject(body);
        }
        headerLoaded = true;
      }

      let hasError = false;
      try {
        hasError = typeof JSON.parse(res) === 'object';
      } catch {}

      if (hasError) {
        let error = JSON.parse(res).error;
        if (error.message) {
          reject(`${error.code}: ${error.message}`);
          return;
        }
      }

      res
        .split('\n\n')
        .filter(str => str.length > 2)
        .filter(str => str.indexOf('data: ') >= 0)
        .forEach(str => {
          if (str.split('data: ')[1].trim() === '[DONE]') {
            resolve('OK');
            return;
          }
          let body = str.split('data: ')[1];
          if (body) {
            try {
              let json = JSON.parse(body);
              let content = json.choices[0].delta.content;
              if (content) {
                handleData(content);
              }
            } catch (err) {
              console.log(str);
            }
          }
        });
    });

    client.on('error', function (error) {
      reject(`Network Error: ${error}`);
    });

    client.on('close', function () {
      reject('Connection closed!');
    });
  });
};

export { post };
