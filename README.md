# Desmos Golf Site

The source code for the Desmos Code Golf Site (both server and client).

## Server Setup

Before running the server, you have to set up `server/.env` with an admin passcode that gives you write access to the challenge list so you can easily create new challenges. It should go without saying, but don't reuse an existing password for this, because it's both stored and transmitted in plaintext (though it's theoretically secure over HTTPS).

For example, to get the password "admin", run `echo 'admin_pass=admin' > server/.env`. Of course, you can also edit the file directly. There's other options too. The default settings are `hostname=localhost` and `port=80`, but you can change it by e.g. adding a line `port=8080`.

Then to actually run the server:

```sh
cd server
npm i
npm run dev
# close after compiling or open new terminal
npm start
```

## Client Setup

```sh
cd client/sandbox
npm i
npm run build
```
