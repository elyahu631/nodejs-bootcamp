// create file in windows: --> New-Item -Path 'event-loop.js' -ItemType File

// The Event Loop in Practice 

const fs = require('fs');
const crypto = require('crypto');

const start = Date.now();
process.env.UV_THREADPOOL_SIZE = 3;

setTimeout(() => console.log('Timer 1 finished'), 0);
setImmediate(() => console.log('Immediate 1  finish'));

fs.readFile('test-file.txt', () => {
  console.log('I/O finished');

  setTimeout(() => console.log('Timer 2 finished'), 0);
  setTimeout(() => console.log('Timer 3 finished'), 1600);
  setImmediate(() => console.log('Immediate 2  finish'));

  process.nextTick(() => console.log('Process.nextTick'))



  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    console.log(Date.now() - start, "Password encrypted");
  })

  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    console.log(Date.now() - start, "Password encrypted");
  })

  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    console.log(Date.now() - start, "Password encrypted");
  })

  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    console.log(Date.now() - start, "Password encrypted");
  })

  crypto.pbkdf2Sync("password", "salt", 100000, 1024, "sha512");
  console.log(Date.now() - start, "Password encrypted");

  crypto.pbkdf2Sync("password", "salt", 100000, 1024, "sha512");
  console.log(Date.now() - start, "Password encrypted");
})

console.log('Hello  form the top-level code');